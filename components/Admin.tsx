import React, { useState, useEffect } from 'react';
import { api, BlogPost, Appointment, ContactMessage, GalleryImage, AudioResource, VideoResource, Announcement } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { AdminAppointments } from './admin/AdminAppointments';
import { AdminBlog } from './admin/AdminBlog';
import { AdminGallery } from './admin/AdminGallery';
import { AdminAudios } from './admin/AdminAudios';
import { AdminVideos } from './admin/AdminVideos';
import { AdminMessages } from './admin/AdminMessages';
import { AdminAnnouncement } from './admin/AdminAnnouncement';
import { ConfirmModal, AlertModal } from './admin/AdminModals';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Active view
  const [activeTab, setActiveTab] = useState<AdminTab>('blog');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [audios, setAudios] = useState<AudioResource[]>([]);
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const [loading, setLoading] = useState(false);

  // Modals state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Check auth session on mount
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await api.auth.getSession();
        if (mounted) {
          setIsAuthenticated(!!session);
          setIsAuthChecking(false);
          if (session) {
            loadDashboardData();
          }
        }
      } catch (err) {
        console.error("Erreur vérification session admin:", err);
        if (mounted) {
          setIsAuthenticated(false);
          setIsAuthChecking(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = api.auth.onAuthStateChange((_event: any, session: any) => {
      if (mounted) {
        setIsAuthenticated(!!session);
        if (session) {
          loadDashboardData();
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [p, a, m, g, aud, v, ann] = await Promise.allSettled([
        api.blog.getAll(),
        api.appointments.getAll(),
        api.contact.getAll(),
        api.gallery.getAll(),
        api.audios.getAll(),
        api.videos.getAll(),
        api.announcements.getSettings()
      ]);

      if (p.status === 'fulfilled') setPosts(p.value);
      if (a.status === 'fulfilled') setAppointments(a.value);
      if (m.status === 'fulfilled') setMessages(m.value);
      if (g.status === 'fulfilled') setGalleryImages(g.value);
      if (aud.status === 'fulfilled') setAudios(aud.value);
      if (v.status === 'fulfilled') setVideos(v.value);
      if (ann.status === 'fulfilled') setAnnouncement(ann.value);
    } catch (error) {
      console.error("Erreur chargement dashboard admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.auth.signOut();
    setIsAuthenticated(false);
    navigate('/');
  };

  // --- ACTIONS ---

  // Blog
  const handleSavePost = async (meta: { id?: number; title: string; excerpt: string; service?: string }, file?: File) => {
    try {
      if (meta.id) {
        await api.blog.update(meta.id, meta, file);
        setAlertModal({ isOpen: true, type: 'success', title: 'Succès', message: "L'article a été mis à jour avec succès." });
      } else if (file) {
        await api.blog.create(meta, file);
        setAlertModal({ isOpen: true, type: 'success', title: 'Succès', message: "Le nouvel article a été publié avec succès." });
      }
      const updated = await api.blog.getAll();
      setPosts(updated);
    } catch (err: any) {
      console.error("Erreur sauvegarde blog:", err);
      setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Impossible de sauvegarder l'article." });
    }
  };

  const handleDeletePost = (id: number, image?: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer cet article ?",
      message: "Cette action est irréversible et retirera immédiatement l'article du site public.",
      onConfirm: async () => {
        try {
          await api.blog.delete(id, image);
          setPosts(prev => prev.filter(p => p.id !== id));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          console.error("Erreur suppression article:", err);
          setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de la suppression." });
        }
      }
    });
  };

  // Appointments
  const handleUpdateAppointmentStatus = async (id: number, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await api.appointments.updateStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err: any) {
      console.error("Erreur mise à jour RDV:", err);
      setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur de mise à jour du statut." });
    }
  };

  const handleDeleteAppointment = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer ce rendez-vous ?",
      message: "Cette action supprimera définitivement le dossier du rendez-vous.",
      onConfirm: async () => {
        try {
          await api.appointments.delete(id);
          setAppointments(prev => prev.filter(a => a.id !== id));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          console.error("Erreur suppression RDV:", err);
          setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de la suppression." });
        }
      }
    });
  };

  // Messages
  const handleDeleteMessage = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer ce message ?",
      message: "Ce message sera définitivement effacé de la boîte de réception.",
      onConfirm: async () => {
        try {
          await api.contact.delete(id);
          setMessages(prev => prev.filter(m => m.id !== id));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          console.error("Erreur suppression message:", err);
          setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de la suppression." });
        }
      }
    });
  };

  // Gallery
  const handleUploadGallery = async (meta: { caption: string; category: string }, file: File) => {
    try {
      await api.gallery.create(meta, file);
      const updated = await api.gallery.getAll();
      setGalleryImages(updated);
      setAlertModal({ isOpen: true, type: 'success', title: 'Succès', message: "Photo ajoutée à la galerie avec succès." });
    } catch (err: any) {
      console.error("Erreur upload photo:", err);
      setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de l'upload de la photo." });
    }
  };

  const handleDeleteGallery = (id: number, url: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer cette photo ?",
      message: "La photo sera définitivement supprimée de la galerie et du stockage.",
      onConfirm: async () => {
        try {
          await api.gallery.delete(id, url);
          setGalleryImages(prev => prev.filter(g => g.id !== id));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          console.error("Erreur suppression photo:", err);
          setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de la suppression." });
        }
      }
    });
  };

  // Audios
  const handleUploadAudio = async (meta: { title: string; serviceName: string; description?: string }, file: File) => {
    try {
      await api.audios.create(meta, file);
      const updated = await api.audios.getAll();
      setAudios(updated);
      setAlertModal({ isOpen: true, type: 'success', title: 'Succès', message: "Conseil audio mis en ligne avec succès." });
    } catch (err: any) {
      console.error("Erreur upload audio:", err);
      setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de l'upload du fichier audio." });
    }
  };

  const handleDeleteAudio = (id: number, url: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer cet enregistrement audio ?",
      message: "Le fichier audio sera retiré du site public.",
      onConfirm: async () => {
        try {
          await api.audios.delete(id, url);
          setAudios(prev => prev.filter(a => a.id !== id));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          console.error("Erreur suppression audio:", err);
          setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de la suppression." });
        }
      }
    });
  };

  // Videos
  const handleUploadVideo = async (meta: { title: string; category?: string }, file: File) => {
    try {
      await api.videos.create(meta, file);
      const updated = await api.videos.getAll();
      setVideos(updated);
      setAlertModal({ isOpen: true, type: 'success', title: 'Succès', message: "Capsule vidéo mise en ligne avec succès." });
    } catch (err: any) {
      console.error("Erreur upload vidéo:", err);
      setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de l'upload de la vidéo." });
    }
  };

  const handleDeleteVideo = (id: number, url: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer cette vidéo ?",
      message: "La vidéo sera définitivement retirée.",
      onConfirm: async () => {
        try {
          await api.videos.delete(id, url);
          setVideos(prev => prev.filter(v => v.id !== id));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          console.error("Erreur suppression vidéo:", err);
          setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Erreur lors de la suppression." });
        }
      }
    });
  };

  // Announcement
  const handleSaveAnnouncement = async (message: string, type: 'alert' | 'info', active: boolean) => {
    try {
      await api.announcements.update(message, type, active);
      setAnnouncement({ id: 1, message, type, active });
    } catch (err: any) {
      console.error("Erreur mise à jour bannière:", err);
      setAlertModal({ isOpen: true, type: 'error', title: 'Erreur', message: err.message || "Impossible d'enregistrer la bannière." });
    }
  };

  // Loading state
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-teal-400" size={32} />
      </div>
    );
  }

  // Not authenticated -> Show Login form directly
  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row transition-colors">
      {/* Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={handleLogout}
        onGoToSite={() => navigate('/')}
        counts={{
          appointments: appointments.filter(a => a.status === 'pending').length,
          messages: messages.length
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white capitalize">
              {activeTab === 'blog' && 'Gestion des Actualités & Articles'}
              {activeTab === 'appointments' && 'Gestion des Rendez-vous'}
              {activeTab === 'messages' && 'Boîte de Réception'}
              {activeTab === 'gallery' && 'Galerie Photos'}
              {activeTab === 'audio' && 'Audios & Conseils Médicaux'}
              {activeTab === 'video' && 'Vidéos Thématiques'}
              {activeTab === 'announcement' && 'Bannière d\'Alerte du Site'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tableau de bord d'administration du Centre de Santé de Zogbo
            </p>
          </div>
          {loading && <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={20} />}
        </div>

        {/* Tab Views */}
        {activeTab === 'blog' && (
          <AdminBlog
            posts={posts}
            onSave={handleSavePost}
            onDelete={handleDeletePost}
            isLoading={loading}
          />
        )}

        {activeTab === 'appointments' && (
          <AdminAppointments
            appointments={appointments}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onDelete={handleDeleteAppointment}
          />
        )}

        {activeTab === 'messages' && (
          <AdminMessages
            messages={messages}
            onDelete={handleDeleteMessage}
          />
        )}

        {activeTab === 'gallery' && (
          <AdminGallery
            images={galleryImages}
            onUpload={handleUploadGallery}
            onDelete={handleDeleteGallery}
            isLoading={loading}
          />
        )}

        {activeTab === 'audio' && (
          <AdminAudios
            audios={audios}
            onUpload={handleUploadAudio}
            onDelete={handleDeleteAudio}
            isLoading={loading}
          />
        )}

        {activeTab === 'video' && (
          <AdminVideos
            videos={videos}
            onUpload={handleUploadVideo}
            onDelete={handleDeleteVideo}
            isLoading={loading}
          />
        )}

        {activeTab === 'announcement' && (
          <AdminAnnouncement
            announcement={announcement}
            onSave={handleSaveAnnouncement}
            isLoading={loading}
          />
        )}
      </main>
    </div>
  );
};

export default Admin;
