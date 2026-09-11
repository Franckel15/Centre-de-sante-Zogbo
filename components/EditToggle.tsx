import React from 'react';
import { Pencil, X, Loader2, Check, Cloud, WifiOff } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import { useLocation } from 'react-router-dom';

const EditToggle: React.FC = () => {
  const { isEditMode, isAuthenticated, hasUnsavedChanges, isOffline, toggleEditMode } = useEdit();
  const location = useLocation();

  // Si l'utilisateur n'est pas authentifié comme administrateur, ne RIEN afficher
  if (!isAuthenticated) {
    return null;
  }

  // Déterminer la position en fonction de la page (Admin = Droite, Site Public = Gauche)
  const isAdminPage = location.pathname.toLowerCase().includes('admin');
  const positionClass = isAdminPage ? 'bottom-8 right-8 items-end' : 'bottom-6 left-6 items-start';

  return (
    <div className={`fixed z-[100] flex flex-col gap-4 font-sans ${positionClass} transition-all duration-300`}>
      {/* Toggle Button */}
      <button
        onClick={toggleEditMode}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 relative ${
          isEditMode 
            ? 'bg-gray-800 border-teal-500 text-white ring-2 ring-teal-400/50' 
            : 'bg-gray-900 border-gray-700 text-white hover:bg-black'
        }`}
        title={isEditMode ? "Quitter le mode édition" : "Activer le mode édition visuelle (Admin)"}
      >
        {isOffline && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" title="Base de données inaccessible"></div>
        )}
        
        {isEditMode ? (
          <>
            <X size={20} strokeWidth={2.5} />
            <span className="font-bold text-sm">Fermer l'édition</span>
          </>
        ) : (
          <>
            <Pencil size={18} />
            <span className="font-bold text-sm">Mode Édition (Admin)</span>
          </>
        )}
      </button>

      {/* Status Indicators (Only in edit mode) */}
      {isEditMode && (
        <div className={`flex flex-col gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300 ${isAdminPage ? 'items-end' : 'items-start'}`}>
          {/* STATUS BADGE */}
          {isOffline ? (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
              <WifiOff size={14} /> 
              <span>Mode Hors Ligne</span>
            </div>
          ) : hasUnsavedChanges ? (
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
              <Loader2 size={14} className="animate-spin" />
              <span>Envoi vers Supabase...</span>
            </div>
          ) : (
            <div className="bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
              <Check size={14} /> 
              <span className="flex items-center gap-1"><Cloud size={12}/> Synchronisé</span>
            </div>
          )}
          
          <div className="mt-1 bg-gray-900/95 backdrop-blur text-white p-4 rounded-xl text-xs max-w-[240px] shadow-xl border border-gray-700">
            <p className="font-bold mb-2 text-teal-400 border-b border-gray-700 pb-1">Mode Édition Admin</p>
            {isOffline ? (
              <p className="text-gray-300">
                La base de données est inaccessible. L'édition et la sauvegarde sont désactivées.
              </p>
            ) : (
              <ol className="list-decimal list-inside space-y-1 text-gray-300">
                <li>Survolez et cliquez sur une image.</li>
                <li>Choisissez votre nouveau fichier.</li>
                <li>L'image est <strong>sauvegardée en direct</strong> sur Supabase.</li>
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditToggle;
