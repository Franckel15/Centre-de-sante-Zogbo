
import React, { useEffect, useState } from 'react';
import { Pencil, X, Loader2, Check, Cloud, WifiOff } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import { api } from '../services/api';
import { useLocation } from 'react-router-dom';

const EditToggle: React.FC = () => {
  const { isEditMode, hasUnsavedChanges, isOffline, toggleEditMode } = useEdit();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    api.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // Écouter les changements d'état (connexion/déconnexion)
    const { data: { subscription } } = api.auth.onAuthStateChange((_event: any, session: any) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Si on charge ou si l'utilisateur n'est pas connecté, on ne montre rien.
  if (loading || !isAuthenticated) {
    return null;
  }

  // Déterminer la position en fonction de la page (Admin = Droite, Site Public = Gauche)
  const isAdminPage = location.pathname === '/admin';
  const positionClass = isAdminPage ? 'bottom-8 right-8 items-end' : 'bottom-6 left-6 items-start';

  return (
    <div className={`fixed z-[100] flex flex-col gap-4 font-sans ${positionClass}`}>
        {/* Toggle Button */}
        <button
            onClick={toggleEditMode}
            className={`flex items-center gap-3 px-5 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 relative ${
            isEditMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-gray-900 border-gray-700 text-white hover:bg-black'
            }`}
            title={isEditMode ? "Quitter le mode édition" : "Activer le mode édition visuelle"}
        >
            {isOffline && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" title="Base de données inaccessible"></div>
            )}
            
            {isEditMode ? (
                <>
                    <X size={24} strokeWidth={3} />
                    <span className="font-bold">Fermer</span>
                </>
            ) : (
                <>
                    <Pencil size={20} />
                    <span className="font-bold">Modifier le site</span>
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
                     <div className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
                        <Check size={14} /> 
                        <span className="flex items-center gap-1"><Cloud size={10}/> Synchronisé</span>
                     </div>
                )}
                
                <div className="mt-2 bg-gray-900/90 backdrop-blur text-white p-4 rounded-xl text-xs max-w-[220px] shadow-xl border border-gray-700">
                    <p className="font-bold mb-2 text-teal-400 border-b border-gray-700 pb-1">Mode Édition</p>
                    {isOffline ? (
                        <p className="text-gray-300">
                            La base de données est inaccessible (projet en pause ?). L'édition et la sauvegarde sont désactivées.
                        </p>
                    ) : (
                        <ol className="list-decimal list-inside space-y-1 text-gray-300">
                            <li>Cliquez sur une image.</li>
                            <li>Sélectionnez votre fichier.</li>
                            <li>L'image est <strong>sauvegardée automatiquement</strong> dans la base de données.</li>
                        </ol>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default EditToggle;
