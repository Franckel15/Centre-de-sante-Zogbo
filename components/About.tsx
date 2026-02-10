
import React, { useState } from 'react';
import { FACILITIES, CONTACT_INFO, SITE_IMAGES } from '../constants';
import { CheckCircle2, History, Target, Heart, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import BackToTop from './BackToTop';
import Reveal from './Reveal';
import EditableImage from './EditableImage';

const About: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
        question: "Faut-il prendre rendez-vous pour une consultation ?",
        answer: "Pour la médecine générale, nous recevons les patients avec ou sans rendez-vous. Cependant, pour éviter l'attente ou pour les consultations spécialisées (gynécologie, prénatal), nous vous recommandons vivement de prendre rendez-vous via notre site ou par téléphone."
    },
    {
        question: "Acceptez-vous les assurances maladies ?",
        answer: "Nous collaborons avec plusieurs assurances et mutuelles de santé. Nous vous invitons à vous présenter à l'accueil avec votre carte d'assurance pour vérifier votre éligibilité et la prise en charge."
    },
    {
        question: "Le centre est-il ouvert le week-end et les jours fériés ?",
        answer: "Oui, le Centre de Santé de Zogbo assure une permanence des soins. Le service des urgences, le dispensaire et la maternité sont opérationnels 24h/24 et 7j/7, y compris les week-ends et jours fériés."
    },
    {
        question: "Peut-on effectuer des analyses de laboratoire sur place ?",
        answer: "Absolument. Notre laboratoire est équipé pour réaliser la majorité des examens courants (hématologie, parasitologie, biochimie) sur place, ce qui permet d'obtenir des résultats rapides pour un meilleur diagnostic."
    },
    {
        question: "Proposez-vous des services de vaccination ?",
        answer: "Oui, nous suivons le calendrier vaccinal national pour les enfants (PEV). Des séances de vaccination sont organisées régulièrement. Nous proposons également certains vaccins pour adultes sur demande."
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
       {/* Page Header */}
       <div className="bg-teal-800 dark:bg-teal-950 text-white pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <Reveal direction="down">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Qui Sommes-Nous ?</h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-teal-100 text-xl max-w-2xl mx-auto text-center">
                    Au cœur de la communauté de Zogbo depuis {CONTACT_INFO.founded}.
                </p>
             </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Story Section */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center mb-24">
          <div className="relative mb-12 lg:mb-0">
            <Reveal width="100%">
                <div className="absolute -top-4 -left-4 w-full h-full bg-teal-100 dark:bg-teal-900/20 rounded-3xl transform -rotate-2 z-0"></div>
                <EditableImage
                    imageKey="about_main"
                    src={SITE_IMAGES.about} 
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) target.src = SITE_IMAGES.placeholder;
                    }}
                    alt="Installations du centre" 
                    className="relative z-10 rounded-3xl shadow-2xl w-full h-auto object-cover transform transition-transform hover:scale-[1.01]"
                />
                <div className="absolute -bottom-8 -right-8 z-20 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-l-8 border-teal-500 hidden md:block text-center">
                    <p className="text-5xl font-black text-teal-600 dark:text-teal-400">{new Date().getFullYear() - CONTACT_INFO.founded}</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wide">Années<br/>d'Excellence</p>
                </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.2}>
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold mb-4 uppercase tracking-wider text-sm justify-center lg:justify-start">
                    <History size={18} />
                    <span>Notre Histoire</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight text-center lg:text-left">
                Un pilier de santé pour <br/><span className="text-teal-600 dark:text-teal-400">toute la famille</span>
                </h2>
                
                <div className="prose prose-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-center lg:text-left">
                <p>
                    Fondé en <strong>{CONTACT_INFO.founded}</strong>, le Centre de Santé de Zogbo a grandi avec la communauté. 
                    Notre mission a toujours été d'offrir des soins de proximité, humains et professionnels.
                </p>
                <p>
                    Situé au cœur de Cotonou, nous nous efforçons chaque jour d'améliorer la qualité de vie de nos patients grâce à une écoute attentive et une expertise médicale rigoureuse.
                </p>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <Reveal delay={0.3} width="100%">
                    <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-xl border border-teal-100 dark:border-teal-800 h-full flex flex-col items-center text-center">
                        <Target className="text-teal-600 dark:text-teal-400 mb-3" size={32} />
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Notre Mission</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Garantir l'accès à des soins de qualité pour tous les habitants de Zogbo.</p>
                    </div>
                </Reveal>
                <Reveal delay={0.4} width="100%">
                    <div className="bg-pink-50 dark:bg-pink-900/10 p-6 rounded-xl border border-pink-100 dark:border-pink-800 h-full flex flex-col items-center text-center">
                        <Heart className="text-pink-600 dark:text-pink-400 mb-3" size={32} />
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Nos Valeurs</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Bienveillance, Professionnalisme, Intégrité et Respect du patient.</p>
                    </div>
                </Reveal>
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-20">
            <div className="text-center mb-12">
                <Reveal>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Nos Installations & Équipements</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">Un plateau technique moderne pour votre sécurité.</p>
                </Reveal>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {FACILITIES.map((facility, idx) => (
                  <Reveal key={idx} delay={idx * 0.15} width="100%">
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col items-center text-center h-full">
                        <div className="p-4 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full mb-4">
                        <facility.icon size={32} />
                        </div>
                        <h5 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{facility.title}</h5>
                        <p className="text-gray-600 dark:text-gray-300">{facility.description}</p>
                      </div>
                  </Reveal>
                ))}
            </div>
        </div>
        
        {/* Why Choose Us */}
        <div className="mb-24">
             <Reveal>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Pourquoi nous choisir ?</h3>
             </Reveal>
             <div className="grid md:grid-cols-3 gap-4">
                {['Personnel qualifié et bienveillant', 'Plateau technique adapté', 'Permanence des soins 24h/24', 'Cadre propre et sécurisé', 'Tarifs accessibles', 'Suivi personnalisé'].map((item, i) => (
                   <Reveal key={i} delay={i * 0.1} width="100%">
                       <div className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm h-full text-center">
                        <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">{item}</span>
                       </div>
                   </Reveal>
                ))}
             </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <Reveal>
                    <div className="inline-flex p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 mb-4 justify-center">
                        <HelpCircle size={28} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Questions Fréquentes</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">Des réponses rapides à vos interrogations courantes.</p>
                </Reveal>
            </div>

            <div className="space-y-4">
                {FAQS.map((faq, index) => (
                    <Reveal key={index} delay={index * 0.1}>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-500 transition-colors duration-200">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                            >
                                <span className={`font-bold text-lg ${openFaq === index ? 'text-teal-700 dark:text-teal-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {faq.question}
                                </span>
                                {openFaq === index ? (
                                    <ChevronUp className="text-teal-600 dark:text-teal-400 flex-shrink-0" size={20} />
                                ) : (
                                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                                )}
                            </button>
                            <div 
                                className={`px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
                                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>

      </div>
      <BackToTop />
    </div>
  );
};

export default About;
