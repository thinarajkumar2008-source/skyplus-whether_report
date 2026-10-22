/**
 * SkyPulse 3.0 - Authentication & Personalization Service
 * Supports Supabase Auth (when credentials configured) with a built-in
 * cryptographic vault provider (Web Crypto SHA-256) for complete offline/standalone reliability.
 */

const SkyPulseAuth = (function () {
  const STORAGE_KEYS = {
    SESSION: 'skypulse_auth_session',
    USERS: 'skypulse_auth_users',
    SUPABASE_CONFIG: 'skypulse_supabase_config',
    FAVORITES_SYNC: 'skypulse_synced_favorites'
  };

  // State
  let currentUser = null;
  let supabaseClient = null;
  const authListeners = [];

  // Storage Fallback for Universal Compatibility
  const memStore = {};
  const safeStorage = {
    getItem(key) {
      try {
        if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
      } catch (e) {}
      return memStore[key] || null;
    },
    setItem(key, val) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, val);
          return;
        }
      } catch (e) {}
      memStore[key] = String(val);
    },
    removeItem(key) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
          return;
        }
      } catch (e) {}
      delete memStore[key];
    }
  };

  /**
   * Initialize Auth System
   */
  async function init() {
    // 1. Check for Supabase configuration
    const sbConfig = getSupabaseConfig();
    if (sbConfig && sbConfig.url && sbConfig.anonKey && typeof window !== 'undefined' && typeof window.supabase !== 'undefined') {
      try {
        supabaseClient = window.supabase.createClient(sbConfig.url, sbConfig.anonKey);
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
          currentUser = normalizeSupabaseUser(session.user);
          notifyListeners('SIGNED_IN', currentUser);
          return;
        }
      } catch (sbErr) {
        console.warn('Supabase initialization failed, falling back to secure vault:', sbErr);
      }
    }

    // 2. Fallback: Restore local session if exists
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.SESSION);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.email) {
          currentUser = parsed;
          notifyListeners('SIGNED_IN', currentUser);
        }
      }
    } catch (e) {
      console.warn('Could not restore auth session:', e);
    }
  }

  function getSupabaseConfig() {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    if (typeof window !== 'undefined' && window.SUPABASE_CONFIG) return window.SUPABASE_CONFIG;
    return null;
  }

  function setSupabaseConfig(url, anonKey) {
    if (url && anonKey) {
      safeStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() }));
    } else {
      safeStorage.removeItem(STORAGE_KEYS.SUPABASE_CONFIG);
    }
  }

  function isSupabaseConnected() {
    return !!supabaseClient;
  }

  function normalizeSupabaseUser(sbUser) {
    return {
      id: sbUser.id,
      email: sbUser.email,
      name: sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],
      avatar: sbUser.user_metadata?.avatar_url || '',
      createdAt: sbUser.created_at || new Date().toISOString(),
      provider: 'supabase',
      favorites: sbUser.user_metadata?.favorites || [],
      defaultCity: sbUser.user_metadata?.default_city || 'London, United Kingdom',
      preferredUnit: sbUser.user_metadata?.preferred_unit || 'C'
    };
  }

  /**
   * Cryptographic Hash Helper (SHA-256)
   */
  async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + (salt || 'skypulse_aurora_salt'));
    const cryptObj = typeof globalThis !== 'undefined' && globalThis.crypto 
      ? globalThis.crypto 
      : (typeof crypto !== 'undefined' ? crypto : null);
    if (!cryptObj || !cryptObj.subtle) {
      // Simple fallback for environments without WebCrypto subtle
      let hash = 0;
      const str = password + (salt || 'skypulse_aurora_salt');
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return 'hash_' + Math.abs(hash).toString(16);
    }
    const hashBuffer = await cryptObj.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Local Users Database Helpers
   */
  function getLocalUsers() {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocalUsers(users) {
    try {
      safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {}
  }

  /**
   * Register new account
   */
  async function signUp(fullName, email, password) {
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(fullName).trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // If Supabase is active
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            default_city: 'London, United Kingdom',
            preferred_unit: 'C'
          }
        }
      });
      if (error) throw error;
      if (data.user) {
        currentUser = normalizeSupabaseUser(data.user);
        notifyListeners('SIGNED_IN', currentUser);
        return currentUser;
      }
    }

    // Local Vault registration
    const users = getLocalUsers();
    const existing = users.find(u => u.email === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    const salt = Math.random().toString(36).substring(2, 10);
    const passwordHash = await hashPassword(password, salt);

    // Merge any existing anonymous favorites
    let initialFavorites = [];
    try {
      const anonFavs = safeStorage.getItem('sky_pulse_favorites');
      if (anonFavs) initialFavorites = JSON.parse(anonFavs);
    } catch (e) {}

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: cleanName || cleanEmail.split('@')[0],
      email: cleanEmail,
      salt: salt,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
      provider: 'local_vault',
      favorites: initialFavorites,
      defaultCity: 'London, United Kingdom',
      preferredUnit: safeStorage.getItem('weather_unit') || 'C'
    };

    users.push(newUser);
    saveLocalUsers(users);

    // Save session
    const sessionUser = { ...newUser };
    delete sessionUser.passwordHash;
    delete sessionUser.salt;

    currentUser = sessionUser;
    safeStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    notifyListeners('SIGNED_IN', currentUser);

    return currentUser;
  }

  /**
   * Sign In
   */
  async function signIn(email, password, rememberMe = true) {
    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Please enter both email and password.');
    }

    // If Supabase is active
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });
      if (error) throw error;
      if (data.user) {
        currentUser = normalizeSupabaseUser(data.user);
        notifyListeners('SIGNED_IN', currentUser);
        return currentUser;
      }
    }

    // Local Vault login
    const users = getLocalUsers();
    const user = users.find(u => u.email === cleanEmail);
    if (!user) {
      throw new Error('No account found with this email address. Please check spelling or register.');
    }

    const inputHash = await hashPassword(password, user.salt);
    if (inputHash !== user.passwordHash) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    const sessionUser = { ...user };
    delete sessionUser.passwordHash;
    delete sessionUser.salt;

    currentUser = sessionUser;
    safeStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));

    notifyListeners('SIGNED_IN', currentUser);
    return currentUser;
  }

  /**
   * Sign Out
   */
  async function signOut() {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {}
    }

    currentUser = null;
    safeStorage.removeItem(STORAGE_KEYS.SESSION);
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (e) {}
    notifyListeners('SIGNED_OUT', null);
  }

  /**
   * Request Password Reset
   */
  async function requestPasswordReset(email) {
    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    if (supabaseClient && typeof window !== 'undefined') {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: window.location.origin + '/login'
      });
      if (error) throw error;
      return { success: true, message: 'Password recovery email sent via Supabase.' };
    }

    const users = getLocalUsers();
    const user = users.find(u => u.email === cleanEmail);
    if (!user) {
      throw new Error('No account registered with that email address.');
    }

    // For local vault, generate secure reset token
    const token = 'rst_' + Math.random().toString(36).substring(2, 12);
    user.resetToken = token;
    user.resetExpires = Date.now() + (3600 * 1000); // 1 hour
    saveLocalUsers(users);

    return {
      success: true,
      message: `Password reset instructions created. (Local security verification code: ${token})`,
      token: token
    };
  }

  /**
   * Reset Password with token
   */
  async function resetPassword(arg1, arg2, arg3) {
    let token, newPassword;
    if (arg3 !== undefined) {
      token = arg2;
      newPassword = arg3;
    } else {
      token = arg1;
      newPassword = arg2;
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    const users = getLocalUsers();
    const user = users.find(u => u.resetToken === token && Date.now() <= u.resetExpires);
    if (!user) {
      throw new Error('Invalid or expired reset verification token.');
    }

    user.salt = Math.random().toString(36).substring(2, 10);
    user.passwordHash = await hashPassword(newPassword, user.salt);
    delete user.resetToken;
    delete user.resetExpires;
    saveLocalUsers(users);

    return { success: true, message: 'Password successfully updated! You can now log in.' };
  }

  /**
   * Update Profile & Preferences
   */
  async function updateProfile(updates = {}) {
    if (!currentUser) throw new Error('Not authenticated.');

    currentUser = { ...currentUser, ...updates };

    if (supabaseClient) {
      try {
        await supabaseClient.auth.updateUser({
          data: {
            full_name: currentUser.name,
            default_city: currentUser.defaultCity,
            preferred_unit: currentUser.preferredUnit,
            favorites: currentUser.favorites
          }
        });
      } catch (e) {
        console.warn('Supabase metadata update failed:', e);
      }
    }

    // Update in local users database
    const users = getLocalUsers();
    const idx = users.findIndex(u => u.id === currentUser.id || u.email === currentUser.email);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      saveLocalUsers(users);
    }

    safeStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    notifyListeners('USER_UPDATED', currentUser);
    return currentUser;
  }

  /**
   * Sync Favorites
   */
  async function syncFavorite(cityFullName, action = 'toggle') {
    if (!cityFullName) return;
    let favs = currentUser ? [...(currentUser.favorites || [])] : [];

    const exists = favs.some(f => f.toLowerCase() === cityFullName.toLowerCase());
    if (action === 'toggle') {
      if (exists) {
        favs = favs.filter(f => f.toLowerCase() !== cityFullName.toLowerCase());
      } else {
        favs.push(cityFullName);
      }
    } else if (action === 'add' && !exists) {
      favs.push(cityFullName);
    } else if (action === 'remove') {
      favs = favs.filter(f => f.toLowerCase() !== cityFullName.toLowerCase());
    }

    if (currentUser) {
      await updateProfile({ favorites: favs });
    } else {
      safeStorage.setItem('sky_pulse_favorites', JSON.stringify(favs));
    }

    return favs;
  }

  /**
   * Event Listeners
   */
  function onAuthStateChange(callback) {
    if (typeof callback === 'function') {
      authListeners.push(callback);
      // Immediately call with current state
      callback(currentUser ? 'SIGNED_IN' : 'SIGNED_OUT', currentUser);
    }
  }

  function notifyListeners(event, user) {
    authListeners.forEach(cb => {
      try {
        cb(event, user);
      } catch (e) {
        console.warn('Auth listener error:', e);
      }
    });
  }

  return {
    init,
    getUser: () => currentUser,
    isAuthenticated: () => !!currentUser,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    syncFavorite,
    onAuthStateChange,
    getSupabaseConfig,
    setSupabaseConfig,
    isSupabaseConnected
  };
})();

if (typeof window !== 'undefined') window.SkyPulseAuth = SkyPulseAuth;
if (typeof global !== 'undefined') global.SkyPulseAuth = SkyPulseAuth;
if (typeof module !== 'undefined' && module.exports) module.exports = SkyPulseAuth;
