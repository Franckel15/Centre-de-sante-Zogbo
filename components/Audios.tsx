
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
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
       <div className="bg-teal-800 text-white pt-32 pb-16 lg:pt-40 lg:pb-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-teal-900/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
             <Reveal direction="down">
                 <div className="inline-flex p-3 bg-teal-700/50 rounded-full mb-6 ring-1 ring-teal-400/30">
                    <Lightbulb size={32} className="text-teal-300" />
                 </div>
             </Reveal>
             <Reveal delay={0.1}>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Conseils & Audios</h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-teal-100 text-xl max-w-2xl mx-auto">
                    Retrouvez nos conseils santé, émissions et podcasts éducatifs classés par service pour prendre soin de vous au quotidien.
                </p>
             </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-teal-600" size={40} />
            </div>
        ) : (
            <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {audios.map((audio, index) => (
                    <Reveal key={audio.id} delay={index * 0.1} width="100%">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col md:flex-row group h-full">
                            {/* Visual Side */}
                            <div className="bg-teal-600 p-6 md:w-1/3 flex flex-col justify-center items-center text-center text-white relative overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-800 opacity-90"></div>
                                <div className="relative z-10">
                                    <div className="bg-white/20 p-4 rounded-full mb-3 backdrop-blur-sm mx-auto w-fit">
                                        <Music4 size={32} />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-wider opacity-90 block">{audio.serviceName}</span>
                                </div>
                                <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
                                    <Mic2 size={120} />
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="p-6 md:w-2/3 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                                    {audio.title}
                                </h3>
                                
                                {audio.created_at && (
                                    <div className="flex items-center text-xs text-gray-400 mb-4 font-medium uppercase tracking-wide">
                                        <Calendar size={12} className="mr-1.5" />
                                        {new Date(audio.created_at).toLocaleDateString()}
                                    </div>
                                )}

                                {audio.description && (
                                    <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
                                        {audio.description}
                                    </p>
                                )}
                                
                                <div className="mt-auto bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <audio src={audio.url} controls className="w-full h-8" />
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
                </div>

                {audios.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <Headphones size={32} className="text-gray-400"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Aucun conseil audio disponible</h3>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto">La médiathèque est vide pour le moment. Revenez bientôt pour écouter nos nouveaux contenus !</p>
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
