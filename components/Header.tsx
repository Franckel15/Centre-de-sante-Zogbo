
import React, { useState, useEffect } from 'react';
import { Menu, X, HeartPulse, Phone, Clock, MapPin, CalendarCheck, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, CONTACT_INFO } from '../constants';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Gestion du scroll pour l'effet "sticky compact"
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de route et gérer le scroll du body
  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = 'auto'; // Reset au changement de page
  }, [location]);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // MASQUER LE HEADER SUR LA PAGE ADMIN
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 font-sans ${scrolled ? 'shadow-md dark:shadow-black/50' : ''}`}>
        
        {/* Top Bar - Informations Rapides (Fluid Width) */}
        <div className={`bg-teal-900 dark:bg-black text-teal-50 text-xs transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-10 py-2'} hidden lg:block border-b border-teal-800 dark:border-gray-800`}>
          <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-12 flex justify-between items-center h-full">
            <div className="flex gap-8">
               <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default whitespace-nowrap">
                 <Phone size={14} className="text-teal-400" /> Urgences : <span className="font-bold">{CONTACT_INFO.phone}</span>
               </span>
               <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default whitespace-nowrap">
                 <MapPin size={14} className="text-teal-400" /> {CONTACT_INFO.address}
               </span>
            </div>
            <div className="flex gap-6">
               <span className="flex items-center gap-2 font-medium bg-teal-800/50 dark:bg-gray-800 px-3 py-0.5 rounded-full whitespace-nowrap">
                 <Clock size={14} className="text-teal-400" /> Ouvert 24h/24 - 7j/7
               </span>
            </div>
          </div>
        </div>

        {/* Navigation Principale (Fluid Width) */}
        <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
          <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-center">
              
              {/* Logo (Gauche) */}
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group z-50 mr-8" onClick={() => window.scrollTo(0,0)}>
                <div className={`bg-teal-600 text-white shadow-lg group-hover:bg-teal-700 transition-all duration-300 flex items-center justify-center rounded-xl ${scrolled ? 'p-2' : 'p-2.5'}`}>
                  <HeartPulse size={scrolled ? 24 : 30} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <h1 className={`font-bold text-gray-900 dark:text-white leading-none tracking-tight transition-all duration-300 whitespace-nowrap ${scrolled ? 'text-lg' : 'text-xl'}`}>
                    Centre de Santé
                  </h1>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap">De Zogbo</span>
                </div>
              </Link>

              {/* Desktop Navigation (Centre - Espacé) */}
              <nav className="hidden xl:flex items-center gap-4 2xl:gap-8">
                {NAV_LINKS.map((link) => {
                  const isActive = link.href === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(link.href);
                  
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative group whitespace-nowrap ${
                        isActive 
                          ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full animate-in zoom-in duration-200"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Actions Right (Droite) */}
              <div className="flex items-center gap-3 z-50 ml-4">
                
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                    aria-label="Changer le thème"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
                </button>

                {/* CTA Button (Desktop) */}
                <Link 
                  to="/appointment" 
                  className={`hidden sm:flex items-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap ${scrolled ? 'px-4 py-2 text-sm' : 'px-6 py-2.5 text-base'}`}
                >
                    <CalendarCheck size={18} />
                    <span>Prendre RDV</span>
                </Link>

                {/* Mobile Menu Button */}
                <div className="xl:hidden flex items-center ml-2">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 p-2 focus:outline-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Menu"
                  >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Overlay Mobile Menu - Optimized for Mobile & Dark Mode */}
      <div 
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm dark:bg-black/70" onClick={() => setIsOpen(false)} />
          
          {/* Menu Content */}
          <div className={`absolute top-[80px] left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-out max-h-[calc(100vh-80px)] overflow-y-auto ${
             isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="flex flex-col p-4 pb-8 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center justify-between px-4 py-4 text-base font-bold rounded-xl transition-all ${
                      isActive 
                        ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-gray-800/80 border border-teal-100 dark:border-gray-700 pl-6' 
                        : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
               
               <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
                 <Link 
                    to="/appointment"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex justify-center items-center gap-2 bg-teal-600 dark:bg-teal-500 text-white px-4 py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform text-lg"
                 >
                    <CalendarCheck size={22} />
                    Prendre Rendez-vous
                 </Link>
                 
                 <div className="mt-8 flex flex-col items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-4">
                    <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-full justify-center">
                        <Phone size={16} className="text-teal-600 dark:text-teal-400"/> {CONTACT_INFO.phone}
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-full justify-center text-center">
                        <MapPin size={16} className="text-teal-600 dark:text-teal-400 shrink-0"/> {CONTACT_INFO.address}
                    </a>
                 </div>
               </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default Header;
