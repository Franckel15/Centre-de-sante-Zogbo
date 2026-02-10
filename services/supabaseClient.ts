
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
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    console.warn(`Erreur lors de la lecture de la variable ${key}`, e);
  }
  return fallback;
};

// Configuration
const SUPABASE_URL = getEnv('VITE_SUPABASE_URL', 'https://ytlpfnvxqevondcdtfaw.supabase.co');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0bHBmbnZ4cWV2b25kY2R0ZmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzM1NDcsImV4cCI6MjA4MTMwOTU0N30.1rk3c-dV8-AuibNObtvJe7FNM2fmzy3ndpGhBG_a_YE');

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
