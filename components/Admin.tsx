
import React, { useState, useEffect } from 'react';
import { api, AudioResource, BlogPost, Appointment, VideoResource, ContactMessage, Announcement, GalleryImage } from '../services/api';
import { SERVICES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, Trash2, LogOut, FileAudio, Newspaper, FileVideo,
  AlertCircle, LayoutDashboard, Edit, Plus, X, Copy, CalendarClock, Phone, Calendar,
  CheckCircle, XCircle, Clock, AlertTriangle, Mail, Lock, KeyRound, ShieldCheck, Megaphone, Image as ImageIcon,
  User, FileText, Hash, Info, Globe, Eye, EyeOff
} from 'lucide-react';

// --- Gestion Sécurisée des Variables d'Environnement ---
const getEnv = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {}
  return fallback;
};

const ADMIN_SECRET_CODE = getEnv('VITE_ADMIN_CODE', 'ADMIN-ZOGBO');

// --- HELPERS ---
const getErrorMessage = (error: any): string => {
  if (!error) return "Une erreur inconnue est survenue";
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  
  // Gestion spécifique des erreurs Supabase (PostgrestError)
  if (typeof error === 'object') {
      if (error.message) return error.message;
      if (error.error_description) return error.error_description;
      if (error.details) return error.details;
      if (error.hint) return `${error.message || 'Erreur'} (${error.hint})`;
  }

  try {
      return JSON.stringify(error);
  } catch (e) {
      return String(error);
  }
};

// --- COMPOSANT MODAL DE CONFIRMATION ---
const ConfirmModal: React.FC<any> = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400 mb-4">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">{message}</p>
                    <div className="flex gap-3 w-full">
                        <button onClick={onCancel} disabled={isLoading} className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-colors disabled:opacity-50">Annuler</button>
                        <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-colors flex justify-center items-center disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Confirmer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANT MODAL D'ALERTE ---
const AlertModal: React.FC<any> = ({ isOpen, type, title, message, onClose }) => {
    if (!isOpen) return null;
    const colors = type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertCircle;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-xs w-full p-6 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${colors}`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 break-words">{message}</p>
                <button onClick={onClose} className="w-full bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-2.5 rounded-xl transition-colors">D'accord</button>
            </div>
        </div>
    );
};

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Secret Access State
  const [isSecretVerified, setIsSecretVerified] = useState(false);
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [secretError, setSecretError] = useState('');

  const [activeTab, setActiveTab] = useState<'blog' | 'audio' | 'appointments' | 'video' | 'messages' | 'announcement' | 'gallery'>('blog');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Data State
  const [audios, setAudios] = useState<AudioResource[]>([]);
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Other UI States
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingAudio, setEditingAudio] = useState<AudioResource | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // View States
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  // Announcement Form
  const [announcementForm, setAnnouncementForm] = useState({ message: '', type: 'info' as 'info' | 'alert', active: false });

  // Form Data
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', service: '' });
  const [blogFile, setBlogFile] = useState<File | null>(null);
  const [audioForm, setAudioForm] = useState({ title: '', service: '' });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoForm, setVideoForm] = useState({ title: '', service: '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [galleryForm, setGalleryForm] = useState({ caption: '', category: 'Locaux' });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  // Modals
  const [confirmState, setConfirmState] = useState<any>({ isOpen: false });
  const [alertState, setAlertState] = useState<any>({ isOpen: false });

  // Effects
  useEffect(() => {
    if (editingPost) setBlogForm({ title: editingPost.title, excerpt: editingPost.excerpt, service: editingPost.service || '' });
  }, [editingPost]);

  useEffect(() => {
    if (editingAudio) setAudioForm({ title: editingAudio.title, service: editingAudio.serviceName });
  }, [editingAudio]);

  useEffect(() => {
    api.auth.getSession().then(({ data: { session } }) => setIsAuthenticated(!!session));
    const { data: { subscription } } = api.auth.onAuthStateChange((_event: any, session: any) => setIsAuthenticated(!!session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
      setIsLoadingData(true);
      try {
          if (activeTab === 'appointments') setAppointments(await api.appointments.getAll());
          else if (activeTab === 'audio') setAudios(await api.audios.getAll());
          else if (activeTab === 'video') setVideos(await api.videos.getAll());
          else if (activeTab === 'messages') setMessages(await api.contact.getAll());
          else if (activeTab === 'gallery') setGalleryImages(await api.gallery.getAll());
          else if (activeTab === 'announcement') {
              const ann = await api.announcements.getSettings();
              if (ann) setAnnouncementForm({ message: ann.message, type: ann.type, active: ann.active });
          }
          else setPosts(await api.blog.getAll());
      } catch (e) { console.error(e); } finally { setIsLoadingData(false); }
  };

  const handleSecretVerify = (e: React.FormEvent) => {
      e.preventDefault();
      // On trim pour éviter les erreurs d'espace
      if (secretCodeInput.trim() === ADMIN_SECRET_CODE) {
          setIsSecretVerified(true);
          setSecretError('');
      } else {
          setSecretError("Code d'accès incorrect");
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
        const { error } = await api.auth.signIn(email, password);
        if (error) throw error;
    } catch (err: any) {
        setLoginError(getErrorMessage(err));
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await api.auth.signOut();
    setIsSecretVerified(false);
  };
  
  const handleGoToSite = () => {
      navigate('/');
  };

  // --- ACTIONS ---
  const requestDelete = (e: React.MouseEvent, id: number, type: 'blog'|'audio'|'appointment'|'video'|'message'|'gallery', file?: string) => {
    e.stopPropagation();
    setConfirmState({
        isOpen: true,
        title: "Confirmer la suppression",
        message: "Êtes-vous sûr ? Cette action est irréversible.",
        isLoading: false,
        action: async () => {
            setConfirmState((prev: any) => ({ ...prev, isLoading: true }));
            try {
                if (type === 'blog') {
                    await api.blog.delete(id, file);
                    setPosts(prev => prev.filter(p => p.id !== id));
                } else if (type === 'audio') {
                    await api.audios.delete(id, file || '');
                    setAudios(prev => prev.filter(a => a.id !== id));
                } else if (type === 'video') {
                    await api.videos.delete(id, file || '');
                    setVideos(prev => prev.filter(v => v.id !== id));
                } else if (type === 'appointment') {
                    await api.appointments.delete(id);
                    setAppointments(prev => prev.filter(a => a.id !== id));
                    if(viewingAppointment?.id === id) setViewingAppointment(null);
                } else if (type === 'message') {
                    await api.contact.delete(id);
                    setMessages(prev => prev.filter(m => m.id !== id));
                } else if (type === 'gallery') {
                    await api.gallery.delete(id, file || '');
                    setGalleryImages(prev => prev.filter(g => g.id !== id));
                }
                setConfirmState({ isOpen: false });
                setAlertState({ isOpen: true, type: 'success', title: 'Supprimé !', message: 'Élément supprimé avec succès.' });
            } catch (err) {
                setConfirmState({ isOpen: false });
                setAlertState({ isOpen: true, type: 'error', title: 'Erreur', message: getErrorMessage(err) });
            }
        }
    });
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormLoading(true);
    try {
        if (editingPost) await api.blog.update(editingPost.id, blogForm, blogFile || undefined);
        else {
            if (!blogFile) throw new Error("Image requise");
            await api.blog.create(blogForm, blogFile);
        }
        setEditingPost(null); setBlogForm({title:'', excerpt:'', service:''}); setBlogFile(null);
        await fetchData();
        setAlertState({ isOpen: true, type: 'success', title: 'Succès', message: 'Article enregistré !' });
    } catch (err) { 
        setAlertState({ isOpen: true, type: 'error', title: 'Erreur', message: getErrorMessage(err) });
    } finally { setFormLoading(false); }
  };

  const handleAudioSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormLoading(true);
    try {
        if (editingAudio) await api.audios.update(editingAudio.id, {title: audioForm.title, serviceName: audioForm.service}, audioFile || undefined);
        else {
            if (!audioFile) throw new Error("Fichier audio requis");
            await api.audios.create({title: audioForm.title, serviceName: audioForm.service}, audioFile);
        }
        setEditingAudio(null); setAudioForm({title:'', service:''}); setAudioFile(null);
        await fetchData();
        setAlertState({ isOpen: true, type: 'success', title: 'Succès', message: 'Audio enregistré !' });
    } catch (err) { 
        setAlertState({ isOpen: true, type: 'error', title: 'Erreur', message: getErrorMessage(err) });
    } finally { setFormLoading(false); }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormLoading(true);
    try {
        if (!videoFile) throw new Error("Fichier vidéo requis");
        await api.videos.create({ title: videoForm.title, category: videoForm.service }, videoFile);
        setVideoForm({ title: '', service: '' }); setVideoFile(null);
        await fetchData();
        setAlertState({ isOpen: true, type: 'success', title: 'Succès', message: 'Vidéo ajoutée !' });
    } catch (err) {
        setAlertState({ isOpen: true, type: 'error', title: 'Erreur', message: getErrorMessage(err) });
    } finally { setFormLoading(false); }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setFormLoading(true);
      try {
          if (!galleryFile) throw new Error("Fichier image requis");
          await api.gallery.create(galleryForm, galleryFile);
          setGalleryForm({ caption: '', category: 'Locaux' }); setGalleryFile(null);
          await fetchData();
          setAlertState({ isOpen: true, type: 'success', title: 'Succès', message: 'Photo ajoutée à la galerie !' });
      } catch (err) {
          setAlertState({ isOpen: true, type: 'error', title: 'Erreur', message: getErrorMessage(err) });
      } finally { setFormLoading(false); }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setFormLoading(true);
      try {
          await api.announcements.update(announcementForm.message, announcementForm.type, announcementForm.active);
          setAlertState({ isOpen: true, type: 'success', title: 'Succès', message: 'Bannière mise à jour !' });
      } catch (err) {
          setAlertState({ isOpen: true, type: 'error', title: 'Erreur', message: getErrorMessage(err) });
      } finally { setFormLoading(false); }
  };

  const handleUpdateStatus = async (e: React.MouseEvent, id: number, status: 'confirmed' | 'cancelled' | 'pending') => {
      e.stopPropagation();
      try {
          await api.appointments.updateStatus(id, status);
          await fetchData();
          if (viewingAppointment?.id === id) {
              setViewingAppointment(prev => prev ? {...prev, status} : null);
          }
      } catch (err) {
          setAlertState({ isOpen: true, type: 'error', title: 'Erreur', message: "Impossible de changer le statut." });
      }
  };

  const renderAppointments = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 text-xs text-blue-600 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900 flex items-center gap-2">
            <Info size={14} /> Cliquez sur un rendez-vous pour voir les détails complets (motif, etc).
        </div>
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {appointments.length === 0 ? (
                    <tr><td colSpan={4} className="py-10 text-center text-gray-400 dark:text-gray-500">Aucun rendez-vous.</td></tr>
                ) : appointments.map(app => (
                    <tr 
                        key={app.id} 
                        className="hover:bg-teal-50/50 dark:hover:bg-teal-900/20 cursor-pointer transition-colors"
                        onClick={() => setViewingAppointment(app)}
                    >
                        <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                                <div className="font-bold text-gray-900 dark:text-white">{app.name}</div>
                                {app.status === 'pending' && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-white animate-pulse">
                                        NOUVEAU
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{app.phone}</div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="text-sm text-gray-700 dark:text-gray-300">{new Date(app.date).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{app.time}</div>
                        </td>
                        <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                app.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                app.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                                {app.status === 'confirmed' ? 'Confirmé' : app.status === 'cancelled' ? 'Refusé' : 'En attente'}
                            </span>
                        </td>
                        <td className="px-4 py-4 text-right flex justify-end gap-2">
                            <button onClick={e => handleUpdateStatus(e, app.id, 'confirmed')} className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded" title="Confirmer"><CheckCircle size={16}/></button>
                            <button onClick={e => handleUpdateStatus(e, app.id, 'cancelled')} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded" title="Refuser"><XCircle size={16}/></button>
                            <button onClick={e => requestDelete(e, app.id, 'appointment')} className="p-1.5 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 rounded" title="Supprimer"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  const renderMessages = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">De</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Message</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {messages.length === 0 ? (
                    <tr><td colSpan={3} className="py-10 text-center text-gray-400 dark:text-gray-500">Aucun message.</td></tr>
                ) : messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => setViewingMessage(msg)}>
                        <td className="px-4 py-4">
                            <div className={`font-bold text-sm ${msg.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{msg.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell max-w-xs truncate text-sm text-gray-600 dark:text-gray-300">
                            {msg.message}
                        </td>
                        <td className="px-4 py-4 text-right">
                            <button onClick={e => requestDelete(e, msg.id, 'message')} className="p-1.5 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 rounded"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  const renderAnnouncement = () => (
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Megaphone size={24} className="text-teal-600 dark:text-teal-400"/> Gestion de la Bannière</h3>
          <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message de l'annonce</label>
                  <textarea 
                      required 
                      rows={3} 
                      className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      value={announcementForm.message}
                      onChange={e => setAnnouncementForm({...announcementForm, message: e.target.value})}
                      placeholder="Ex: Campagne de vaccination ce samedi..."
                  ></textarea>
              </div>
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type d'alerte</label>
                  <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="type" 
                            value="info" 
                            checked={announcementForm.type === 'info'}
                            onChange={() => setAnnouncementForm({...announcementForm, type: 'info'})}
                            className="text-teal-600 focus:ring-teal-500"
                          />
                          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase">Info (Bleu)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="type" 
                            value="alert" 
                            checked={announcementForm.type === 'alert'}
                            onChange={() => setAnnouncementForm({...announcementForm, type: 'alert'})}
                            className="text-teal-600 focus:ring-teal-500"
                          />
                          <span className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase">Urgent (Rouge)</span>
                      </label>
                  </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <input 
                    type="checkbox" 
                    id="active"
                    checked={announcementForm.active}
                    onChange={e => setAnnouncementForm({...announcementForm, active: e.target.checked})}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="active" className="cursor-pointer font-bold text-gray-700 dark:text-gray-200">Activer la bannière sur le site</label>
              </div>
              <button type="submit" disabled={formLoading} className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex justify-center items-center">
                  {formLoading ? <Loader2 className="animate-spin" size={20}/> : "Enregistrer les modifications"}
              </button>
          </form>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
        {/* MODAL VIEWING APPOINTMENT */}
        {viewingAppointment && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 relative border border-gray-100 dark:border-gray-700">
                    <button onClick={() => setViewingAppointment(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><CalendarClock size={24} className="text-teal-600 dark:text-teal-400"/> Détails Rendez-vous</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Patient</span>
                                <span className="font-bold text-gray-900 dark:text-white">{viewingAppointment.name}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Contact</span>
                                <a href={`tel:${viewingAppointment.phone}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">{viewingAppointment.phone}</a>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Date</span>
                                <span className="font-bold text-gray-900 dark:text-white">{new Date(viewingAppointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Heure</span>
                                <span className="font-bold text-gray-900 dark:text-white">{viewingAppointment.time}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                             <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Code de Suivi</span>
                             <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">{viewingAppointment.tracking_code || 'N/A'}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Motif de consultation</span>
                            <p className="text-gray-700 dark:text-gray-300 italic">{viewingAppointment.reason || "Aucun motif précisé."}</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={e => {handleUpdateStatus(e, viewingAppointment.id, 'confirmed');}} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors">Confirmer</button>
                            <button onClick={e => {handleUpdateStatus(e, viewingAppointment.id, 'cancelled');}} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors">Refuser</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL VIEWING MESSAGE */}
        {viewingMessage && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 relative border border-gray-100 dark:border-gray-700">
                    <button onClick={() => setViewingMessage(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Mail size={24} className="text-teal-600 dark:text-teal-400"/> Message reçu</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                             <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full text-teal-700 dark:text-teal-400"><User size={24}/></div>
                             <div>
                                 <h4 className="font-bold text-lg text-gray-900 dark:text-white">{viewingMessage.name}</h4>
                                 <p className="text-gray-500 dark:text-gray-400 text-sm">{viewingMessage.email} • {viewingMessage.phone}</p>
                             </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl min-h-[150px]">
                            <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{viewingMessage.message}</p>
                        </div>
                        <div className="text-right text-xs text-gray-400 dark:text-gray-500">
                            Reçu le {new Date(viewingMessage.created_at).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        )}

        <ConfirmModal 
            isOpen={confirmState.isOpen} 
            title={confirmState.title} 
            message={confirmState.message} 
            isLoading={confirmState.isLoading}
            onConfirm={confirmState.action} 
            onCancel={() => setConfirmState({ isOpen: false })} 
        />
        
        <AlertModal 
            isOpen={alertState.isOpen} 
            type={alertState.type} 
            title={alertState.title} 
            message={alertState.message} 
            onClose={() => setAlertState({ isOpen: false })} 
        />

        {/* --- LOGIN SCREEN --- */}
        {!isSecretVerified ? (
             <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
                    <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} className="text-red-600 dark:text-red-400"/>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Accès Restreint</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Espace réservé à l'administration du centre.</p>
                    
                    <form onSubmit={handleSecretVerify} className="space-y-4">
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-3 text-gray-400" size={20}/>
                            <input 
                                type="password" 
                                placeholder="Code d'accès secret"
                                value={secretCodeInput}
                                onChange={e => setSecretCodeInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                            />
                        </div>
                        {secretError && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                            <p className="text-red-500 dark:text-red-400 text-sm font-bold mb-1">{secretError}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Indice : Si vous n'avez pas configuré de code dans Netlify, essayez <code>ADMIN-ZOGBO</code>
                            </p>
                          </div>
                        )}
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">
                            Vérifier
                        </button>
                    </form>
                    <button onClick={() => navigate('/')} className="mt-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium">Retour au site public</button>
                </div>
             </div>
        ) : !isAuthenticated ? (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <div className="bg-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50">
                           <ShieldCheck size={28}/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connexion Admin</h2>
                        <p className="text-gray-500 dark:text-gray-400">Connectez-vous à votre compte Supabase</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {loginError && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex gap-2"><AlertCircle size={16} className="shrink-0"/> {loginError}</div>}
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300 mb-4 border border-blue-100 dark:border-blue-900">
                           <p className="font-bold mb-1">Important :</p>
                           <p>Il n'y a pas d'inscription publique. Vous devez créer votre premier utilisateur administrateur directement dans le tableau de bord Supabase (Authentication {'>'} Users {'>'} Add User).</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>
                        <button disabled={isLoggingIn} className="w-full bg-gray-900 hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-70 flex justify-center">
                            {isLoggingIn ? <Loader2 className="animate-spin" /> : "Se connecter"}
                        </button>
                    </form>
                </div>
            </div>
        ) : (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
                {/* SIDEBAR */}
                <aside className="bg-gray-900 text-gray-300 w-full md:w-64 flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-50 shadow-xl">
                    <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                         <div className="bg-teal-600 p-1.5 rounded text-white"><LayoutDashboard size={20}/></div>
                         <h1 className="font-bold text-white text-lg tracking-tight">Admin Zogbo</h1>
                    </div>
                    
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'blog' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
                            <Newspaper size={18}/> Actualités
                        </button>
                        <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'appointments' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
                            <CalendarClock size={18}/> Rendez-vous
                        </button>
                        <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
                            <Mail size={18}/> Messages
                        </button>
                        <div className="pt-4 pb-2 text-xs font-bold text-gray-500 uppercase px-4">Médiathèque</div>
                        <button onClick={() => setActiveTab('gallery')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'gallery' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
                            <ImageIcon size={18}/> Galerie Photos
                        </button>
                        <button onClick={() => setActiveTab('audio')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'audio' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
                            <FileAudio size={18}/> Audios
                        </button>
                        <button onClick={() => setActiveTab('video')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'video' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
                            <FileVideo size={18}/> Vidéos
                        </button>
                         <div className="pt-4 pb-2 text-xs font-bold text-gray-500 uppercase px-4">Configuration</div>
                        <button onClick={() => setActiveTab('announcement')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'announcement' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-gray-800'}`}>
                            <Megaphone size={18}/> Bannière
                        </button>
                    </nav>

                    <div className="p-4 border-t border-gray-800 space-y-2">
                        <button onClick={handleGoToSite} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:text-white transition-colors">
                            <Globe size={16}/> Voir le site
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                            <LogOut size={16}/> Déconnexion
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-8 flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {activeTab === 'blog' && "Gestion des Actualités"}
                                    {activeTab === 'appointments' && "Suivi des Rendez-vous"}
                                    {activeTab === 'messages' && "Boîte de Réception"}
                                    {activeTab === 'audio' && "Gestion des Audios"}
                                    {activeTab === 'video' && "Gestion des Vidéos"}
                                    {activeTab === 'gallery' && "Galerie Photos"}
                                    {activeTab === 'announcement' && "Configuration Site"}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">Gérez le contenu de votre site en temps réel.</p>
                            </div>
                            {isLoadingData && <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={24}/>}
                        </header>

                        {activeTab === 'appointments' && renderAppointments()}
                        {activeTab === 'messages' && renderMessages()}
                        {activeTab === 'announcement' && renderAnnouncement()}
                        
                        {(activeTab === 'blog' || activeTab === 'audio' || activeTab === 'video' || activeTab === 'gallery') && (
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Formulaire (Colonne Gauche) */}
                                <div className="lg:col-span-1 order-2 lg:order-1">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-6">
                                        <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4 mb-6 flex items-center gap-2">
                                            {activeTab === 'blog' ? (editingPost ? <Edit size={18}/> : <Plus size={18}/>) : <Plus size={18}/>}
                                            {activeTab === 'blog' ? (editingPost ? "Modifier l'article" : "Nouvel article") : 
                                             activeTab === 'audio' ? (editingAudio ? "Modifier l'audio" : "Nouvel audio") :
                                             activeTab === 'gallery' ? "Nouvelle Photo" :
                                             "Nouvelle Vidéo"}
                                        </h3>

                                        {activeTab === 'blog' && (
                                            <form onSubmit={handleBlogSubmit} className="space-y-4">
                                                <input type="text" required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="Titre de l'article"/>
                                                <select value={blogForm.service} onChange={e => setBlogForm({...blogForm, service: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                                                    <option value="">Aucun service spécifique</option>
                                                    {SERVICES.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                                                </select>
                                                <textarea required rows={5} value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="Contenu..."></textarea>
                                                <input type="file" accept="image/*" onChange={e => setBlogFile(e.target.files ? e.target.files[0] : null)} className="text-xs w-full block bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border-dashed border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"/>
                                                <div className="flex gap-2 pt-2">
                                                     {editingPost && <button type="button" onClick={() => {setEditingPost(null); setBlogForm({title:'', excerpt:'', service:''});}} className="flex-1 bg-gray-100 dark:bg-gray-700 py-3 rounded-lg font-bold text-sm text-gray-700 dark:text-gray-200">Annuler</button>}
                                                    <button type="submit" disabled={formLoading} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 text-sm">
                                                        {formLoading ? <Loader2 size={18} className="animate-spin mx-auto"/> : (editingPost ? "Mettre à jour" : "Publier")}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {activeTab === 'audio' && (
                                            <form onSubmit={handleAudioSubmit} className="space-y-4">
                                                <input type="text" required value={audioForm.title} onChange={e => setAudioForm({...audioForm, title: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="Titre"/>
                                                <select required value={audioForm.service} onChange={e => setAudioForm({...audioForm, service: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                                                    <option value="">Choisir un service...</option>
                                                    {SERVICES.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                                                </select>
                                                <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files ? e.target.files[0] : null)} className="text-xs w-full block bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border-dashed border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"/>
                                                <div className="flex gap-2 pt-2">
                                                     {editingAudio && <button type="button" onClick={() => {setEditingAudio(null); setAudioForm({title:'', service:''});}} className="flex-1 bg-gray-100 dark:bg-gray-700 py-3 rounded-lg font-bold text-sm text-gray-700 dark:text-gray-200">Annuler</button>}
                                                    <button type="submit" disabled={formLoading} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 text-sm">
                                                        {formLoading ? <Loader2 size={18} className="animate-spin mx-auto"/> : (editingAudio ? "Mettre à jour" : "Ajouter")}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {activeTab === 'video' && (
                                            <form onSubmit={handleVideoSubmit} className="space-y-4">
                                                <input type="text" required value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="Titre"/>
                                                <select value={videoForm.service} onChange={e => setVideoForm({...videoForm, service: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                                                    <option value="">Général</option>
                                                    {SERVICES.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                                                </select>
                                                <input type="file" accept="video/*" required onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)} className="text-xs w-full block bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border-dashed border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"/>
                                                <button type="submit" disabled={formLoading} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 text-sm">
                                                    {formLoading ? <Loader2 size={18} className="animate-spin mx-auto"/> : "Ajouter la vidéo"}
                                                </button>
                                            </form>
                                        )}

                                        {activeTab === 'gallery' && (
                                            <form onSubmit={handleGallerySubmit} className="space-y-4">
                                                <input type="text" required value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder="Légende de la photo"/>
                                                <select required value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                                                    <option value="Locaux">Locaux</option>
                                                    <option value="Équipe">Équipe</option>
                                                    <option value="Installations">Installations</option>
                                                    <option value="Événements">Événements</option>
                                                </select>
                                                <input type="file" accept="image/*" required onChange={e => setGalleryFile(e.target.files ? e.target.files[0] : null)} className="text-xs w-full block bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border-dashed border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"/>
                                                <button type="submit" disabled={formLoading} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 text-sm">
                                                    {formLoading ? <Loader2 size={18} className="animate-spin mx-auto"/> : "Ajouter la photo"}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>

                                {/* Liste (Colonne Droite) */}
                                <div className="lg:col-span-2 space-y-3 order-1 lg:order-2">
                                    {((activeTab === 'blog' ? posts : activeTab === 'audio' ? audios : activeTab === 'gallery' ? galleryImages : videos)).length === 0 ? (
                                        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500">
                                            Aucun contenu à afficher.
                                        </div>
                                    ) : (activeTab === 'blog' ? posts : activeTab === 'audio' ? audios : activeTab === 'gallery' ? galleryImages : videos).map(item => (
                                        <div key={item.id} className="bg-white dark:bg-gray-800 p-3 lg:p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:shadow-md transition-all">
                                            {('image' in item || 'url' in item) && (activeTab !== 'audio' && activeTab !== 'video') && (
                                                <div className="h-12 w-12 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                                                    <img src={'image' in item ? (item as BlogPost).image : (item as GalleryImage).url} className="w-full h-full object-cover" alt="miniature"/>
                                                </div>
                                            )}
                                            <div className="flex-1 overflow-hidden min-w-0">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{ 'title' in item ? item.title : (item as GalleryImage).caption }</h4>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase truncate">
                                                    {'service' in item ? item.service : ('serviceName' in item ? item.serviceName : 'category' in item ? item.category : 'Général')}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                {(activeTab !== 'video' && activeTab !== 'gallery') && (
                                                    <button onClick={e => { 'image' in item ? setEditingPost(item as BlogPost) : setEditingAudio(item as AudioResource); }} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                                        <Edit size={16}/>
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={e => requestDelete(e, item.id, activeTab === 'blog' ? 'blog' : activeTab === 'audio' ? 'audio' : activeTab === 'gallery' ? 'gallery' : 'video', 'image' in item ? (item as BlogPost).image : (item as any).url)} 
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        )}
    </div>
  );
};

export default Admin;
