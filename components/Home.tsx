import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import { SERVICES } from '../constants';
import { api, BlogPost, Announcement } from '../services/api';
import { ArrowRight, Star, ShieldCheck, Clock, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

const Home: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const posts = await api.blog.getAll();
      setLatestPosts(posts.slice(0, 3));
      
      const ann = await api.announcements.getActive();
      setAnnouncement(ann);
    };
    fetchData();
  }, []);

  return (
    <div className="pt-20"> {/* Wrapper avec padding-top pour compenser le Header fixe */}
      
      {/* Dynamic Announcement Banner */}
      {announcement && (
        <div className={`w-full px-4 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-500 ${
            announcement.type === 'alert' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
        }`}>
            <Bell size={16} className="animate-bounce" />
            <span>{announcement.message}</span>
        </div>
      )}

      <div className="-mt-20 md:-mt-0"> 
         <Hero />
      </div>
      
      {/* Section Services Preview */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 flex flex-col items-center justify-center w-full">
            <Reveal width="100%" className="w-full flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center w-full max-w-4xl mx-auto">Nos Services Principaux</h2>
                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-center">Une prise en charge complète et multidisciplinaire pour garantir la santé de toute votre famille.</p>
            </Reveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {SERVICES.slice(0, 3).map((service, index) => (
              <Reveal key={index} delay={index * 0.15}>
                  <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:-translate-y-2 h-full flex flex-col items-center text-center">
                    <div className={`inline-flex p-4 rounded-2xl ${service.color} dark:bg-opacity-20 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm mx-auto`}>
                      <service.icon size={32} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors w-full">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed flex-grow w-full">{service.description}</p>
                    <Link to="/services" className="text-teal-600 dark:text-teal-400 font-bold hover:text-teal-800 dark:hover:text-teal-300 inline-flex items-center mt-auto group/link justify-center">
                      En savoir plus 
                      <ArrowRight size={18} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.4} width="100%" className="w-full">
            <div className="text-center mt-12 md:mt-16 w-full flex justify-center">
                <Link to="/services" className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 border-2 border-teal-600 dark:border-teal-500 text-teal-700 dark:text-teal-400 font-bold rounded-full hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 transition-all shadow-sm hover:shadow-lg text-base md:text-lg">
                Découvrir tous nos services <ArrowRight size={20} className="ml-2"/>
                </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section Stats / Trust */}
      <section className="py-16 md:py-24 bg-teal-900 dark:bg-gray-950 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-teal-800/50 dark:divide-gray-800">
            <Reveal direction="up" delay={0.1}>
                <div className="p-6 hover-lift flex flex-col items-center">
                <div className="flex justify-center mb-4 md:mb-6"><ShieldCheck size={48} className="text-teal-300 md:w-14 md:h-14" /></div>
                <h3 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">100%</h3>
                <p className="text-teal-200 uppercase tracking-widest text-xs md:text-sm font-bold">Engagement Qualité</p>
                </div>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
                <div className="p-6 hover-lift flex flex-col items-center">
                <div className="flex justify-center mb-4 md:mb-6"><Star size={48} className="text-teal-300 md:w-14 md:h-14" /></div>
                <h3 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">30+</h3>
                <p className="text-teal-200 uppercase tracking-widest text-xs md:text-sm font-bold">Années d'expérience</p>
                </div>
            </Reveal>
            <Reveal direction="up" delay={0.3}>
                <div className="p-6 hover-lift flex flex-col items-center">
                <div className="flex justify-center mb-4 md:mb-6"><Clock size={48} className="text-teal-300 md:w-14 md:h-14" /></div>
                <h3 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">24/7</h3>
                <p className="text-teal-200 uppercase tracking-widest text-xs md:text-sm font-bold">Service d'Urgence</p>
                </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section Latest News */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 flex flex-col items-center justify-center w-full">
            <Reveal width="100%" className="w-full flex flex-col items-center">
                <div className="inline-block text-center w-full flex flex-col items-center">
                    <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider text-xs md:text-sm mb-2 block">Blog & Actualités</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 w-full text-center max-w-4xl mx-auto">Dernières publications</h2>
                    <Link to="/blog" className="inline-flex items-center text-teal-600 dark:text-teal-400 font-bold hover:text-teal-800 dark:hover:text-teal-300 border-2 border-teal-100 dark:border-gray-700 px-6 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-gray-800 transition-all text-sm">
                        Voir le blog <ArrowRight size={16} className="ml-2" />
                    </Link>
                </div>
            </Reveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
             {latestPosts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.1} width="100%">
                    <Link to={`/blog/${post.id}`} className="group cursor-pointer block h-full flex flex-col">
                    <div className="rounded-3xl overflow-hidden mb-4 md:mb-6 h-48 md:h-64 shadow-lg relative bg-gray-100 dark:bg-gray-800 shrink-0">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                        <div className="absolute top-4 left-4 flex flex-col items-start gap-1 z-20">
                            <span className="bg-white/95 backdrop-blur px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold text-teal-800 shadow-sm uppercase tracking-wider">
                                {post.category}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow items-center text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-tight line-clamp-2 w-full">{post.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed text-sm md:text-base mb-4 flex-grow w-full">{post.excerpt}</p>
                        <span className="inline-flex items-center text-teal-600 dark:text-teal-400 font-bold text-sm group-hover:underline mt-auto">Lire la suite <ArrowRight size={14} className="ml-1"/></span>
                    </div>
                    </Link>
                </Reveal>
             ))}
          </div>
        </div>
      </section>
      
      {/* CTA Appointment */}
      <section className="py-16 md:py-24 bg-gray-900 text-white text-center relative overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center justify-center">
          <Reveal direction="down" width="100%" className="w-full flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight text-center w-full max-w-4xl mx-auto">Besoin d'une consultation ?</h2>
          </Reveal>
          <Reveal delay={0.2} width="100%" className="w-full">
            <p className="text-gray-300 mb-8 md:mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-center">
                Ne retardez pas vos soins. Prenez rendez-vous dès maintenant avec nos spécialistes via notre plateforme en ligne sécurisée.
            </p>
          </Reveal>
          <Reveal delay={0.4} width="100%" className="w-full">
            <div className="text-center w-full flex justify-center">
                <Link to="/appointment" className="inline-flex items-center bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 px-8 md:py-5 md:px-12 rounded-2xl transition-all shadow-xl hover:shadow-teal-500/50 transform hover:-translate-y-2 text-base md:text-lg w-full md:w-auto justify-center">
                    <Clock size={24} className="mr-3" />
                    Prendre Rendez-vous
                </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;