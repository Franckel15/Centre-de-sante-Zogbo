
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, AlertCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SITE_IMAGES } from '../constants';
import { api } from '../services/api';
import BackToTop from './BackToTop';
import Reveal from './Reveal';
import EditableImage from './EditableImage';

const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    company_hp: '' // Champ piège anti-robot (Honeypot)
  });

  // --- VALIDATORS ---
  const validateName = (val: string) => val.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
  const validatePhone = (val: string) => val.replace(/[^0-9+\s]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // 1. Détection Anti-Robot (Honeypot)
    if (formData.company_hp && formData.company_hp.trim() !== '') {
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 500);
      return;
    }

    // 2. Limitation de fréquence (Anti-flood / Rate-limiting client)
    const lastSubmission = sessionStorage.getItem('csz_last_contact_time');
    const now = Date.now();
    if (lastSubmission && now - parseInt(lastSubmission, 10) < 30000) {
      const waitSeconds = Math.ceil((30000 - (now - parseInt(lastSubmission, 10))) / 1000);
      setErrorMsg(`Veuillez patienter ${waitSeconds} secondes avant d'envoyer un nouveau message.`);
      setIsLoading(false);
      return;
    }

    try {
      await api.contact.send({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      sessionStorage.setItem('csz_last_contact_time', Date.now().toString());
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '', company_hp: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setErrorMsg("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Filtres
    if (name === 'phone') {
        value = validatePhone(value);
    } else if (name === 'name') {
        value = validateName(value);
    }

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
       {/* Page Header */}
       <div className="bg-slate-900 dark:bg-black text-white pt-28 pb-14 lg:pt-36 lg:pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Projet conceptuel de démonstration
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
            Nous Contacter
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Coordonnées d'accès, permanence médicale et formulaire d'échange avec le secrétariat du Centre de Santé de Zogbo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Informations */}
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Informations Pratiques
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Coordonnées & Accès
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm sm:text-base leading-relaxed">
              Le Centre de Santé de Zogbo assure une permanence continue au bénéfice des résidents du 9ème arrondissement de Cotonou et des quartiers limitrophes.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">Adresse & Localisation</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">Standard Médical</h4>
                  <a 
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                    className="text-slate-800 dark:text-slate-200 font-semibold text-sm hover:text-teal-700 dark:hover:text-teal-400 transition-colors block"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                  <span className="text-[11px] text-slate-500 dark:text-gray-400">Ligne disponible pour renseignements et urgences</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">Courriel Administratif</h4>
                  <a 
                    href={`mailto:${CONTACT_INFO.email}`} 
                    className="text-slate-800 dark:text-slate-200 font-semibold text-sm hover:text-teal-700 dark:hover:text-teal-400 transition-colors block"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">Horaires & Garde</h4>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium">Urgences & Maternité : <span className="text-teal-700 dark:text-teal-400 font-bold">24h/24 et 7j/7</span></p>
                  <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">Consultations externes : Lundi à Vendredi (08h00 – 18h00)</p>
                </div>
              </div>
            </div>

            {/* Map Link */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Centre+de+Santé+de+Zogbo+Cotonou"
              target="_blank"
              rel="noopener noreferrer"
              className="block h-56 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-700 relative group transition-all"
              title="Ouvrir dans Google Maps"
            >
              <EditableImage
                imageKey="contact_map"
                src={SITE_IMAGES.contactMap} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('placeholder')) target.src = SITE_IMAGES.placeholder;
                }}
                alt="Plan d'accès Centre de Santé Zogbo" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                <span className="bg-white/95 dark:bg-gray-900/95 backdrop-blur px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white shadow-md flex items-center gap-2">
                  <MapPin size={16} className="text-teal-600" /> Ouvrir sur Google Maps
                </span>
              </div>
            </a>
          </div>

          {/* Formulaire de Contact */}
          <div>
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-gray-700 shadow-xs">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Formulaire de Message</h3>
                <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
                  Pour vos demandes administratives, renseignements ou retours d'expérience.
                </p>
              </div>

              {/* Note démonstration */}
              <div className="mb-5 p-3 bg-teal-50/70 dark:bg-teal-950/40 rounded-xl border border-teal-200/60 dark:border-teal-900/60 text-xs text-teal-800 dark:text-teal-200">
                <span className="font-bold">Espace de démonstration :</span> Les messages soumis ici alimentent la base de test sans engagement réel.
              </div>

              {/* Rappel sécurité urgence */}
              <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle size={16} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold block">Urgence vitale ou obstétricale ?</span>
                  Ne déposez pas de message en ligne. Contactez directement le{' '}
                  <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="underline font-bold">
                    {CONTACT_INFO.phone}
                  </a>{' '}
                  ou présentez-vous sans délai à l'accueil (24h/24).
                </div>
              </div>
                
                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-800">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{errorMsg}</span>
                    </div>
                )}

                {isSubmitted ? (
                    <div className="text-center py-20 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                        <CheckCircle className="mx-auto mb-4 text-green-500 dark:text-green-400" size={48} />
                        <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Message envoyé !</h4>
                        <p className="text-green-700 dark:text-green-400">Nous vous répondrons dans les plus brefs délais.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Champ Honeypot Anti-Robot invisible */}
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="company_hp"
                          id="company_hp"
                          value={formData.company_hp}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                    <div className="group">
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet *</label>
                        <input 
                        id="contact-name"
                        type="text" name="name" required value={formData.name} onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                        pattern="[a-zA-ZÀ-ÿ\s'-]+"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="group">
                            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                            <input 
                                id="contact-email"
                                type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>
                        <div className="group">
                            <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                            <input 
                                id="contact-phone"
                                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                inputMode="numeric"
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                pattern="[0-9+\s]+"
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Votre message *</label>
                        <textarea 
                            id="contact-message"
                            name="message" rows={5} required value={formData.message} onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="Votre question ou demande d'information..."
                        ></textarea>
                    </div>

                    {/* Consentement RGPD / APDP */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="contact_privacy"
                        required
                        className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="contact_privacy" className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed cursor-pointer">
                        J'accepte que ces coordonnées soient traitées pour répondre à mon message conformément à la <Link to="/confidentialite" className="text-teal-600 dark:text-teal-400 underline font-semibold" target="_blank">Politique de Confidentialité</Link>.
                      </label>
                    </div>

                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex justify-center items-center disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={18} />}
                        Envoyer le message
                    </button>
                    </form>
                )}
              </div>
          </div>

        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default Contact;
