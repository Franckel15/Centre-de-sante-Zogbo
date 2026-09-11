
import React from 'react';
import { SERVICES } from '../constants';
import BackToTop from './BackToTop';
import Reveal from './Reveal';
import EditableImage from './EditableImage';

const Services: React.FC = () => {

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col transition-colors duration-300">
      {/* Page Header */}
      <div className="bg-teal-800 dark:bg-teal-950 text-white pt-32 pb-16 lg:pt-40 lg:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3 animate-spin" style={{ animationDuration: '60s' }}>
             <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.2C93.5,8.9,82.2,22.1,71.6,33.8C61,45.5,51.1,55.7,39.8,63.6C28.5,71.5,15.8,77.1,2.3,73.1C-11.2,69.1,-25.5,55.5,-38.3,46.7C-51.1,37.9,-62.4,33.9,-70.5,26.4C-78.6,18.9,-83.5,7.9,-81.4,-2.2C-79.3,-12.3,-70.2,-21.5,-60.8,-29.4C-51.4,-37.3,-41.7,-43.9,-31.6,-53.4C-21.5,-62.9,-11,-75.3,1.3,-77.6C13.6,-79.9,27.2,-72.1,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <Reveal direction="down">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Nos Départements Médicaux</h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-teal-100 text-xl max-w-2xl mx-auto leading-relaxed">
                    Une offre de soins complète et intégrée pour répondre à tous les besoins de santé de votre famille.
                </p>
             </Reveal>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            return (
                <Reveal key={index} delay={index * 0.1}>
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                        {/* Zone Image du Service */}
                        <div className="h-56 w-full overflow-hidden relative bg-gray-100 dark:bg-gray-700">
                             <EditableImage 
                                imageKey={`service_img_${index}`}
                                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                                alt={service.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                             <div className="absolute bottom-4 left-4 right-4">
                                <div className={`inline-flex p-3 rounded-xl ${service.color} backdrop-blur-md bg-opacity-90 shadow-lg`}>
                                    <service.icon size={28} strokeWidth={2} />
                                </div>
                             </div>
                        </div>

                        <div className="p-8 flex-grow flex flex-col">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    </div>
                </Reveal>
            );
          })}
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default Services;
