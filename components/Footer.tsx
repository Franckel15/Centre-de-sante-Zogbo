
import React from 'react';
import { HeartPulse, Facebook, Twitter, Instagram, Phone, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, NAV_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Colonne 1 : Brand */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-teal-600 p-2 rounded-lg text-white">
                        <HeartPulse size={24} />
                    </div>
                    <span className="text-white font-bold text-xl">CS Zogbo</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Établissement de soins de santé de proximité au cœur de Cotonou. 
                    Dispensaire, maternité, laboratoire et consultations au service de la communauté.
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                    <p className="font-semibold text-gray-300">Permanence téléphonique :</p>
                    <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="text-teal-400 font-bold hover:underline block text-sm">
                        {CONTACT_INFO.phone}
                    </a>
                </div>
            </div>

            {/* Colonne 2 : Liens Rapides */}
            <div>
                <h4 className="text-white font-bold text-lg mb-6">Liens Rapides</h4>
                <ul className="space-y-3">
                    {NAV_LINKS.map(link => (
                        <li key={link.name}>
                            <Link to={link.href} className="text-sm hover:text-teal-400 transition-colors flex items-center gap-2">
                                <span className="h-1 w-1 bg-teal-500 rounded-full"></span>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Colonne 3 : Horaires */}
            <div>
                 <h4 className="text-white font-bold text-lg mb-6">Horaires des Soins</h4>
                 <ul className="space-y-3 text-sm">
                    <li className="flex justify-between flex-col sm:flex-row border-b border-gray-800 pb-2">
                        <span>Consultations Médecin :</span>
                        <span className="text-teal-400 font-medium">08h00 - 18h00</span>
                    </li>
                    <li className="flex justify-between flex-col sm:flex-row border-b border-gray-800 pb-2">
                        <span>Urgences & Garde :</span>
                        <span className="text-teal-400 font-bold">24h/24 - 7j/7</span>
                    </li>
                    <li className="flex justify-between flex-col sm:flex-row border-b border-gray-800 pb-2">
                        <span>Maternité :</span>
                        <span className="text-teal-400 font-bold">24h/24 - 7j/7</span>
                    </li>
                 </ul>
                 <div className="mt-5 p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <p className="text-xs text-red-400 font-bold uppercase mb-1">Ligne Directe Soins</p>
                    <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="text-white font-bold text-lg hover:text-teal-400 transition-colors block">
                        {CONTACT_INFO.phone}
                    </a>
                 </div>
            </div>

            {/* Colonne 4 : Contact */}
            <div>
                <h4 className="text-white font-bold text-lg mb-6">Contact & Accès</h4>
                <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                        <MapPin size={18} className="text-teal-500 shrink-0 mt-0.5" />
                        <span>{CONTACT_INFO.address}<br/>Quartier Zogbo, Cotonou</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Phone size={18} className="text-teal-500 shrink-0" />
                        <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="hover:text-teal-400 transition-colors">
                            {CONTACT_INFO.phone}
                        </a>
                    </li>
                    <li className="flex items-center gap-3">
                        <Mail size={18} className="text-teal-500 shrink-0" />
                        <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-teal-400 transition-colors">
                            {CONTACT_INFO.email}
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        {/* Notice projet conceptuel fictif */}
        <div className="mb-8 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            <span className="font-semibold text-teal-400 mr-1.5">Note d'information :</span>
            Projet conceptuel fictif — ce site n’est pas le site officiel d’un établissement de santé.
          </p>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Centre de Santé de Zogbo (Cotonou, Bénin). Environnement de démonstration.</p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
                <Link to="/mentions-legales" className="hover:text-teal-300 transition-colors">
                    Mentions Légales & Agréments
                </Link>
                <span>&bull;</span>
                <Link to="/confidentialite" className="hover:text-teal-300 transition-colors">
                    Politique de Confidentialité
                </Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
