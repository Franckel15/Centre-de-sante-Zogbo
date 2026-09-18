import React, { useState, useEffect, useRef } from 'react';
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
  const headerRef = useRef<HTMLElement>(null);

  // Chargement de l'annonce active
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const ann = await api.announcements.getActive();
        setAnnouncement(ann);
      } catch (e) {
        console.warn('Erreur chargement annonce header:', e);
      }
    };
    fetchAnnouncement();
  }, [location.pathname]);

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  }, [location.pathname]);

  // Bloquer le scroll d'arrière-plan quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Masquer le header sur l'espace d'administration
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed w-full z-50 transition-all duration-300 font-sans ${
          scrolled ? 'shadow-md dark:shadow-black/50' : ''
        } flex flex-col`}
      >
        {/* Bannière d'information administrative / alerte configurable */}
        {announcement && (
          <div
            className={`w-full px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 relative z-[51] ${
              announcement.type === 'alert' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            <Bell size={14} className="animate-bounce shrink-0" />
            <span>{announcement.message}</span>
          </div>
        )}

        {/* Top Bar - Contact & Coordonnées Utiles */}
        <div
          className={`bg-teal-900 dark:bg-black text-teal-50 text-xs transition-all duration-300 overflow-hidden ${
            scrolled ? 'h-0 opacity-0 py-0 border-none' : 'h-auto py-2 border-b border-teal-800 dark:border-gray-800'
          } hidden lg:block`}
        >
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 2xl:px-8 flex justify-between items-center h-full">
            <div className="flex gap-8">
              <a
                href={`tel:${CONTACT_INFO.phoneRaw}`}
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                title="Appeler les urgences du centre"
              >
                <Phone size={14} className="text-teal-400" />
                <span>Urgences & Soins :</span>
                <span className="font-bold underline">{CONTACT_INFO.phone}</span>
              </a>
              <span className="flex items-center gap-2 text-teal-200/90 whitespace-nowrap">
                <MapPin size={14} className="text-teal-400" /> {CONTACT_INFO.address}
              </span>
            </div>
            <div className="flex gap-6">
              <span className="flex items-center gap-2 font-medium bg-teal-800/60 dark:bg-gray-800 px-3 py-0.5 rounded-full whitespace-nowrap">
                <Clock size={14} className="text-teal-400" /> Ouvert 24h/24 - 7j/7
              </span>
            </div>
          </div>
        </div>

        {/* Barre de navigation principale */}
        <div
          className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${
            scrolled ? 'py-1.5 sm:py-2' : 'py-2.5 sm:py-3'
          }`}
        >
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 2xl:px-8">
            <div className="flex justify-between items-center gap-2 xl:gap-4 w-full">
              {/* Logo */}
              <Link
                to="/"
                id="header-logo"
                className="flex-shrink-0 flex items-center gap-2 sm:gap-2.5 group z-50 mr-2 sm:mr-4 2xl:mr-6"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div
                  className={`bg-teal-600 text-white shadow-md group-hover:bg-teal-700 transition-all duration-300 flex items-center justify-center rounded-xl ${
                    scrolled ? 'p-1.5' : 'p-2'
                  }`}
                >
                  <HeartPulse
                    size={scrolled ? 18 : 22}
                    className="sm:w-6 sm:h-6"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-bold text-gray-900 dark:text-white leading-none tracking-tight transition-all duration-300 whitespace-nowrap ${
                      scrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                    }`}
                  >
                    Centre de Santé
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-teal-600 dark:text-teal-400 font-bold tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap">
                    De Zogbo
                  </span>
                </div>
              </Link>

              {/* Liens de navigation Desktop */}
              <nav className="hidden xl:flex items-center justify-center gap-1 xl:gap-1.5 2xl:gap-3.5 flex-shrink min-w-0" aria-label="Menu principal">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs 2xl:text-sm font-semibold transition-all duration-200 relative group whitespace-nowrap ${
                        isActive
                          ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 font-bold'
                          : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full animate-in zoom-in duration-200" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions Droite */}
              <div className="flex items-center gap-1.5 sm:gap-2 z-50 flex-shrink-0 ml-auto xl:ml-0">
                {/* Thème clair / sombre */}
                <button
                  id="header-theme-toggle"
                  onClick={toggleTheme}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors shrink-0"
                  aria-label="Basculer le mode sombre ou clair"
                >
                  {theme === 'light' ? (
                    <Moon size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Sun size={18} className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>

                {/* Bouton RDV Desktop - Format compact & parfaitement visible */}
                <Link
                  to="/appointment"
                  id="header-btn-appointment"
                  className={`hidden sm:inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-full font-semibold shadow-xs hover:shadow-md hover:shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0 ${
                    scrolled ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm'
                  }`}
                  title="Prendre un rendez-vous en ligne"
                >
                  <CalendarCheck size={16} className="shrink-0" />
                  <span>Prendre RDV</span>
                </Link>

                {/* Hamburger Mobile */}
                <div className="xl:hidden flex items-center">
                  <button
                    id="header-mobile-menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 p-1.5 sm:p-2 focus:outline-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? <X size={24} className="sm:w-6 sm:h-6" /> : <Menu size={24} className="sm:w-6 sm:h-6" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Déroulant Mobile (ancré sous le header) */}
        <div
          className={`absolute left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-300 ease-in-out max-h-[calc(100vh-80px)] overflow-y-auto xl:hidden ${
            isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-6 opacity-0 invisible pointer-events-none'
          }`}
          style={{ top: '100%' }}
        >
          <div className="flex flex-col p-4 pb-8 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 sm:py-4 text-base font-bold rounded-xl transition-all ${
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
                <CalendarCheck size={22} /> Prendre Rendez-vous
              </Link>
              <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-500 dark:text-gray-400 pb-2">
                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 w-full justify-center text-teal-700 dark:text-teal-300 font-semibold"
                >
                  <Phone size={16} className="text-teal-600 dark:text-teal-400" /> {CONTACT_INFO.phone}
                </a>
                <span className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-full justify-center text-center text-xs">
                  <MapPin size={16} className="text-teal-600 dark:text-teal-400 shrink-0" /> {CONTACT_INFO.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop sombre mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 xl:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          style={{ top: headerRef.current?.offsetHeight || 80 }}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Header;
