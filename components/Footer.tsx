
import React from 'react';
import { HeartPulse, Phone, MapPin, Mail, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, NAV_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          
          {/* Colonne 1 : Identité & Établissement (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <HeartPulse size={22} />
              </div>
              <div>
                <span className="text-white font-bold text-lg leading-snug block">CS Zogbo</span>
                <span className="text-xs text-slate-400 font-medium">Centre de Santé de Zogbo · Cotonou</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Établissement public de soins de santé de proximité au service des populations du 9ème arrondissement et environs. Consultations, maternité, analyses et urgences 24h/24.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                <ShieldCheck size={15} className="text-teal-400 shrink-0" />
                <span>Premier échelon de la pyramide sanitaire</span>
              </div>
            </div>
          </div>

          {/* Colonne 2 : Liens Rapides (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm sm:text-base mb-4 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              Plan du Site
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {NAV_LINKS.slice(0, 6).map(link => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-teal-300 transition-colors inline-flex items-center gap-1.5 hover:translate-x-0.5 transform duration-150"
                  >
                    <span className="text-slate-600">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/contact" 
                  className="text-slate-400 hover:text-teal-300 transition-colors inline-flex items-center gap-1.5 hover:translate-x-0.5 transform duration-150"
                >
                  <span className="text-slate-600">›</span>
                  Contact & Accès
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Horaires des Soins Optimisée (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm sm:text-base mb-4 tracking-tight flex items-center gap-2">
              <Clock size={16} className="text-teal-400 shrink-0" />
              Horaires des Soins
            </h4>

            {/* Cartes d'horaires sans rupture de ligne */}
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 block truncate">Consultations Médecin</span>
                  <span className="text-[11px] text-slate-400 block">Du lundi au vendredi</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-teal-950/90 text-teal-300 border border-teal-800/80 whitespace-nowrap shrink-0">
                  08h00 – 18h00
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 block truncate">Maternité & Naissances</span>
                  <span className="text-[11px] text-slate-400 block">Garde continue</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 whitespace-nowrap shrink-0">
                  24h/24 · 7j/7
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 block truncate">Urgences & Soins de garde</span>
                  <span className="text-[11px] text-slate-400 block">Accueil permanent</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 whitespace-nowrap shrink-0">
                  24h/24 · 7j/7
                </span>
              </div>
            </div>

            {/* Encart Ligne Directe Soins */}
            <div className="mt-3.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  Ligne Directe Soins
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Permanence</span>
              </div>
              <a 
                href={`tel:${CONTACT_INFO.phoneRaw}`} 
                className="text-white font-bold text-sm sm:text-base hover:text-teal-400 transition-colors block whitespace-nowrap tracking-tight"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>

          {/* Colonne 4 : Contact & Accès (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm sm:text-base mb-4 tracking-tight flex items-center gap-2">
              <MapPin size={16} className="text-teal-400 shrink-0" />
              Coordonnées
            </h4>

            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">
                  {CONTACT_INFO.address}<br />
                  <span className="text-slate-400">9ème Arrondissement, Cotonou</span>
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-teal-400 shrink-0" />
                <a 
                  href={`tel:${CONTACT_INFO.phoneRaw}`} 
                  className="text-slate-300 hover:text-teal-300 transition-colors whitespace-nowrap font-medium"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-teal-400 shrink-0" />
                <a 
                  href={`mailto:${CONTACT_INFO.email}`} 
                  className="text-slate-300 hover:text-teal-300 transition-colors truncate"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>

            <div className="pt-1">
              <Link 
                to="/appointment"
                className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl bg-teal-600/90 hover:bg-teal-600 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Calendar size={14} />
                <span>Prendre un rendez-vous</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>

        {/* Notice d'information démonstration */}
        <div className="mb-8 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
          <p className="text-xs text-slate-300">
            <span className="font-semibold text-teal-400 mr-1.5">Note d'information :</span>
            Projet conceptuel fictif — ce site présente une maquette interactive pour la communauté de Zogbo et n’engage pas un service officiel.
          </p>
        </div>

        {/* Pied de page inférieur */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Centre de Santé de Zogbo (Cotonou, Bénin). Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-slate-400">
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

