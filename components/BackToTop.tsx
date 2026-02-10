
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Afficher le bouton après 300px de scroll
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-75 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="bg-teal-600 hover:bg-teal-700 text-white p-3.5 rounded-full shadow-xl hover:shadow-teal-500/40 transition-all group active:scale-90"
        aria-label="Retour en haut de la page"
      >
        <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default BackToTop;
