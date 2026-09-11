import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, Loader2, Info, AlertTriangle, Search, Hash, Copy, X, KeyRound, MessageSquare, Stethoscope, PhoneCall } from 'lucide-react';
import { api } from '../services/api';
import Reveal from './Reveal';

const Appointment: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
    reason: ''
  });

  // --- VALIDATORS ---
  const validateName = (val: string) => val.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
  const validatePhone = (val: string) => val.replace(/[^0-9+\s]/g, '');
  const validateCode = (val: string) => val.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();

  const generateTrackingCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'RDV-';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    
    // Validation finale avant envoi
    if (formData.phone.replace(/\s/g, '').length < 8) {
      setErrorMsg("Le numéro de téléphone semble incomplet (minimum 8 chiffres requis).");
      setIsLoading(false);
      return;
    }

    const code = generateTrackingCode();

    try {
      // Sauvegarde stricte en base de données
      await api.appointments.create({ 
        ...formData, 
        service: "Consultation Médecin",
        tracking_code: code 
      });
      setGeneratedCode(code);
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', date: '', time: '', reason: '' });
    } catch (error: any) {
      console.error("Erreur réservation rendez-vous:", error);
      setErrorMsg(
        "Impossible d'enregistrer le rendez-vous sur le serveur pour le moment. Veuillez réessayer ou contacter directement le centre par téléphone au +229 01 97 26 85 85 / +229 01 21 30 18 18."
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
      alert("Code de suivi copié dans le presse-papiers !");
    }
  };

  const copyRecoveredCode = () => {
    if (recoveryResult) {
      navigator.clipboard.writeText(recoveryResult);
      alert("Code de suivi copié !");
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
                      className="p-2 bg-white dark:bg-gray-700 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-gray-600"
                      title="Copier le code"
                    >
                      <Copy size={16}/>
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
      <div className="bg-teal-800 dark:bg-teal-950 text-white pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="down">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Prise de Rendez-vous</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-teal-100 text-xl max-w-2xl mx-auto">
              Réservez votre consultation en ligne avec l'équipe médicale du Centre de Santé de Zogbo.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info Card & Tracking */}
          <div className="lg:col-span-4 space-y-6">
            <Reveal width="100%">
              <div className="bg-teal-900 dark:bg-gray-800 text-white rounded-2xl shadow-xl p-8 border border-teal-800 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Info size={24} className="text-teal-400"/> Informations Pratiques
                </h3>
                <p className="text-teal-100 text-sm mb-6 leading-relaxed">
                  Ce formulaire est dédié aux consultations programmées avec le médecin chef. Pour les urgences vitales ou soins immédiats, présentez-vous directement au centre 24h/24.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-teal-800/50 dark:bg-gray-700/50 p-3 rounded-xl border border-teal-700/40">
                    <div className="bg-teal-500 p-2 rounded-lg"><Clock size={20}/></div>
                    <div>
                      <p className="text-xs text-teal-300 uppercase font-bold">Consultations</p>
                      <p className="font-semibold text-sm">08h00 - 18h00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-teal-800/50 dark:bg-gray-700/50 p-3 rounded-xl border border-teal-700/40">
                    <div className="bg-red-500 p-2 rounded-lg"><PhoneCall size={20}/></div>
                    <div>
                      <p className="text-xs text-red-300 uppercase font-bold">Urgences 24/7</p>
                      <p className="font-semibold text-sm">+229 01 97 26 85 85</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10 border-t-4 border-teal-500 dark:border-teal-400">
                
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
                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Demande transmise avec succès !</h4>
                    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8 text-sm md:text-base">
                      Votre demande de consultation a été enregistrée dans la base de données du centre médical.
                    </p>

                    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 max-w-md mx-auto mb-8">
                      <p className="text-teal-800 dark:text-teal-300 font-medium mb-3 text-sm">Votre code unique de suivi :</p>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-wider bg-white dark:bg-gray-700 px-4 py-2 rounded-lg border border-teal-200 dark:border-gray-600 select-all">
                          {generatedCode}
                        </div>
                        <button 
                          onClick={copyToClipboard} 
                          className="p-3 bg-white dark:bg-gray-700 border border-teal-200 dark:border-gray-600 rounded-lg hover:bg-teal-100 dark:hover:bg-gray-600 text-teal-700 dark:text-teal-300 transition-colors" 
                          title="Copier le code"
                        >
                          <Copy size={20}/>
                        </button>
                      </div>
                      <p className="text-xs text-teal-600 dark:text-teal-400 mt-3">Conservez ce code pour vérifier l'état de validation de votre consultation.</p>
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
                    <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Stethoscope className="text-teal-600 dark:text-teal-400" size={28}/>
                        Consultation Médecin
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        Remplissez le formulaire ci-dessous pour planifier votre rendez-vous.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                        <label htmlFor="reason" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Motif de consultation (Optionnel)</label>
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
                            placeholder="Symptômes ou motif de votre consultation..."
                          ></textarea>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center disabled:opacity-70 text-base"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            <span>Enregistrement sur le serveur...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2" size={20} />
                            <span>Confirmer le rendez-vous</span>
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
