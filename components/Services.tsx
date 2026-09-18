
import React from 'react';
import { SERVICES, CONTACT_INFO } from '../constants';
import BackToTop from './BackToTop';
import Reveal from './Reveal';
import EditableImage from './EditableImage';
import { Calendar, PhoneCall, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col transition-colors duration-300">
      {/* Page Header */}
      <div className="bg-slate-900 dark:bg-black text-white pt-36 sm:pt-40 lg:pt-44 pb-14 lg:pb-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Projet conceptuel de démonstration
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
            Nos Départements Médicaux
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Une offre de soins de premier recours, intégrée et accessible pour la santé de toute la famille à Zogbo.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => {
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 shadow-xs overflow-hidden flex flex-col h-full hover:shadow-md hover:border-teal-500/40 transition-all duration-200 group"
              >
                {/* Zone Image du Service */}
                <div className="h-48 w-full overflow-hidden relative bg-slate-100 dark:bg-gray-700">
                  <EditableImage 
                    imageKey={`service_img_${index}`}
                    src={service.image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3">
                    <div className={`w-10 h-10 rounded-xl ${service.color} flex items-center justify-center shadow-sm`}>
                      <service.icon size={22} className="text-teal-800 dark:text-teal-200" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-gray-700/60 flex items-center justify-between">
                    <Link 
                      to="/appointment" 
                      className="inline-flex items-center text-teal-700 dark:text-teal-400 font-semibold text-sm hover:text-teal-900 dark:hover:text-teal-300 group/btn"
                    >
                      Prendre rendez-vous 
                      <ArrowRight size={15} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <a 
                      href={`tel:${CONTACT_INFO.phoneRaw}`} 
                      className="text-slate-500 hover:text-teal-700 dark:text-gray-400 dark:hover:text-teal-300 text-xs font-medium"
                      title="Appeler le standard"
                    >
                      Informations
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bannière de contact rapide pour les services */}
        <div className="mt-14 bg-slate-900 dark:bg-black text-white rounded-2xl p-6 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1 block">Assistance patient</span>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Besoin d'un renseignement sur un examen ?</h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Notre secrétariat médical vous renseigne par téléphone sur les modalités de prise en charge, les horaires et la préparation requise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0 w-full md:w-auto">
            <a 
              href={`tel:${CONTACT_INFO.phoneRaw}`} 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-colors w-full sm:w-auto"
            >
              <PhoneCall size={16} /> {CONTACT_INFO.phone}
            </a>
            <Link 
              to="/appointment" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold text-xs sm:text-sm transition-colors w-full sm:w-auto"
            >
              <Calendar size={16} /> Demande de RDV en ligne
            </Link>
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default Services;
