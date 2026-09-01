import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { supabase } from '../services/supabaseClient';

interface EditContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  hasUnsavedChanges: boolean;
  isOffline: boolean;
  toggleEditMode: () => void;
  getImage: (key: string, defaultSrc: string) => string;
  updateImage: (key: string, file: File) => Promise<void>;
  saveChanges: () => Promise<void>;
  resetImages: () => void;
}

const defaultContext: EditContextType = {
  isEditMode: false,
  isAuthenticated: false,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [savedImages, setSavedImages] = useState<Record<string, string>>({});

  // 1. Écouter la session d'authentification Supabase réelle
  useEffect(() => {
    let isMounted = true;

    api.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        const authed = !!session;
        setIsAuthenticated(authed);
        if (!authed) {
          setIsEditMode(false); // Désactive systématiquement le mode édition si non connecté
        }
      }
    }).catch(err => {
      console.error("Erreur vérification session auth:", err);
      if (isMounted) {
        setIsAuthenticated(false);
        setIsEditMode(false);
      }
    });

    const { data: { subscription } } = api.auth.onAuthStateChange((_event: any, session: any) => {
      if (isMounted) {
        const authed = !!session;
        setIsAuthenticated(authed);
        if (!authed) {
          setIsEditMode(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 2. Initialisation sûre (Cache local pour affichage rapide)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          setSavedImages(JSON.parse(cached));
        }
      }
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }, []);

  // 3. Initialisation Réseau (Supabase)
  useEffect(() => {
    let mounted = true;

    const fetchRemote = async () => {
      try {
        const remoteImages = await api.siteImages.getAll();
        if (mounted && remoteImages && Object.keys(remoteImages).length > 0) {
          setSavedImages(prev => {
            const newState = { ...prev, ...remoteImages };
            try {
              if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
              }
            } catch (e) {
              console.warn("Erreur écriture cache images:", e);
            }
            return newState;
          });
          setIsOffline(false);
        }
      } catch (e) {
        console.error("Erreur chargement images distantes:", e);
        if (mounted) setIsOffline(true);
      } finally {
        if (mounted) setIsInitialized(true);
      }
    };

    fetchRemote();

    return () => { mounted = false; };
  }, []);

  const toggleEditMode = () => {
    if (!isAuthenticated) {
      console.warn("Tentative d'activation du mode édition sans authentification admin");
      setIsEditMode(false);
      return;
    }
    setIsEditMode(prev => !prev);
  };

  const getImage = (key: string, defaultSrc: string) => {
    return (savedImages && savedImages[key]) ? savedImages[key] : defaultSrc;
  };

  const updateImage = async (key: string, file: File): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error("Action non autorisée : vous devez être connecté en tant qu'administrateur.");
    }
    if (!file) return;

    try {
      setHasUnsavedChanges(true);
      const publicUrl = await api.siteImages.upload(key, file);
      
      setSavedImages(prev => {
        const newState = { ...prev, [key]: publicUrl };
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
        } catch (e) {
          console.warn("Storage warning:", e);
        }
        return newState;
      });
      setIsOffline(false);
    } catch (e) {
      console.error("Erreur lors de la mise à jour de l'image:", e);
      throw e;
    } finally {
      setHasUnsavedChanges(false);
    }
  };

  const saveChanges = async () => Promise.resolve();
  
  const resetImages = () => {
    if (!isAuthenticated) return;
    try {
      if (confirm("Réinitialiser le cache local des images ?")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <EditContext.Provider value={{ 
      isEditMode: isEditMode && isAuthenticated, 
      isAuthenticated,
      isInitialized, 
      hasUnsavedChanges, 
      isOffline, 
      toggleEditMode, 
      getImage, 
      updateImage, 
      saveChanges, 
      resetImages 
    }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => {
  const context = useContext(EditContext);
  return context || defaultContext;
};
