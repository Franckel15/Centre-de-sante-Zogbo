
import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import { SERVICES } from '../constants';
import { api, BlogPost } from '../services/api';
import { ArrowRight, Star, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

const Home: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const posts = await api.blog.getAll();
      setLatestPosts(posts.slice(0, 3));
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24 md:pt-28"> {/* Padding ajusté pour compenser le header fixe */}
      
      <div className="-mt-10 md:-mt-0"> 
         <Hero />
      </div>
      
      {/* Section Services Preview */}
      <section className="py-16 md:py-24 bg-slate-50/70 dark:bg-gray-900/60 transition-colors border-b border-slate-200/60 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 flex flex-col items-center justify-center w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200/60 dark:border-teal-900 mb-3">
              Départements & Consultations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center max-w-3xl">
              Une prise en charge médicale complète
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl text-center">
              Des soins primaires, préventifs et d'urgence adaptés aux besoins de la population du quartier Zogbo et de Cotonou.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {SERVICES.slice(0, 3).map((service, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-md hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-200 flex flex-col h-full group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.color} dark:bg-opacity-20 mb-6 group-hover:scale-105 transition-transform`}>
                  <service.icon size={26} className="text-teal-700 dark:text-teal-300" />
                </div>
                <h3 className="text-xl font-bold mb-2.5 text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-gray-700/60 flex items-center justify-between mt-auto">
                  <Link 
                    to="/services" 
                    className="text-teal-700 dark:text-teal-400 font-semibold text-sm hover:text-teal-900 dark:hover:text-teal-300 inline-flex items-center group/link"
                  >
                    Consulter les détails 
                    <ArrowRight size={16} className="ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/appointment"
                    className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-200 rounded-md hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-teal-950 transition-colors"
                  >
                    Rendez-vous
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 md:mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-gray-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all text-sm shadow-xs hover:border-slate-400"
            >
              Voir la totalité des services médicaux
              <ArrowRight size={16} className="ml-2"/>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Engagements & Transparence */}
      <section className="py-14 md:py-18 bg-teal-950 text-white border-b border-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-teal-900/80">
            <div className="pt-6 md:pt-0 md:px-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-teal-900/60 border border-teal-700/50 flex items-center justify-center mb-4 text-teal-300">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight text-white">Soins de Proximité</h3>
              <p className="text-teal-200/80 text-sm leading-relaxed max-w-xs">
                Accueil attentif et respectueux pour chaque patient, orienté vers la santé communautaire et maternelle.
              </p>
            </div>
            
            <div className="pt-6 md:pt-0 md:px-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-teal-900/60 border border-teal-700/50 flex items-center justify-center mb-4 text-teal-300">
                <Star size={26} />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight text-white">Ancrage Territorial</h3>
              <p className="text-teal-200/80 text-sm leading-relaxed max-w-xs">
                Présent au service des habitants du quartier Zogbo et des zones limitrophes de Cotonou depuis 1990.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:px-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-teal-900/60 border border-teal-700/50 flex items-center justify-center mb-4 text-teal-300">
                <Clock size={26} />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight text-white">Permanence 24/7</h3>
              <p className="text-teal-200/80 text-sm leading-relaxed max-w-xs">
                Continuité des soins assurée pour les urgences médicales de base et les accouchements à la maternité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Latest News */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-slate-100 dark:border-gray-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Sensibilisation & Actualités
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Conseils et informations de santé
              </h2>
            </div>
            <Link 
              to="/blog" 
              className="inline-flex items-center text-teal-700 dark:text-teal-400 font-semibold text-sm hover:text-teal-900 dark:hover:text-teal-300 group"
            >
              Consulter tous les articles 
              <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
             {latestPosts.map((post) => (
                <Link 
                  key={post.id}
                  to={`/blog/${post.id}`} 
                  className="group block h-full flex flex-col rounded-2xl border border-slate-200/80 dark:border-gray-800 bg-white dark:bg-gray-800/60 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="h-44 sm:h-48 overflow-hidden relative bg-slate-100 dark:bg-gray-800 shrink-0">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 dark:bg-gray-900/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-semibold text-teal-800 dark:text-teal-300 shadow-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <span className="text-xs text-slate-500 dark:text-gray-400 mb-2">{post.date}</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 inline-flex items-center">
                      Lire l'article <ArrowRight size={14} className="ml-1" />
                    </span>
                  </div>
                </Link>
             ))}
          </div>
        </div>
      </section>
      
      {/* CTA Appointment */}
      <section className="py-14 md:py-20 bg-slate-900 dark:bg-black text-white text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">Prise en charge</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Besoin d'une consultation médicale ?
          </h2>
          <p className="text-slate-300 mb-8 text-base md:text-lg max-w-2xl leading-relaxed">
            Planifiez une demande de consultation via notre formulaire en ligne ou contactez notre secrétariat pour toute question de santé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <Link 
              to="/appointment" 
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-sm hover:shadow-md text-sm sm:text-base w-full sm:w-auto"
            >
              <Clock size={18} className="mr-2" />
              Prendre rendez-vous en ligne
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-3.5 px-8 rounded-xl transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              Joindre le centre
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-5">
            Note de démonstration : les demandes enregistrées restent stockées dans l'environnement de test de l'application.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
