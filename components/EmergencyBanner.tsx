import React, { useState } from 'react';
import { AlertCircle, Phone, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../constants';

const EmergencyBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <aside aria-label="Urgences Médicales" className="bg-red-600 text-white text-xs sm:text-sm py-2.5 px-4 shadow-md relative z-40 border-b border-red-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="flex items-center gap-2 justify-center flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider bg-white text-red-700 px-2 py-0.5 rounded text-[11px]">
            <ShieldAlert size={14} className="shrink-0 animate-pulse" /> Urgence Vitale
          </span>
          <span className="font-medium">
            En cas de détresse immédiate, ne remplissez pas de formulaire : appelez sans attendre le centre ou rendez-vous sur place.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`tel:${CONTACT_INFO.phoneRaw}`}
            className="inline-flex items-center gap-1.5 bg-white text-red-700 hover:bg-red-50 font-bold px-3 py-1 rounded-lg transition-colors shadow-sm text-xs"
            title="Appeler immédiatement les urgences du centre"
          >
            <Phone size={13} className="shrink-0" />
            Appel direct : {CONTACT_INFO.phone}
          </a>
          <span className="hidden sm:inline text-red-200 text-xs">
            (Pompiers : 118)
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-red-200 hover:text-white p-1 rounded transition-colors"
            title="Masquer ce bandeau pour la session"
            aria-label="Fermer le bandeau d'alerte"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default EmergencyBanner;
