import React from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  CalendarClock, 
  Mail, 
  Image as ImageIcon, 
  FileAudio, 
  FileVideo, 
  Megaphone, 
  Globe, 
  LogOut, 
  X, 
  Menu 
} from 'lucide-react';

export type AdminTab = 'blog' | 'appointments' | 'messages' | 'gallery' | 'audio' | 'video' | 'announcement';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
  onGoToSite: () => void;
  counts?: {
    appointments?: number;
    messages?: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
  onGoToSite,
  counts
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.FC<any>; count?: number }[] = [
    { id: 'blog', label: 'Actualités', icon: Newspaper },
    { id: 'appointments', label: 'Rendez-vous', icon: CalendarClock, count: counts?.appointments },
    { id: 'messages', label: 'Messages', icon: Mail, count: counts?.messages },
  ];

  const mediaItems: { id: AdminTab; label: string; icon: React.FC<any> }[] = [
    { id: 'gallery', label: 'Galerie Photos', icon: ImageIcon },
    { id: 'audio', label: 'Audios Conseils', icon: FileAudio },
    { id: 'video', label: 'Vidéos', icon: FileVideo },
  ];

  const configItems: { id: AdminTab; label: string; icon: React.FC<any> }[] = [
    { id: 'announcement', label: 'Bannière Alerte', icon: Megaphone },
  ];

  return (
    <aside className="bg-gray-900 text-gray-300 w-full md:w-64 flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-50 shadow-xl transition-all">
      {/* Header Sidebar */}
      <div className="p-4 md:p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-2 rounded-xl text-white shadow-md">
            <LayoutDashboard size={20}/>
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">Admin Zogbo</h1>
            <p className="text-[11px] text-teal-400 font-medium">Panneau de gestion</p>
          </div>
        </div>
        {/* Toggle Button (Mobile Only) */}
        <button 
          className="md:hidden text-gray-400 hover:text-white p-1" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Navigation items */}
      <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 h-[calc(100vh-70px)] md:h-auto overflow-y-auto`}>
        <nav className="flex-1 p-4 space-y-1.5">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">Gestion Principale</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} 
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-md font-bold' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white text-teal-700' : 'bg-teal-900/60 text-teal-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3">Médiathèque</div>
          {mediaItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-md font-bold' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3">Configuration</div>
          {configItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-md font-bold' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 space-y-1.5 mt-auto">
          <button 
            onClick={onGoToSite} 
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Globe size={16}/> Voir le site public
          </button>
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16}/> Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
};
