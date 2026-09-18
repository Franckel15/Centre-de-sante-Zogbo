/**
 * Utilitaires de validation et de sécurité pour le Centre de Santé de Zogbo
 * Conformes aux normes de sécurité et au plan national de numérotation du Bénin (10 chiffres avec préfixe 01).
 */

/**
 * Validation stricte du format email (RFC 5322)
 * Empêche les entrées invalides comme "5@", "test@", "user@domain" sans TLD valide d'au moins 2 lettres.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 6 || trimmed.length > 254) return false;

  // Regex stricte exigeant un nom d'utilisateur, un arobase, un domaine et un TLD d'au moins 2 lettres alphabétiques
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
  return emailRegex.test(trimmed);
};

export interface BeninPhoneValidationResult {
  isValid: boolean;
  normalized: string;
  error?: string;
}

/**
 * Validation et normalisation du numéro de téléphone selon le format béninois.
 * - Plan national : 10 chiffres commençant obligatoirement par "01" (ex: 01 40 50 60 70)
 * - Avec indicatif : +229 01 XX XX XX XX ou 00229 01 XX XX XX XX
 */
export const validateBeninPhone = (phone: string, isRequired: boolean = true): BeninPhoneValidationResult => {
  if (!phone || phone.trim() === '') {
    if (isRequired) {
      return {
        isValid: false,
        normalized: '',
        error: "Le numéro de téléphone est obligatoire (format béninois : 10 chiffres commençant par 01)."
      };
    }
    return { isValid: true, normalized: '' };
  }

  const trimmed = phone.trim();
  // Supprime tous les espaces, tirets, points, parenthèses
  const cleaned = trimmed.replace(/[\s.\-()]/g, '');

  // 1. Format national : 10 chiffres commençant par 01
  if (/^01\d{8}$/.test(cleaned)) {
    return {
      isValid: true,
      normalized: cleaned
    };
  }

  // 2. Format international avec +229 : +229 suivi de 01 et 8 chiffres (13 caractères au total)
  if (/^\+22901\d{8}$/.test(cleaned)) {
    return {
      isValid: true,
      normalized: cleaned
    };
  }

  // 3. Format international avec 00229 (14 chiffres)
  if (/^0022901\d{8}$/.test(cleaned)) {
    return {
      isValid: true,
      normalized: `+229${cleaned.slice(5)}`
    };
  }

  // 4. Format avec 229 direct (12 chiffres : 229 + 01 + 8 chiffres)
  if (/^22901\d{8}$/.test(cleaned)) {
    return {
      isValid: true,
      normalized: `+${cleaned}`
    };
  }

  // Diagnostics précis pour guider l'utilisateur
  if (cleaned.startsWith('+229') || cleaned.startsWith('00229') || cleaned.startsWith('229')) {
    const withoutPrefix = cleaned.replace(/^(\+229|00229|229)/, '');
    if (!withoutPrefix.startsWith('01')) {
      return {
        isValid: false,
        normalized: cleaned,
        error: "Le numéro béninois avec indicatif doit comporter le préfixe 01 (ex : +229 01 XX XX XX XX)."
      };
    }
    if (withoutPrefix.length !== 10) {
      return {
        isValid: false,
        normalized: cleaned,
        error: `Numéro incomplet ou trop long (${withoutPrefix.length} chiffres après indicatif au lieu de 10 requis commençant par 01).`
      };
    }
  }

  if (cleaned.length < 10) {
    if (!cleaned.startsWith('01')) {
      return {
        isValid: false,
        normalized: cleaned,
        error: "Format béninois requis : 10 chiffres commençant par 01 (ex : 01 40 50 60 70)."
      };
    }
    return {
      isValid: false,
      normalized: cleaned,
      error: `Numéro incomplet : ${cleaned.length}/10 chiffres saisis. 10 chiffres sont requis (ex : 01 XX XX XX XX).`
    };
  }

  if (!cleaned.startsWith('01')) {
    return {
      isValid: false,
      normalized: cleaned,
      error: "Format béninois requis : le numéro doit impérativement commencer par 01 (ex : 01 40 50 60 70)."
    };
  }

  return {
    isValid: false,
    normalized: cleaned,
    error: "Numéro invalide. Format requis : 10 chiffres commençant par 01 (ex : 01 40 50 60 70 ou +229 01 40 50 60 70)."
  };
};

/**
 * Formate un numéro de téléphone béninois pour l'affichage (ex: 01 40 50 60 70 ou +229 01 40 50 60 70)
 */
export const formatBeninPhoneDisplay = (phone: string): string => {
  const cleaned = phone.replace(/[\s.\-()]/g, '');
  if (/^01\d{8}$/.test(cleaned)) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  }
  if (/^\+22901\d{8}$/.test(cleaned)) {
    return `+229 ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)} ${cleaned.slice(12, 14)}`;
  }
  return phone;
};

// --- SYSTÈME DE RATE LIMIT (ANTI-SPAM CONTACT) ---
// Règle : maximum 5 messages en moins de 5 minutes.
// En cas de dépassement : blocage temporaire pendant 15 minutes.
const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 5 * 60 * 1000,      // 5 minutes
  MAX_SUBMISSIONS: 5,            // 5 messages max
  LOCKOUT_MS: 15 * 60 * 1000,     // Blocage de 15 minutes
  MIN_INTERVAL_MS: 5000,         // Intervalle minimum entre 2 envois immédiats (5s)
  STORAGE_KEY_SUBMISSIONS: 'csz_contact_submissions_v2',
  STORAGE_KEY_LOCKOUT: 'csz_contact_lockout_until_v2',
  STORAGE_KEY_LAST_TIME: 'csz_contact_last_submission_v2'
};

export interface RateLimitCheckResult {
  isAllowed: boolean;
  remainingSeconds: number;
  remainingMinutes: number;
  currentCount: number;
  maxAllowed: number;
  message?: string;
}

export const checkContactRateLimit = (): RateLimitCheckResult => {
  if (typeof window === 'undefined') {
    return { isAllowed: true, remainingSeconds: 0, remainingMinutes: 0, currentCount: 0, maxAllowed: RATE_LIMIT_CONFIG.MAX_SUBMISSIONS };
  }

  const now = Date.now();

  // 1. Vérifier si un verrouillage de 15 minutes est en cours
  const lockoutUntilStr = localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY_LOCKOUT);
  if (lockoutUntilStr) {
    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    if (now < lockoutUntil) {
      const remainingMs = lockoutUntil - now;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      return {
        isAllowed: false,
        remainingSeconds,
        remainingMinutes,
        currentCount: RATE_LIMIT_CONFIG.MAX_SUBMISSIONS,
        maxAllowed: RATE_LIMIT_CONFIG.MAX_SUBMISSIONS,
        message: `Limite atteinte (plus de 5 messages envoyés). Par mesure de sécurité anti-spam, veuillez patienter encore ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} (${remainingSeconds}s) avant de renvoyer un message.`
      };
    } else {
      // Le lockout est expiré, on nettoie
      localStorage.removeItem(RATE_LIMIT_CONFIG.STORAGE_KEY_LOCKOUT);
      localStorage.removeItem(RATE_LIMIT_CONFIG.STORAGE_KEY_SUBMISSIONS);
    }
  }

  // 2. Vérifier l'intervalle ultra-rapide anti-double clic (5s)
  const lastTimeStr = sessionStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY_LAST_TIME);
  if (lastTimeStr) {
    const lastTime = parseInt(lastTimeStr, 10);
    if (now - lastTime < RATE_LIMIT_CONFIG.MIN_INTERVAL_MS) {
      const waitSec = Math.ceil((RATE_LIMIT_CONFIG.MIN_INTERVAL_MS - (now - lastTime)) / 1000);
      return {
        isAllowed: false,
        remainingSeconds: waitSec,
        remainingMinutes: 1,
        currentCount: 1,
        maxAllowed: RATE_LIMIT_CONFIG.MAX_SUBMISSIONS,
        message: `Veuillez patienter ${waitSec} seconde${waitSec > 1 ? 's' : ''} avant d'envoyer un nouveau message.`
      };
    }
  }

  // 3. Vérifier les soumissions dans la fenêtre glissante des 5 dernières minutes
  const storedSubmissionsStr = localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY_SUBMISSIONS);
  let timestamps: number[] = [];
  if (storedSubmissionsStr) {
    try {
      timestamps = JSON.parse(storedSubmissionsStr);
    } catch {
      timestamps = [];
    }
  }

  // Filtrer pour ne garder que les soumissions des 5 dernières minutes
  const recentSubmissions = timestamps.filter(t => now - t < RATE_LIMIT_CONFIG.WINDOW_MS);

  if (recentSubmissions.length >= RATE_LIMIT_CONFIG.MAX_SUBMISSIONS) {
    // Activer le lockout de 15 minutes
    const lockoutUntil = now + RATE_LIMIT_CONFIG.LOCKOUT_MS;
    localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY_LOCKOUT, lockoutUntil.toString());
    const remainingMinutes = 15;
    return {
      isAllowed: false,
      remainingSeconds: 900,
      remainingMinutes,
      currentCount: recentSubmissions.length,
      maxAllowed: RATE_LIMIT_CONFIG.MAX_SUBMISSIONS,
      message: "Vous avez atteint la limite maximale de 5 messages en moins de 5 minutes. Par mesure de sécurité anti-spam, veuillez patienter 15 minutes avant de pouvoir envoyer un nouveau message."
    };
  }

  return {
    isAllowed: true,
    remainingSeconds: 0,
    remainingMinutes: 0,
    currentCount: recentSubmissions.length,
    maxAllowed: RATE_LIMIT_CONFIG.MAX_SUBMISSIONS
  };
};

export const recordContactSubmission = (): void => {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  sessionStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY_LAST_TIME, now.toString());

  const storedSubmissionsStr = localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY_SUBMISSIONS);
  let timestamps: number[] = [];
  if (storedSubmissionsStr) {
    try {
      timestamps = JSON.parse(storedSubmissionsStr);
    } catch {
      timestamps = [];
    }
  }

  // Nettoyer les soumissions de plus de 5 minutes et ajouter la nouvelle
  const recentSubmissions = timestamps.filter(t => now - t < RATE_LIMIT_CONFIG.WINDOW_MS);
  recentSubmissions.push(now);

  localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY_SUBMISSIONS, JSON.stringify(recentSubmissions));

  // Si on atteint 5 soumissions, on enclenche immédiatement le lockout de 15 minutes pour le prochain envoi
  if (recentSubmissions.length >= RATE_LIMIT_CONFIG.MAX_SUBMISSIONS) {
    const lockoutUntil = now + RATE_LIMIT_CONFIG.LOCKOUT_MS;
    localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY_LOCKOUT, lockoutUntil.toString());
  }
};

// --- SYSTÈME DE RATE LIMIT (RENDEZ-VOUS) ---
// Règle : maximum 5 demandes de rendez-vous en moins de 5 minutes.
// En cas de dépassement : blocage temporaire pendant 15 minutes.
const APPOINTMENT_RATE_LIMIT_CONFIG = {
  WINDOW_MS: 5 * 60 * 1000,          // 5 minutes
  MAX_SUBMISSIONS: 5,                // 5 rendez-vous max
  LOCKOUT_MS: 15 * 60 * 1000,         // Blocage de 15 minutes
  MIN_INTERVAL_MS: 5000,             // Intervalle minimum entre 2 envois immédiats (5s)
  STORAGE_KEY_SUBMISSIONS: 'csz_appointment_submissions_v1',
  STORAGE_KEY_LOCKOUT: 'csz_appointment_lockout_until_v1',
  STORAGE_KEY_LAST_TIME: 'csz_appointment_last_submission_v1'
};

export const checkAppointmentRateLimit = (): RateLimitCheckResult => {
  if (typeof window === 'undefined') {
    return { isAllowed: true, remainingSeconds: 0, remainingMinutes: 0, currentCount: 0, maxAllowed: APPOINTMENT_RATE_LIMIT_CONFIG.MAX_SUBMISSIONS };
  }

  const now = Date.now();

  // 1. Vérifier si un verrouillage de 15 minutes est en cours
  const lockoutUntilStr = localStorage.getItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_LOCKOUT);
  if (lockoutUntilStr) {
    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    if (now < lockoutUntil) {
      const remainingMs = lockoutUntil - now;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      return {
        isAllowed: false,
        remainingSeconds,
        remainingMinutes,
        currentCount: APPOINTMENT_RATE_LIMIT_CONFIG.MAX_SUBMISSIONS,
        maxAllowed: APPOINTMENT_RATE_LIMIT_CONFIG.MAX_SUBMISSIONS,
        message: `Limite atteinte (plus de 5 demandes de rendez-vous envoyées). Par mesure de sécurité anti-spam, veuillez patienter encore ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} (${remainingSeconds}s) avant de soumettre une nouvelle demande.`
      };
    } else {
      localStorage.removeItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_LOCKOUT);
      localStorage.removeItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_SUBMISSIONS);
    }
  }

  // 2. Intervalle minimal anti-double clic (5s)
  const lastTimeStr = sessionStorage.getItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_LAST_TIME);
  if (lastTimeStr) {
    const lastTime = parseInt(lastTimeStr, 10);
    if (now - lastTime < APPOINTMENT_RATE_LIMIT_CONFIG.MIN_INTERVAL_MS) {
      const waitSec = Math.ceil((APPOINTMENT_RATE_LIMIT_CONFIG.MIN_INTERVAL_MS - (now - lastTime)) / 1000);
      return {
        isAllowed: false,
        remainingSeconds: waitSec,
        remainingMinutes: 1,
        currentCount: 1,
        maxAllowed: APPOINTMENT_RATE_LIMIT_CONFIG.MAX_SUBMISSIONS,
        message: `Veuillez patienter ${waitSec} seconde${waitSec > 1 ? 's' : ''} avant de soumettre une nouvelle demande.`
      };
    }
  }

  // 3. Fenêtre glissante des 5 dernières minutes
  const storedSubmissionsStr = localStorage.getItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_SUBMISSIONS);
  let timestamps: number[] = [];
  if (storedSubmissionsStr) {
    try {
      timestamps = JSON.parse(storedSubmissionsStr);
    } catch {
      timestamps = [];
    }
  }

  const recentSubmissions = timestamps.filter(t => now - t < APPOINTMENT_RATE_LIMIT_CONFIG.WINDOW_MS);

  if (recentSubmissions.length >= APPOINTMENT_RATE_LIMIT_CONFIG.MAX_SUBMISSIONS) {
    const lockoutUntil = now + APPOINTMENT_RATE_LIMIT_CONFIG.LOCKOUT_MS;
    localStorage.setItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_LOCKOUT, lockoutUntil.toString());
    return {
      isAllowed: false,
      remainingSeconds: 900,
      remainingMinutes: 15,
      currentCount: recentSubmissions.length,
      maxAllowed: APPOINTMENT_RATE_LIMIT_CONFIG.MAX_SUBMISSIONS,
      message: "Vous avez atteint la limite maximale de 5 demandes de rendez-vous en moins de 5 minutes. Par mesure de sécurité anti-spam, veuillez patienter 15 minutes avant de soumettre une nouvelle demande."
    };
  }

  return {
    isAllowed: true,
    remainingSeconds: 0,
    remainingMinutes: 0,
    currentCount: recentSubmissions.length,
    maxAllowed: APPOINTMENT_RATE_LIMIT_CONFIG.MAX_SUBMISSIONS
  };
};

export const recordAppointmentSubmission = (): void => {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  sessionStorage.setItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_LAST_TIME, now.toString());

  const storedSubmissionsStr = localStorage.getItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_SUBMISSIONS);
  let timestamps: number[] = [];
  if (storedSubmissionsStr) {
    try {
      timestamps = JSON.parse(storedSubmissionsStr);
    } catch {
      timestamps = [];
    }
  }

  const recentSubmissions = timestamps.filter(t => now - t < APPOINTMENT_RATE_LIMIT_CONFIG.WINDOW_MS);
  recentSubmissions.push(now);

  localStorage.setItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_SUBMISSIONS, JSON.stringify(recentSubmissions));

  if (recentSubmissions.length >= APPOINTMENT_RATE_LIMIT_CONFIG.MAX_SUBMISSIONS) {
    const lockoutUntil = now + APPOINTMENT_RATE_LIMIT_CONFIG.LOCKOUT_MS;
    localStorage.setItem(APPOINTMENT_RATE_LIMIT_CONFIG.STORAGE_KEY_LOCKOUT, lockoutUntil.toString());
  }
};

// --- SÉCURITÉ IDENTITÉ & NUMÉRO DE TÉLÉPHONE (ANTI-USURPATION) ---
// Règle : Un numéro de téléphone déjà utilisé pour un message ne peut pas être
// réutilisé sous un nom ou une identité différente par une autre personne.

const PHONE_IDENTITY_STORAGE_KEY = 'csz_phone_identity_registry_v1';

/**
 * Normalise un numéro béninois en une clé unique à 10 chiffres (ex: 0140506070).
 * Gère les formats nationaux et internationaux (+229 01..., 00229 01...).
 */
export const normalizeBeninPhoneKey = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s.\-()]/g, '');
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length >= 10) {
    return digitsOnly.slice(-10); // Extrait les 10 derniers chiffres (01XXXXXXXX)
  }
  return cleaned;
};

/**
 * Normalise un nom (minuscules, sans accents, sans ponctuations parasites)
 */
export const normalizePersonName = (name: string): string => {
  if (!name) return '';
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques/accents
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * Vérifie si deux noms d'expéditeurs sont compatibles (même personne ou variantes acceptables).
 * Exemple accepté : "Franck URIEL" === "URIEL Franck"
 * Exemple rejeté : "Franck URIEL" vs "Jean DUPONT"
 */
export const areNamesCompatible = (name1: string, name2: string): boolean => {
  const n1 = normalizePersonName(name1);
  const n2 = normalizePersonName(name2);
  if (!n1 || !n2) return false;
  if (n1 === n2) return true;

  const words1 = n1.split(' ').filter(w => w.length > 1);
  const words2 = n2.split(' ').filter(w => w.length > 1);

  // Inversion prénom / nom (ex : Franck Uriel vs Uriel Franck)
  if (words1.length === words2.length && words1.every(w => words2.includes(w))) {
    return true;
  }

  // Si au moins deux mots clés significatifs concordent (ex: Franck Uriel Dossou et Franck Uriel)
  if (words1.length >= 2 && words2.length >= 2) {
    const commonWords = words1.filter(w => words2.includes(w));
    if (commonWords.length >= 2) {
      return true;
    }
  }

  return false;
};

export interface PhoneIdentityVerificationResult {
  isAllowed: boolean;
  registeredName?: string;
  error?: string;
}

export const getPhoneIdentityRegistry = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PHONE_IDENTITY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Vérifie si le numéro est déjà enregistré avec un nom différent.
 */
export const verifyPhoneIdentity = (phone: string, inputName: string): PhoneIdentityVerificationResult => {
  if (!phone || !inputName) {
    return { isAllowed: true };
  }

  const phoneKey = normalizeBeninPhoneKey(phone);
  if (!phoneKey || phoneKey.length < 8) {
    return { isAllowed: true };
  }

  const registry = getPhoneIdentityRegistry();
  const registeredName = registry[phoneKey];

  if (!registeredName) {
    return { isAllowed: true };
  }

  if (areNamesCompatible(registeredName, inputName)) {
    return { isAllowed: true, registeredName };
  }

  return {
    isAllowed: false,
    registeredName,
    error: `Ce numéro de téléphone est déjà associé au nom « ${registeredName} ». Pour garantir l'authenticité et la sécurité des correspondances, vous ne pouvez pas utiliser ce numéro sous une autre identité.`
  };
};

/**
 * Enregistre l'identité associée à un numéro de téléphone vérifié.
 */
export const recordPhoneIdentity = (phone: string, name: string): void => {
  if (typeof window === 'undefined') return;
  const phoneKey = normalizeBeninPhoneKey(phone);
  if (!phoneKey || !name.trim()) return;

  try {
    const registry = getPhoneIdentityRegistry();
    const existing = registry[phoneKey];
    if (!existing || (!areNamesCompatible(existing, name) && name.trim().length > existing.length)) {
      registry[phoneKey] = name.trim();
    } else if (!existing) {
      registry[phoneKey] = name.trim();
    }
    localStorage.setItem(PHONE_IDENTITY_STORAGE_KEY, JSON.stringify(registry));
  } catch (e) {
    console.warn("Impossible d'enregistrer l'identité du numéro de téléphone:", e);
  }
};

