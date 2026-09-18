
import React from 'react';
import { ArrowRight, Clock, Activity, Phone, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SITE_IMAGES } from '../constants';
import EditableImage from './EditableImage';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-12 lg:pt-20 pb-16 lg:pb-24 bg-slate-50/60 dark:bg-gray-950 transition-colors duration-300 border-b border-slate-200/60 dark:border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Text Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Project Context Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-gray-900 border border-teal-200/70 dark:border-teal-900/60 text-teal-800 dark:text-teal-300 rounded-full font-semibold text-xs tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400"></span>
              <span>Projet conceptuel de démonstration • Cotonou, Bénin</span>
            </div>
          
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Des soins de proximité de qualité, pour chaque famille.
            </h1>
          
            <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Le Centre de Santé de Zogbo regroupe dispensaire, maternité, laboratoire d'analyses et consultations médicales. Une équipe engagée pour la santé publique et le suivi préventif au cœur du 9ᵉ arrondissement de Cotonou.
            </p>
          
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
              <Link 
                to="/appointment"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                Prendre un rendez-vous fictif
                <ArrowRight className="ml-2" size={18} />
              </Link>
              <a 
                href={`tel:${CONTACT_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-all shadow-xs hover:border-slate-400"
              >
                <Phone size={18} className="mr-2 text-teal-700 dark:text-teal-400" />
                Contact : {CONTACT_INFO.phone}
              </a>
            </div>

            {/* Reassurance Indicators */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-gray-800 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Permanence médicale 24h/24 & 7j/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-teal-600 dark:text-teal-400" />
                <span>Protocoles d'hygiène & stérilisation</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-teal-600 dark:text-teal-400" />
                <span>Laboratoire d'analyses sur place</span>
              </div>
            </div>
          </div>

          {/* Image Column (5 cols on lg) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <EditableImage
                imageKey="hero_main_v2" 
                src={SITE_IMAGES.hero} 
                fetchpriority="high"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = SITE_IMAGES.placeholder;
                  target.alt = ""; 
                }}
                alt="Centre de Santé de Zogbo à Cotonou" 
                className="w-full h-[280px] sm:h-[380px] lg:h-[440px] object-cover object-center"
              />
              
              {/* Bottom informative bar */}
              <div className="p-4 bg-white/95 dark:bg-gray-900/95 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service d'urgence</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Accueil permanent & Maternité</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 rounded-md border border-teal-200/60 dark:border-teal-800">
                  Ouvert 24h/24
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
