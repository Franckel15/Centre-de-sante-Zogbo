
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
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
    message: ''
  });

  // --- VALIDATORS ---
  const validateName = (val: string) => val.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
  const validatePhone = (val: string) => val.replace(/[^0-9+\s]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await api.contact.send(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
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
       <div className="bg-gray-900 dark:bg-black text-white pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <Reveal direction="down">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Contactez-Nous</h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                    Nous sommes à votre écoute pour toute question ou urgence.
                </p>
             </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Informations */}
          <div>
            <Reveal width="100%">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-l-4 border-teal-500 pl-4">Nos Coordonnées</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Le Centre de Santé de Zogbo est situé au cœur de Cotonou. Notre équipe est disponible pour répondre à vos besoins de santé.
                </p>

                <div className="space-y-8 mb-12">
                <div className="flex items-start gap-5">
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-xl text-teal-600 dark:text-teal-400">
                    <MapPin size={28} />
                    </div>
                    <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">Adresse</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">{CONTACT_INFO.address}</p>
                    </div>
                </div>

                <div className="flex items-start gap-5">
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-xl text-teal-600 dark:text-teal-400">
                    <Phone size={28} />
                    </div>
                    <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">Téléphone</h4>
                    <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-gray-600 dark:text-gray-300 text-lg hover:text-teal-600 dark:hover:text-teal-400 hover:underline transition-all font-medium block">
                        {CONTACT_INFO.phone}
                    </a>
                    </div>
                </div>

                <div className="flex items-start gap-5">
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-xl text-teal-600 dark:text-teal-400">
                    <Mail size={28} />
                    </div>
                    <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">Email</h4>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-600 dark:text-gray-300 text-lg hover:text-teal-600 dark:hover:text-teal-400 hover:underline transition-all block">
                        {CONTACT_INFO.email}
                    </a>
                    </div>
                </div>
                </div>

                {/* Map Link - Clickable */}
                <a 
                    href="https://www.google.com/maps/search/?api=1&query=Centre+de+Santé+de+Zogbo+Cotonou"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-64 w-full rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 relative group border border-gray-200 dark:border-gray-700 hover:ring-4 hover:ring-teal-500/20 transition-all cursor-pointer"
                    title="Ouvrir dans Google Maps"
                >
                    <EditableImage
                        imageKey="contact_map"
                        src={SITE_IMAGES.contactMap} 
                        onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             if (!target.src.includes('placeholder')) target.src = SITE_IMAGES.placeholder;
                        }}
                        alt="Carte de localisation" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="bg-white/90 dark:bg-black/80 backdrop-blur px-6 py-3 rounded-xl font-bold shadow-xl text-gray-900 dark:text-white flex items-center gap-2 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <MapPin size={18} /> Voir sur la carte
                        </span>
                    </div>
                </a>
            </Reveal>
          </div>

          {/* Formulaire de Contact */}
          <Reveal width="100%" delay={0.2}>
              <div className="bg-white dark:bg-gray-800 p-8 lg:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Envoyez-nous un message</h3>
                
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
                    <div className="group">
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
                        <input 
                        id="contact-name"
                        type="text" name="name" required value={formData.name} onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                        pattern="[a-zA-ZÀ-ÿ\s'-]+"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="group">
                            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
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
                        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Votre message</label>
                        <textarea 
                            id="contact-message"
                            name="message" rows={5} required value={formData.message} onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                        ></textarea>
                    </div>
                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex justify-center items-center disabled:opacity-50 border border-transparent dark:border-gray-600"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={18} />}
                        Envoyer le message
                    </button>
                    </form>
                )}
              </div>
          </Reveal>

        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default Contact;
