import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, Loader2, Info, AlertTriangle, Search, Hash, Copy, X, KeyRound, MessageSquare, Stethoscope, PhoneCall, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CONTACT_INFO } from '../constants';
import Reveal from './Reveal';

const Appointment: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recoveryCopied, setRecoveryCopied] = useState(false);
  
  // Tracking State
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<{found: boolean, status?: string, rdv_date?: string, rdv_time?: string} | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Recovery State
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryForm, setRecoveryForm] = useState({ name: '', phone: '' });
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
    website_hp: '' // Champ piège anti-robot (Honeypot)
  });

  // --- VALIDATORS ---
  const validateName = (val: string) => val.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
  const validatePhone = (val: string) => val.replace(/[^0-9+\s]/g, '');
  const validateCode = (val: string) => val.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();

  // Génération sécurisée et à haute entropie du code de suivi (RDV-XXXX-XXXX, ~1.1 x 10^12 combinaisons)
  const generateTrackingCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const array = new Uint8Array(8);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < 8; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    let part1 = '';
    let part2 = '';
    for (let i = 0; i < 4; i++) {
      part1 += chars.charAt(array[i] % chars.length);
    }
    for (let i = 4; i < 8; i++) {
      part2 += chars.charAt(array[i] % chars.length);
    }
    return `RDV-${part1}-${part2}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // 1. Détection Anti-Robot (Honeypot)
    if (formData.website_hp && formData.website_hp.trim() !== '') {
      // Rejet immédiat et silencieux sans interaction avec la base de données
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 500);
      return;
    }

    // 2. Limitation de fréquence (Anti-flood / Rate-limiting client)
    const lastSubmission = sessionStorage.getItem('csz_last_appointment_time');
    const now = Date.now();
    if (lastSubmission && now - parseInt(lastSubmission, 10) < 30000) {
      const waitSeconds = Math.ceil((30000 - (now - parseInt(lastSubmission, 10))) / 1000);
      setErrorMsg(`Veuillez patienter ${waitSeconds} secondes avant de soumettre une nouvelle demande de rendez-vous.`);
      setIsLoading(false);
      return;
    }
    
    // 3. Validation finale avant envoi
    if (formData.phone.replace(/\s/g, '').length < 8) {
      setErrorMsg("Le numéro de téléphone semble incomplet (minimum 8 chiffres requis).");
      setIsLoading(false);
      return;
    }

    const code = generateTrackingCode();

    try {
      // Sauvegarde stricte en base de données
      await api.appointments.create({ 
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        service: "Consultation Médecin",
        tracking_code: code 
      });

      // Enregistrer le timestamp de soumission réussie
      sessionStorage.setItem('csz_last_appointment_time', Date.now().toString());

      setGeneratedCode(code);
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', date: '', time: '', reason: '', website_hp: '' });
    } catch (error: any) {
      console.error("Erreur réservation rendez-vous:", error);
      setErrorMsg(
        `Impossible d'enregistrer la demande pour le moment. Veuillez réessayer ou contacter directement le secrétariat médical au ${CONTACT_INFO.phone}.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    
    setTrackingLoading(true);
    setTrackingResult(null);
    setTrackingError(null);

    try {
      const result = await api.appointments.checkStatus(trackingCode.trim());
      setTrackingResult(result);
    } catch (e) {
      console.error("Erreur recherche statut:", e);
      setTrackingError("Impossible de vérifier le statut. Veuillez vérifier votre connexion et réessayer.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setRecoveryError(null);
    setRecoveryResult(null);

    try {
      const result = await api.appointments.recoverCode(recoveryForm.name, recoveryForm.phone);
      if (result.found && result.tracking_code) {
        setRecoveryResult(result.tracking_code);
      } else {
        setRecoveryError("Aucun rendez-vous trouvé avec ce nom et ce numéro de téléphone.");
      }
    } catch (e) {
      console.error("Erreur récupération code:", e);
      setRecoveryError("Erreur de communication avec le serveur. Veuillez réessayer ultérieurement.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'phone') {
      value = validatePhone(value);
    } else if (name === 'name') {
      value = validateName(value);
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const copyRecoveredCode = () => {
    if (recoveryResult) {
      navigator.clipboard.writeText(recoveryResult);
      setRecoveryCopied(true);
      setTimeout(() => setRecoveryCopied(false), 2500);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Recovery Modal */}
      {showRecovery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 relative border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setShowRecovery(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Fermer"
            >
              <X size={24}/>
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-teal-100 dark:bg-teal-900/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600 dark:text-teal-400">
                <KeyRound size={24}/>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Code perdu ?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Retrouvez votre code de suivi en saisissant les informations exactes de votre rendez-vous.
              </p>
            </div>

            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div>
                <label htmlFor="recovery-name" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Nom & Prénoms</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16}/>
                  <input 
                    id="recovery-name"
                    type="text" 
                    required 
                    value={recoveryForm.name} 
                    onChange={e => setRecoveryForm({...recoveryForm, name: validateName(e.target.value)})}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Nom utilisé lors de la réservation"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="recovery-phone" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Numéro de Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16}/>
                  <input 
                    id="recovery-phone"
                    type="tel" 
                    required 
                    inputMode="numeric"
                    value={recoveryForm.phone} 
                    onChange={e => setRecoveryForm({...recoveryForm, phone: validatePhone(e.target.value)})}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="ex: 97 00 00 00"
                  />
                </div>
              </div>
              
              {recoveryError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0"/> <span>{recoveryError}</span>
                </div>
              )}

              {recoveryResult && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center animate-in fade-in">
                  <p className="text-green-800 dark:text-green-300 text-sm font-medium mb-2">Code retrouvé avec succès !</p>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                      {recoveryResult}
                    </div>
                    <button 
                      type="button" 
                      onClick={copyRecoveredCode} 
                      className="p-2 bg-white dark:bg-gray-700 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-gray-600 flex items-center gap-1 text-xs"
                      title="Copier le code"
                    >
                      {recoveryCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16}/>}
                      {recoveryCopied && <span className="font-bold">Copié</span>}
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setTrackingCode(recoveryResult);
                      setShowRecovery(false);
                    }}
                    className="mt-3 text-xs text-green-700 dark:text-green-400 underline font-bold"
                  >
                    Vérifier le statut avec ce code
                  </button>
                </div>
              )}

              {!recoveryResult && (
                <button 
                  type="submit" 
                  disabled={recoveryLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {recoveryLoading ? <Loader2 className="animate-spin mx-auto" size={20}/> : "Rechercher mon code"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-slate-900 dark:bg-black text-white pt-28 pb-14 lg:pt-36 lg:pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Projet conceptuel de démonstration
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
            Demande de Rendez-vous Médical
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Planifiez une consultation auprès de l'équipe soignante. Les informations soumises permettent de tester le parcours patient et la vérification par code de suivi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info Card & Tracking */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-gray-700 shadow-xs">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Info size={20} className="text-teal-600 dark:text-teal-400"/> Consignes de Consultation
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed">
                  Ce module s'adresse aux consultations programmées. En cas d'urgence obstétricale ou vitale, présentez-vous sans délai à l'accueil du centre, ouvert 24h/24.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700/50 p-3 rounded-xl border border-slate-100 dark:border-gray-600/60">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-300">
                      <Clock size={18}/>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 font-semibold uppercase">Créneaux de consultation</p>
                      <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">08h00 – 18h00 (Lundi au Vendredi)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700/50 p-3 rounded-xl border border-slate-100 dark:border-gray-600/60">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                      <PhoneCall size={18}/>
                    </div>
                    <div>
                      <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold uppercase">Ligne directe permanence</p>
                      <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white hover:text-teal-600 transition-colors block">
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Section */}
            <Reveal width="100%" delay={0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                    <Search size={20} className="text-teal-600 dark:text-teal-400"/> Suivre mon rendez-vous
                  </h4>
                  <button 
                    onClick={() => setShowRecovery(true)}
                    className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <KeyRound size={12}/> Code perdu ?
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Saisissez votre code unique (ex: RDV-A1B2) pour connaître le statut de confirmation.
                </p>
                
                <form onSubmit={handleTrackingSearch} className="space-y-3">
                  <div className="relative">
                    <Hash className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18}/>
                    <input 
                      id="tracking-code"
                      type="text" 
                      placeholder="Code (ex: RDV-X9Z2)"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(validateCode(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none uppercase font-mono font-bold tracking-widest text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={trackingLoading || !trackingCode}
                    className="w-full bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
                  >
                    {trackingLoading ? <Loader2 className="animate-spin mx-auto" size={18}/> : "Vérifier le statut"}
                  </button>
                </form>

                {trackingError && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5"/> {trackingError}
                  </div>
                )}

                {trackingResult && (
                  <div className="mt-5 animate-in fade-in slide-in-from-top-2">
                    {trackingResult.found ? (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Statut</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            trackingResult.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                            trackingResult.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 
                            'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                          }`}>
                            {trackingResult.status === 'confirmed' ? 'Confirmé' : trackingResult.status === 'cancelled' ? 'Non confirmé' : 'En attente'}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <p className="flex justify-between text-gray-700 dark:text-gray-200"><span>Date :</span> <span className="font-semibold">{trackingResult.rdv_date ? new Date(trackingResult.rdv_date).toLocaleDateString('fr-FR') : 'N/A'}</span></p>
                          <p className="flex justify-between text-gray-700 dark:text-gray-200"><span>Heure :</span> <span className="font-semibold">{trackingResult.rdv_time || 'N/A'}</span></p>
                        </div>
                        {trackingResult.status === 'confirmed' && (
                          <div className="mt-3 pt-2.5 border-t border-gray-200 dark:border-gray-600 text-xs text-green-700 dark:text-green-300 text-center font-medium">
                            Votre rendez-vous a été validé par le secrétariat médical.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-center text-xs">
                        <p className="font-bold mb-1">Aucun rendez-vous trouvé.</p>
                        <p className="opacity-80">Vérifiez la saisie de votre code ou contactez le centre si besoin.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Appointment Form */}
          <div className="lg:col-span-8">
            <Reveal width="100%" delay={0.1}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs p-6 md:p-10 border border-slate-200/80 dark:border-gray-700">
                
                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start gap-3 animate-in fade-in">
                    <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold mb-1">Erreur de transmission</p>
                      <p>{errorMsg}</p>
                    </div>
                  </div>
                )}

                {isSubmitted ? (
                  <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Demande enregistrée avec succès !</h4>
                    <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-8 text-sm md:text-base leading-relaxed">
                      Votre demande de rendez-vous a bien été transmise à notre secrétariat médical. Notre équipe examinera la disponibilité et prendra contact avec vous par téléphone pour confirmer le créneau définitif.
                    </p>

                    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 max-w-md mx-auto mb-8">
                      <p className="text-teal-800 dark:text-teal-300 font-medium mb-3 text-sm">Votre code unique de suivi :</p>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="text-2xl sm:text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-wider bg-white dark:bg-gray-700 px-4 py-2 rounded-lg border border-teal-200 dark:border-gray-600 select-all">
                          {generatedCode}
                        </div>
                        <button 
                          onClick={copyToClipboard} 
                          className="p-3 bg-white dark:bg-gray-700 border border-teal-200 dark:border-gray-600 rounded-lg hover:bg-teal-100 dark:hover:bg-gray-600 text-teal-700 dark:text-teal-300 transition-colors flex items-center gap-1.5" 
                          title="Copier le code"
                        >
                          {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20}/>}
                          {copied && <span className="text-xs font-bold text-green-700 dark:text-green-400">Copié</span>}
                        </button>
                      </div>
                      <p className="text-xs text-teal-600 dark:text-teal-400 mt-3">Conservez précieusement ce code pour vérifier l'état de validation de votre demande.</p>
                    </div>

                    <button 
                      onClick={() => { setIsSubmitted(false); setGeneratedCode(null); }}
                      className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md text-sm"
                    >
                      Prendre un autre rendez-vous
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 p-3 bg-teal-50/70 dark:bg-teal-950/40 rounded-xl border border-teal-200/60 dark:border-teal-900/60 text-xs text-teal-800 dark:text-teal-200 flex items-center gap-2">
                      <span className="font-bold">Espace de démonstration :</span>
                      Les demandes saisies ci-dessous sont enregistrées dans la base de test pour expérimenter le suivi en direct.
                    </div>

                    <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Stethoscope className="text-teal-600 dark:text-teal-400" size={28}/>
                        Consultation Médicale
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        Renseignez vos disponibilités et coordonnées pour que le secrétariat prépare votre dossier.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Champ Honeypot Anti-Robot invisible */}
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="website_hp"
                          id="website_hp"
                          value={formData.website_hp}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label htmlFor="name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Nom & Prénoms *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                            </div>
                            <input
                              id="name"
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                              placeholder="ex: Jean Dupont"
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label htmlFor="phone" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Téléphone *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                            </div>
                            <input
                              id="phone"
                              type="tel"
                              name="phone"
                              required
                              inputMode="numeric"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                              placeholder="ex: +229 97 00 00 00"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label htmlFor="date" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Date Souhaitée *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                            </div>
                            <input
                              id="date"
                              type="date"
                              name="date"
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.date}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm [color-scheme:light] dark:[color-scheme:dark]"
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label htmlFor="time" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Heure Souhaitée *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                            </div>
                            <input
                              id="time"
                              type="time"
                              name="time"
                              required
                              min="08:00"
                              max="18:00"
                              value={formData.time}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm [color-scheme:light] dark:[color-scheme:dark]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <div className="flex justify-between items-center mb-2">
                          <label htmlFor="reason" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Motif de consultation <span className="font-normal text-gray-400 lowercase">(optionnel)</span>
                          </label>
                        </div>
                        <div className="relative">
                          <div className="absolute top-3.5 left-4 pointer-events-none">
                            <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                          </div>
                          <textarea
                            id="reason"
                            name="reason"
                            rows={3}
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                            placeholder="Orientation générale (ex: consultation générale, renouvellement, certificat...)"
                          ></textarea>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-normal">
                          Protégé par le secret médical. Vous êtes libre de réserver les précisions cliniques à votre entretien individuel avec le soignant.
                        </p>
                      </div>

                      {/* Consentement Données Personnelles */}
                      <div className="p-4 bg-teal-50/70 dark:bg-gray-700/40 rounded-xl border border-teal-100 dark:border-gray-600 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="privacy_consent"
                          required
                          className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="privacy_consent" className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
                          J'accepte que mes coordonnées soient traitées par le secrétariat médical du Centre de Santé de Zogbo afin de gérer et confirmer cette demande de rendez-vous (conformément à la <Link to="/confidentialite" className="text-teal-700 dark:text-teal-400 font-bold underline" target="_blank" rel="noopener noreferrer">Politique de Confidentialité</Link>).
                        </label>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center disabled:opacity-70 text-base group"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            <span>Enregistrement sur le serveur...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                            <span>Soumettre la demande de rendez-vous</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
