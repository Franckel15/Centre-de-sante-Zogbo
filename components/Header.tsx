
import React, { useState, useEffect } from 'react';
import { Menu, X, HeartPulse, Phone, Clock, MapPin, CalendarCheck, Moon, Sun, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, CONTACT_INFO } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { api, Announcement } from '../services/api';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Chargement de la bannière
  useEffect(() => {
    const fetchAnnouncement = async () => {
      const ann = await api.announcements.getActive();
      setAnnouncement(ann);
    };
    fetchAnnouncement();
  }, [location.pathname]); // Rafraichir si on change de page (ex: retour de l'admin)

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
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
  if (location.pathname.includes('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 font-sans ${scrolled ? 'shadow-md dark:shadow-black/50' : ''} flex flex-col`}>
        
        {/* BANNIÈRE D'ANNONCE (Intégrée au Header Fixe) */}
        {announcement && (
            <div className={`w-full px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 relative z-[51] ${
                announcement.type === 'alert' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
            }`}>
                <Bell size={14} className="animate-bounce shrink-0" />
                <span>{announcement.message}</span>
            </div>
        )}

        {/* Top Bar - Informations Rapides */}
        <div className={`bg-teal-900 dark:bg-black text-teal-50 text-xs transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0 py-0 border-none' : 'h-auto py-2 border-b border-teal-800 dark:border-gray-800'} hidden lg:block`}>
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center h-full">
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

        {/* Navigation Principale */}
        <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3 sm:py-4'}`}>
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex justify-between items-center gap-2">
              
              {/* Logo (Gauche) */}
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-3 group z-50 mr-auto sm:mr-8" onClick={() => window.scrollTo(0,0)}>
                <div className={`bg-teal-600 text-white shadow-lg group-hover:bg-teal-700 transition-all duration-300 flex items-center justify-center rounded-xl ${scrolled ? 'p-1.5 sm:p-2' : 'p-2 sm:p-2.5'}`}>
                  <HeartPulse size={scrolled ? 20 : 24} className="sm:w-[30px] sm:h-[30px]" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <h1 className={`font-bold text-gray-900 dark:text-white leading-none tracking-tight transition-all duration-300 whitespace-nowrap ${scrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>
                    Centre de Santé
                  </h1>
                  <span className="text-[9px] sm:text-[10px] text-teal-600 dark:text-teal-400 font-bold tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap">De Zogbo</span>
                </div>
              </Link>

              {/* Desktop Navigation (Centre) */}
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
              <div className="flex items-center gap-2 sm:gap-3 z-50 flex-shrink-0">
                
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                    aria-label="Changer le thème"
                >
                    {theme === 'light' ? <Moon size={20} className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sun size={20} className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />}
                </button>

                {/* CTA Button (Desktop) */}
                <Link 
                  to="/appointment" 
                  className={`hidden sm:flex items-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap ${scrolled ? 'px-3 py-1.5 text-xs sm:text-sm' : 'px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base'}`}
                >
                    <CalendarCheck size={18} />
                    <span>Prendre RDV</span>
                </Link>

                {/* Mobile Menu Button */}
                <div className="xl:hidden flex items-center">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 p-2 focus:outline-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Menu"
                  >
                    {isOpen ? <X size={26} className="sm:w-8 sm:h-8" /> : <Menu size={26} className="sm:w-8 sm:h-8" />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Overlay Mobile Menu - Utilise top-full pour se coller sous le header, quelle que soit sa taille */}
      <div 
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm dark:bg-black/70" onClick={() => setIsOpen(false)} />
          
          {/* Menu Content - top-full relative to fixed header? No, fixed header is outside flow of relative parents usually.
              We need a different strategy for mobile menu top position if header height varies.
              Actually, simply putting it fixed with top-[variable] is hard.
              The easiest way is to put the menu inside the header logic visually or use high top padding.
          */}
          <div className={`fixed left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-out max-h-[80vh] overflow-y-auto ${
             isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
             style={{ top: 'var(--header-height, 100px)' }} // Fallback handled by JS or CSS if possible, but let's use a simpler approach:
          >
             {/* Note: Since Header is fixed, we can't easily rely on flow. 
                 We will use a standard top offset but add a margin. 
                 Or better: render this div directly inside the <header> JSX but absolute positioned relative to header?
             */}
          </div>
            {/* CORRECTION: Rendering the menu RELATIVE to the header container which is fixed is safer. */}
      </div>
      
      {/* 
         RE-IMPLEMENTATION DU MENU MOBILE POUR QU'IL SOIT DANS LE FLUX DU HEADER 
         Cela permet d'utiliser "top: 100%" pour qu'il soit toujours collé en bas du header.
      */}
      <div 
         className={`fixed inset-x-0 top-0 z-30 h-screen bg-gray-900/60 backdrop-blur-sm xl:hidden transition-opacity duration-300 ${
             isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
         }`}
         onClick={() => setIsOpen(false)}
      ></div>

      <div className={`fixed inset-x-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 shadow-2xl transition-all duration-300 xl:hidden flex flex-col overflow-y-auto max-h-[85vh] ${
          isOpen ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
      // Important: On laisse le navigateur calculer la position top par rapport au header via JS ou on le met en absolue dans le header.
      // Pour faire simple ici sans refonte totale du layout : on va utiliser un marginTop dynamique ou le rendre DANS le header.
      style={{ top: '0', marginTop: announcement ? (scrolled ? '110px' : '150px') : (scrolled ? '70px' : '110px') }} 
      // Cette méthode est approximative. La meilleure méthode est de déplacer ce bloc DANS la balise <header> juste avant la fermeture.
      >
           {/* Ce bloc est supprimé ici et déplacé DANS le return du Header ci-dessous */}
      </div>
    </>
  );
};

// VRAI COMPOSANT MODIFIE
const HeaderFixed: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const headerRef = React.useRef<HTMLHeadElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
  
    useEffect(() => {
      const fetchAnnouncement = async () => {
        const ann = await api.announcements.getActive();
        setAnnouncement(ann);
      };
      fetchAnnouncement();
    }, [location.pathname]);
  
    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mesurer la hauteur du header pour positionner le menu mobile
    useEffect(() => {
        if(headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [announcement, scrolled]);
  
    useEffect(() => {
      setIsOpen(false);
      document.body.style.overflow = 'auto';
    }, [location]);
  
    if (location.pathname.includes('/admin')) return null;
  
    return (
      <>
        <header ref={headerRef} className={`fixed w-full z-50 transition-all duration-300 font-sans ${scrolled ? 'shadow-md dark:shadow-black/50' : ''} flex flex-col`}>
          
          {announcement && (
              <div className={`w-full px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 relative z-[51] ${
                  announcement.type === 'alert' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                  <Bell size={14} className="animate-bounce shrink-0" />
                  <span>{announcement.message}</span>
              </div>
          )}
  
          <div className={`bg-teal-900 dark:bg-black text-teal-50 text-xs transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0 py-0 border-none' : 'h-auto py-2 border-b border-teal-800 dark:border-gray-800'} hidden lg:block`}>
            <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center h-full">
              <div className="flex gap-8">
                 <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default whitespace-nowrap"><Phone size={14} className="text-teal-400" /> Urgences : <span className="font-bold">{CONTACT_INFO.phone}</span></span>
                 <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default whitespace-nowrap"><MapPin size={14} className="text-teal-400" /> {CONTACT_INFO.address}</span>
              </div>
              <div className="flex gap-6">
                 <span className="flex items-center gap-2 font-medium bg-teal-800/50 dark:bg-gray-800 px-3 py-0.5 rounded-full whitespace-nowrap"><Clock size={14} className="text-teal-400" /> Ouvert 24h/24 - 7j/7</span>
              </div>
            </div>
          </div>
  
          <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3 sm:py-4'}`}>
            <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex justify-between items-center gap-2">
                <Link to="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-3 group z-50 mr-auto sm:mr-8" onClick={() => window.scrollTo(0,0)}>
                  <div className={`bg-teal-600 text-white shadow-lg group-hover:bg-teal-700 transition-all duration-300 flex items-center justify-center rounded-xl ${scrolled ? 'p-1.5 sm:p-2' : 'p-2 sm:p-2.5'}`}><HeartPulse size={scrolled ? 20 : 24} className="sm:w-[30px] sm:h-[30px]" strokeWidth={2.5} /></div>
                  <div className="flex flex-col">
                    <h1 className={`font-bold text-gray-900 dark:text-white leading-none tracking-tight transition-all duration-300 whitespace-nowrap ${scrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>Centre de Santé</h1>
                    <span className="text-[9px] sm:text-[10px] text-teal-600 dark:text-teal-400 font-bold tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap">De Zogbo</span>
                  </div>
                </Link>
  
                <nav className="hidden xl:flex items-center gap-4 2xl:gap-8">
                  {NAV_LINKS.map((link) => {
                    const isActive = link.href === '/' ? location.pathname === '/' : location.pathname.startsWith(link.href);
                    return (
                      <Link key={link.name} to={link.href} className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative group whitespace-nowrap ${isActive ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        {link.name}
                        {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full animate-in zoom-in duration-200"></span>}
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="flex items-center gap-2 sm:gap-3 z-50 flex-shrink-0">
                  <button onClick={toggleTheme} className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                      {theme === 'light' ? <Moon size={20} className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sun size={20} className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                  <Link to="/appointment" className={`hidden sm:flex items-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap ${scrolled ? 'px-3 py-1.5 text-xs sm:text-sm' : 'px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base'}`}>
                      <CalendarCheck size={18} /><span>Prendre RDV</span>
                  </Link>
                  <div className="xl:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 p-2 focus:outline-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      {isOpen ? <X size={26} className="sm:w-8 sm:h-8" /> : <Menu size={26} className="sm:w-8 sm:h-8" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MENU MOBILE DANS LE HEADER POUR POSITIONNEMENT ABSOLU SIMPLE */}
          <div className={`absolute left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-300 ease-in-out max-h-[calc(100vh-100px)] overflow-y-auto xl:hidden ${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}
               style={{ top: '100%' }} // Toujours collé à 100% de la hauteur du header
          >
             <div className="flex flex-col p-4 pb-8 space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = link.href === '/' ? location.pathname === '/' : location.pathname.startsWith(link.href);
                  return (
                    <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className={`flex items-center justify-between px-4 py-3 sm:py-4 text-base font-bold rounded-xl transition-all ${isActive ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-gray-800/80 border border-teal-100 dark:border-gray-700 pl-6' : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                      {link.name}
                    </Link>
                  );
                })}
                 <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
                   <Link to="/appointment" onClick={() => setIsOpen(false)} className="w-full flex justify-center items-center gap-2 bg-teal-600 dark:bg-teal-500 text-white px-4 py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform text-lg">
                      <CalendarCheck size={22} /> Prendre Rendez-vous
                   </Link>
                   <div className="mt-8 flex flex-col items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-4">
                      <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-full justify-center"><Phone size={16} className="text-teal-600 dark:text-teal-400"/> {CONTACT_INFO.phone}</a>
                      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-full justify-center text-center"><MapPin size={16} className="text-teal-600 dark:text-teal-400 shrink-0"/> {CONTACT_INFO.address}</a>
                   </div>
                 </div>
              </div>
          </div>
        </header>
        
        {/* Backdrop pour le mobile */}
        {isOpen && <div className="fixed inset-0 bg-black/60 z-40 xl:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} style={{ top: headerRef.current?.offsetHeight || 80 }}></div>}
      </>
    );
  };
  
  export default HeaderFixed;
