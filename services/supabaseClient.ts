
import { createClient } from '@supabase/supabase-js';

// --- Gestion Sécurisée des Variables d'Environnement ---
// Cette fonction empêche l'application de crasher si import.meta ou process.env ne sont pas définis
const getEnv = (key: string, fallback: string): string => {
  try {
    // 1. Essai via Vite (import.meta.env)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
    // 2. Essai via Process (Webpack/Create React App)
    const proc = (globalThis as any).process;
    if (proc && proc.env && proc.env[key]) {
      return proc.env[key];
    }
  } catch (e) {
    console.warn(`Erreur lors de la lecture de la variable ${key}`, e);
  }
  return fallback;
};

// Configuration issue exclusivement des variables d'environnement
const SUPABASE_URL = getEnv('VITE_SUPABASE_URL', '');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY', '');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Configuration Supabase manquante : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définies.");
}

// Adaptateur de stockage sécurisé pour éviter les erreurs SSR ou Cross-Browser
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('LocalStorage access denied', e);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: safeStorage
  }
});
