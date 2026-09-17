import React from 'react';
import { Home, ArrowLeft, Phone, Search, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../constants';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-32 transition-colors duration-300">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Stethoscope size={40} />
        </div>

        <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider text-xs block mb-2">Erreur 404</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Page introuvable</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée. Vous pouvez retourner à l'accueil ou contacter notre équipe.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
          >
            <Home size={18} />
            Retour à l'accueil
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-sm transition-all"
          >
            <Phone size={18} />
            Nous contacter
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          Besoin d'une assistance immédiate ? Appelez le <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">{CONTACT_INFO.phone}</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
