
import React, { useEffect, useState } from 'react';
import { api, AudioResource } from '../services/api';
import { Loader2, Headphones, Calendar, Music4, Mic2, Tag, Lightbulb } from 'lucide-react';
import BackToTop from './BackToTop';
import Reveal from './Reveal';

const Audios: React.FC = () => {
  const [audios, setAudios] = useState<AudioResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudios = async () => {
        try {
            const data = await api.audios.getAll();
            setAudios(data);
        } catch (error) {
            console.error("Erreur chargement audios:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchAudios();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Page Header */}
      <div className="bg-slate-900 dark:bg-black text-white pt-28 pb-14 lg:pt-36 lg:pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Projet conceptuel de démonstration
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
            Conseils & Chroniques Santé
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Chroniques éducatives et conseils préventifs pour accompagner les familles au quotidien.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20 relative z-10">
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={36} />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {audios.map((audio) => (
                <div 
                  key={audio.id} 
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 shadow-xs overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow"
                >
                  {/* Visual Side */}
                  <div className="bg-teal-700 dark:bg-teal-900/60 p-6 sm:w-2/5 flex flex-col justify-center items-center text-center text-white shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                      <Music4 size={24} />
                    </div>
                    <span className="font-semibold text-xs uppercase tracking-wider text-teal-100 block">{audio.serviceName}</span>
                  </div>

                  {/* Content Side */}
                  <div className="p-5 sm:p-6 sm:w-3/5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                        {audio.title}
                      </h3>
                      
                      {audio.created_at && (
                        <div className="flex items-center text-xs text-slate-400 dark:text-gray-400 mb-3 font-medium">
                          <Calendar size={13} className="mr-1.5" />
                          {new Date(audio.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      )}

                      {audio.description && (
                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">
                          {audio.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-2 pt-3 border-t border-slate-100 dark:border-gray-700">
                      <audio src={audio.url} controls className="w-full h-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {audios.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700">
                <div className="bg-slate-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-gray-300">
                  <Headphones size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Aucun enregistrement disponible</h3>
                <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                  La médiathèque audio sera enrichie prochainement de chroniques médicales.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <BackToTop />
    </div>
  );
};

export default Audios;
