
import React from 'react';
import { TEAM_STRUCTURE } from '../constants';
import Reveal from './Reveal';
import EditableImage from './EditableImage';
import { Stethoscope, ShieldCheck, Users, Info, HeartPulse, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Team: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Page Header */}
      <div className="bg-slate-900 dark:bg-black text-white pt-28 pb-14 lg:pt-36 lg:pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Projet conceptuel de démonstration
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
            Équipe & Organisation des Soins
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Une équipe soignante pluridisciplinaire et un comité de gestion engagés pour la santé communautaire à Cotonou.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20 space-y-12 relative z-10">
        {/* Notice d'organisation des soins */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
              <Stethoscope size={24} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Permanence et continuité des soins</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                Le personnel médical et soignant (médecin chef, sages-femmes d'État, infirmiers diplômés, techniciens de laboratoire et agents de santé) assure une garde 24h/24 pour la maternité et les urgences, ainsi que des consultations programmées.
              </p>
            </div>
          </div>
          <Link 
            to="/appointment" 
            className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 w-full sm:w-auto"
          >
            Prendre RDV
          </Link>
        </div>

        {/* Structure des Pôles et Responsabilités */}
        {TEAM_STRUCTURE.map((group, index) => (
          <div key={index} className="space-y-8">
            <Reveal width="100%">
              <div className="flex items-center gap-4">
                <div className="h-px bg-teal-200 dark:bg-teal-800 flex-grow"></div>
                <h2 className="text-xl md:text-2xl font-bold text-teal-800 dark:text-teal-300 text-center uppercase tracking-wide px-2">
                  {group.category}
                </h2>
                <div className="h-px bg-teal-200 dark:bg-teal-800 flex-grow"></div>
              </div>
            </Reveal>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.members.map((member, mIndex) => (
                <Reveal key={mIndex} delay={mIndex * 0.08} width="100%">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 dark:border-gray-700 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          <ShieldCheck size={20} />
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Pôle actif
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {member.role}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {group.category}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-medium">
                      <span>Prise en charge</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 dark:text-gray-400">Zogbo</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}

        {/* Note de Transparence Institutionnelle */}
        <Reveal width="100%">
          <div className="bg-gray-100 dark:bg-gray-800/60 rounded-2xl p-6 text-center max-w-3xl mx-auto border border-gray-200 dark:border-gray-700">
            <div className="inline-flex p-3 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 mb-3">
              <Info size={22} />
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Transparence & Qualité des Praticiens</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Le Centre de Santé de Zogbo fonctionne conformément aux normes sanitaires nationales. La liste nominative des praticiens et des membres du COGES est affichée au tableau d'information interne du centre.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Team;
