import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface EditContextType {
  isEditMode: boolean;
  isInitialized: boolean;
  hasUnsavedChanges: boolean;
  isOffline: boolean;
  toggleEditMode: () => void;
  getImage: (key: string, defaultSrc: string) => string;
  updateImage: (key: string, file: File) => Promise<void>;
  saveChanges: () => Promise<void>;
  resetImages: () => void;
}

// Valeur par défaut pour éviter crash si le contexte est mal monté
const defaultContext: EditContextType = {
    isEditMode: false,
    isInitialized: false,
    hasUnsavedChanges: false,
    isOffline: false,
    toggleEditMode: () => {},
    getImage: (_, src) => src,
    updateImage: async () => {},
    saveChanges: async () => {},
    resetImages: () => {}
};

const EditContext = createContext<EditContextType>(defaultContext);

const LOCAL_STORAGE_KEY = 'site_custom_images_v1';

export const EditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [savedImages, setSavedImages] = useState<Record<string, string>>({});

  // 1. Initialisation sûre (LocalStorage)
  useEffect(() => {
    try {
        // Vérification défensive de window et localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
            const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (cached) {
                setSavedImages(JSON.parse(cached));
            }
        }
    } catch (e) {
        // On ignore silencieusement les erreurs de localStorage pour ne pas bloquer l'app
        console.warn("Storage warning:", e);
    }
  }, []);

  // 2. Initialisation Réseau (Supabase)
  useEffect(() => {
    let mounted = true;

    const fetchRemote = async () => {
        try {
            const remoteImages = await api.siteImages.getAll();
            if (mounted && remoteImages && Object.keys(remoteImages).length > 0) {
                setSavedImages(prev => {
                    const newState = { ...prev, ...remoteImages };
                    // Sauvegarde si possible
                    try {
                        if (typeof window !== 'undefined' && window.localStorage) {
                            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
                        }
                    } catch (e) {}
                    return newState;
                });
                setIsOffline(false);
            }
        } catch (e) {
            if (mounted) setIsOffline(true);
        } finally {
            if (mounted) setIsInitialized(true);
        }
    };

    fetchRemote();

    return () => { mounted = false; };
  }, []);

  const toggleEditMode = () => setIsEditMode(prev => !prev);

  const getImage = (key: string, defaultSrc: string) => {
    return (savedImages && savedImages[key]) ? savedImages[key] : defaultSrc;
  };

  const updateImage = async (key: string, file: File): Promise<void> => {
    if (!file) return;
    try {
        setHasUnsavedChanges(true);
        const publicUrl = await api.siteImages.upload(key, file);
        
        setSavedImages(prev => {
            const newState = { ...prev, [key]: publicUrl };
            try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState)); } catch (e) {}
            return newState;
        });
        setIsOffline(false);
    } catch (e) {
        console.error(e);
        alert("Erreur de sauvegarde. Vérifiez votre connexion.");
        throw e;
    } finally {
        setHasUnsavedChanges(false);
    }
  };

  const saveChanges = async () => Promise.resolve();
  
  const resetImages = () => {
      try {
          if (confirm("Réinitialiser les images locales ?")) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            window.location.reload();
          }
      } catch (e) {}
  };

  return (
    <EditContext.Provider value={{ 
        isEditMode, isInitialized, hasUnsavedChanges, isOffline, 
        toggleEditMode, getImage, updateImage, saveChanges, resetImages 
    }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => {
  const context = useContext(EditContext);
  return context || defaultContext;
};