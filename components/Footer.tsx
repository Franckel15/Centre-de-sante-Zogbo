
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
                    Votre partenaire santé de confiance à Cotonou depuis 1990. 
                    Des soins de qualité, accessibles à tous, dans un environnement moderne.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 hover:text-white transition-colors"><Facebook size={18} /></a>
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 hover:text-white transition-colors"><Twitter size={18} /></a>
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 hover:text-white transition-colors"><Instagram size={18} /></a>
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
                 <h4 className="text-white font-bold text-lg mb-6">Horaires d'ouverture</h4>
                 <ul className="space-y-3 text-sm">
                    <li className="flex justify-between"><span>Lundi - Vendredi</span> <span className="text-teal-400">24h/24</span></li>
                    <li className="flex justify-between"><span>Samedi</span> <span className="text-teal-400">24h/24</span></li>
                    <li className="flex justify-between"><span>Dimanche</span> <span className="text-teal-400">24h/24</span></li>
                 </ul>
                 <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-xs text-teal-400 font-bold uppercase mb-1">Urgence</p>
                    <p className="text-white font-bold text-lg">{CONTACT_INFO.phone}</p>
                 </div>
            </div>

            {/* Colonne 4 : Contact */}
            <div>
                <h4 className="text-white font-bold text-lg mb-6">Contact</h4>
                <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                        <MapPin size={18} className="text-teal-500 shrink-0 mt-0.5" />
                        <span>{CONTACT_INFO.address}<br/>Cotonou, Bénin</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Phone size={18} className="text-teal-500 shrink-0" />
                        <span>{CONTACT_INFO.phone}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Mail size={18} className="text-teal-500 shrink-0" />
                        <span>{CONTACT_INFO.email}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500 text-center md:text-left">&copy; {new Date().getFullYear()} Centre de Santé de Zogbo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
