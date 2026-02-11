
import React from 'react';
import { ArrowRight, Clock, Activity, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SITE_IMAGES } from '../constants';
import Reveal from './Reveal';
import EditableImage from './EditableImage';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-20 lg:pt-32 pb-16 lg:pb-32 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-950 min-h-[90vh] flex items-center transition-colors duration-300">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-100/40 dark:bg-teal-900/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100/40 dark:bg-blue-900/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left pt-6 sm:pt-0">
            {/* On retire Reveal sur les éléments critiques pour garantir l'affichage */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-teal-100 dark:border-gray-700 text-teal-800 dark:text-teal-300 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-shadow cursor-default mb-6">
                <Clock size={14} className="text-teal-500 dark:text-teal-400" />
                <span>Au service de Zogbo depuis {CONTACT_INFO.founded}</span>
                </div>
            
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                Votre santé, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 animate-gradient-xy">
                    notre priorité
                </span>
                </h1>
            
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                Le Centre de Santé de Zogbo s'engage à fournir des soins médicaux d'excellence. 
                Une équipe dévouée, un plateau technique moderne et une approche humaine pour toute la famille.
                </p>
            
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link 
                    to="/appointment"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-teal-600 dark:bg-teal-500 rounded-xl hover:bg-teal-700 dark:hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-600/40 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                    Prendre Rendez-vous
                    <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link 
                    to="/services"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-teal-700 dark:text-teal-300 bg-white dark:bg-gray-800 border-2 border-teal-100 dark:border-gray-700 rounded-xl hover:border-teal-200 hover:bg-teal-50 dark:hover:bg-gray-700 transition-all hover:shadow-md transform hover:-translate-y-1"
                >
                    Nos Services
                </Link>
                </div>
            </div>

            <Reveal delay={0.4}>
                <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-4 opacity-80 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Urgences 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s'}}></div>
                         <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Laboratoire certifié</span>
                    </div>
                </div>
            </Reveal>
          </div>

          {/* Image Content */}
          <div className="relative lg:h-[600px] flex items-center justify-center mt-10 lg:mt-0">
             <div className="relative w-full max-w-lg lg:max-w-full">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-200/30 to-blue-200/30 dark:from-teal-900/30 dark:to-blue-900/30 rounded-full blur-3xl animate-pulse-soft"></div>
                
                {/* Main Image with Editable capability */}
                <div className="animate-float relative z-10">
                    <EditableImage
                        imageKey="hero_main_v2" 
                        src={SITE_IMAGES.hero} 
                        fetchPriority="high"
                        loading="eager"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = SITE_IMAGES.placeholder;
                            target.alt = ""; 
                        }}
                        alt="Centre de Santé de Zogbo" 
                        className="rounded-3xl shadow-2xl w-full object-cover object-center h-[300px] sm:h-[450px] lg:h-[550px] border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-800"
                    />
                    
                    {/* Floating Card 1: Urgences */}
                    <div className="absolute -bottom-8 sm:-bottom-24 left-4 md:-left-8 bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-bounce hidden sm:block" style={{ animationDuration: '3s' }}>
                        <div className="flex items-center gap-4">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400 animate-pulse">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Réponse Rapide</p>
                                <p className="font-bold text-gray-900 dark:text-white text-lg">Ambulance prête</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Card 2: Contact */}
                    <div className="absolute top-4 sm:top-10 -right-4 sm:-right-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hidden sm:block transform hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full text-teal-600 dark:text-teal-400">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">Besoin d'aide ?</p>
                                <p className="font-bold text-teal-800 dark:text-teal-300">{CONTACT_INFO.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
