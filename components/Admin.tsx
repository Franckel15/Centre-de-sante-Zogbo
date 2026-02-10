
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

// Code secret d'accès (Configurable via Netlify)
// Safe access to environment variables
const env = (import.meta as any).env || {};
const ADMIN_SECRET_CODE = env.VITE_ADMIN_CODE || 'ADMIN-ZOGBO';

// --- HELPERS ---
const getErrorMessage = (error: any): string => {
  if (!error) return "Une erreur inconnue est survenue";
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return String(error);
};

// --- COMPOSANT MODAL DE CONFIRMATION ---
const ConfirmModal: React.FC<any> = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-3 rounded-full text-red-600 mb-4">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 mb-6 text-sm leading-relaxed">{message}</p>
                    <div className="flex gap-3 w-full">
                        <button onClick={onCancel} disabled={isLoading} className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50">Annuler</button>
                        <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors flex justify-center items-center disabled:opacity-50">
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
    const colors = type === 'success' ? 'bg-green-100 text-green-600' : type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600';
    const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertCircle;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 text-center animate-in zoom-in-95 duration-200">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${colors}`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 mb-5">{message}</p>
                <button onClick={onClose} className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-black transition-colors">D'accord</button>
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
              const ann = await api.announcements.getActive();
              if (ann) setAnnouncementForm({ message: ann.message, type: ann.type, active: ann.active });
          }
          else setPosts(await api.blog.getAll());
      } catch (e) { console.error(e); } finally { setIsLoadingData(false); }
  };

  const handleSecretVerify = (e: React.FormEvent) => {
      e.preventDefault();
      // Utilisation de la variable d'environnement ou fallback
      if (secretCodeInput === ADMIN_SECRET_CODE) {
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
      setConfirmState({
          isOpen: true,
          title: "Retourner au site ?",
          message: "Pour naviguer sur le site public, vous devez vous déconnecter de l'administration. Voulez-vous continuer ?",
          action: async () => {
               await handleLogout();
               navigate('/');
          }
      });
  };

  // --- ACTIONS ---
  // (Note: requestDelete code logic remains identical to original, just cleaner context)
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

  // Form handlers remain identical...
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

  // --- RENDER FUNCTIONS ---
  // Note: All rendering logic remains the same, only imports cleaned up

  const renderAppointments = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 bg-blue-50/50 text-xs text-blue-600 border-b border-blue-100 flex items-center gap-2">
            <Info size={14} /> Cliquez sur un rendez-vous pour voir les détails complets (motif, etc).
        </div>
        <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {appointments.length === 0 ? (
                    <tr><td colSpan={4} className="py-10 text-center text-gray-400">Aucun rendez-vous.</td></tr>
                ) : appointments.map(app => (
                    <tr 
                        key={app.id} 
                        className="hover:bg-teal-50/50 cursor-pointer transition-colors"
                        onClick={() => setViewingAppointment(app)}
                    >
                        <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                                <div className="font-bold text-gray-900">{app.name}</div>
                                {app.status === 'pending' && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-white animate-pulse">
                                        NOUVEAU
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">{app.phone}</div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="text-sm">{new Date(app.date).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{app.time}</div>
                        </td>
                        <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                app.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                app.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                'bg-amber-100 text-amber-700'
                            }`}>
                                {app.status === 'confirmed' ? 'Confirmé' : app.status === 'cancelled' ? 'Refusé' : 'En attente'}
                            </span>
                        </td>
                        <td className="px-4 py-4 text-right flex justify-end gap-2">
                            <button onClick={e => handleUpdateStatus(e, app.id, 'confirmed')} className="p-1.5 text-green-600 bg-green-50 rounded hover:bg-green-100" title="Confirmer"><CheckCircle size={16}/></button>
                            <button onClick={e => handleUpdateStatus(e, app.id, 'cancelled')} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100" title="Refuser"><XCircle size={16}/></button>
                            <button onClick={e => requestDelete(e, app.id, 'appointment')} className="p-1.5 text-gray-400 hover:text-red-600 rounded" title="Supprimer"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  const renderMessages = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">De</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Message</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {messages.length === 0 ? (
                    <tr><td colSpan={3} className="py-10 text-center text-gray-400">Aucun message.</td></tr>
                ) : messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setViewingMessage(msg)}>
                        <td className="px-4 py-4">
                            <div className={`font-bold text-sm ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</div>
                            <div className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell max-w-xs truncate text-sm text-gray-600">
                            {msg.message}
                        </td>
                        <td className="px-4 py-4 text-right">
                            <button onClick={e => requestDelete(e, msg.id, 'message')} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  const renderAnnouncement = () => (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Megaphone size={24} className="text-teal-600"/> Gestion de la Bannière</h3>
          <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
              <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message de l'annonce</label>
                  <textarea 
                      required 
                      rows={3} 
                      className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                      value={announcementForm.message}
                      onChange={e => setAnnouncementForm({...announcementForm, message: e.target.value})}
                      placeholder="Ex: Campagne de vaccination ce samedi..."
                  ></textarea>
              </div>
              <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Type d'alerte</label>
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
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Info (Bleu)</span>
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
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Urgent (Rouge)</span>
                      </label>
                  </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border">
                  <input 
                    type="checkbox" 
                    id="active"
                    checked={announcementForm.active}
                    onChange={e => setAnnouncementForm({...announcementForm, active: e.target.checked})}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="active" className="cursor-pointer font-bold text-gray-700">Activer la bannière sur le site</label>
              </div>
              <button type="submit" disabled={formLoading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex justify-center items-center">
                  {formLoading ? <Loader2 className="animate-spin" size={20}/> : "Enregistrer les modifications"}
              </button>
          </form>
      </div>
  );

  const renderContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire (Colonne Gauche) */}
        <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-32">
                <h3 className="font-bold text-gray-900 border-b pb-4 mb-6 flex items-center gap-2">
                    {activeTab === 'blog' ? (editingPost ? <Edit size={18}/> : <Plus size={18}/>) : <Plus size={18}/>}
                    {activeTab === 'blog' ? (editingPost ? "Modifier l'article" : "Nouvel article") : 
                     activeTab === 'audio' ? (editingAudio ? "Modifier l'audio" : "Nouvel audio") :
                     activeTab === 'gallery' ? "Nouvelle Photo" :
                     "Nouvelle Vidéo"}
                </h3>

                {activeTab === 'blog' && (
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                        <input type="text" required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" placeholder="Titre de l'article"/>
                        <select value={blogForm.service} onChange={e => setBlogForm({...blogForm, service: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Aucun service spécifique</option>
                            {SERVICES.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                        </select>
                        <textarea required rows={5} value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" placeholder="Contenu..."></textarea>
                        <input type="file" accept="image/*" onChange={e => setBlogFile(e.target.files ? e.target.files[0] : null)} className="text-xs w-full block bg-gray-50 p-2 rounded-lg border-dashed border-2"/>
                        <div className="flex gap-2 pt-2">
                             {editingPost && <button type="button" onClick={() => {setEditingPost(null); setBlogForm({title:'', excerpt:'', service:''});}} className="flex-1 bg-gray-100 py-3 rounded-lg font-bold text-sm">Annuler</button>}
                            <button type="submit" disabled={formLoading} className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 text-sm">
                                {formLoading ? <Loader2 size={18} className="animate-spin mx-auto"/> : (editingPost ? "Mettre à jour" : "Publier")}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'audio' && (
                    <form onSubmit={handleAudioSubmit} className="space-y-4">
                        <input type="text" required value={audioForm.title} onChange={e => setAudioForm({...audioForm, title: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" placeholder="Titre"/>
                        <select required value={audioForm.service} onChange={e => setAudioForm({...audioForm, service: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Choisir un service...</option>
                            {SERVICES.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                        </select>
                        <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files ? e.target.files[0] : null)} className="text-xs w-full block bg-gray-50 p-2 rounded-lg border-dashed border-2"/>
                        <div className="flex gap-2 pt-2">
                             {editingAudio && <button type="button" onClick={() => {setEditingAudio(null); setAudioForm({title:'', service:''});}} className="flex-1 bg-gray-100 py-3 rounded-lg font-bold text-sm">Annuler</button>}
                            <button type="submit" disabled={formLoading} className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 text-sm">
                                {formLoading ? <Loader2 size={18} className="animate-spin mx-auto"/> : (editingAudio ? "Mettre à jour" : "Ajouter")}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'video' && (
                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                        <input type="text" required value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" placeholder="Titre"/>
                        <select value={videoForm.service} onChange={e => setVideoForm({...videoForm, service: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Général</option>
                            {SERVICES.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                        </select>
                        <input type="file" accept="video/*" required onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)} className="text-xs w-full block bg-gray-50 p-2 rounded-lg border-dashed border-2"/>
                        <button type="submit" disabled={formLoading} className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 text-sm">
                            {formLoading ? <Loader2 size={18} className="animate-spin mx-auto"/> : "Ajouter la vidéo"}
                        </button>
                    </form>
                )}

                {activeTab === 'gallery' && (
                    <form onSubmit={handleGallerySubmit} className="space-y-4">
                        <input type="text" required value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" placeholder="Légende de la photo"/>
                        <select required value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="Locaux">Locaux</option>
                            <option value="Équipe">Équipe</option>
                            <option value="Installations">Installations</option>
                            <option value="Événements">Événements</option>
                        </select>
                        <input type="file" accept="image/*" required onChange={e => setGalleryFile(e.target.files ? e.target.files[0] : null)} className="text-xs w-full block bg-gray-50 p-2 rounded-lg border-dashed border-2"/>
                        <button type="submit" disabled={formLoading} className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 text-sm">
                            {formLoading ? <Loader2 size={18} className="animate-spin mx-auto"/> : "Ajouter la photo"}
                        </button>
                    </form>
                )}
            </div>
        </div>

        {/* Liste (Colonne Droite) */}
        <div className="lg:col-span-2 space-y-3 order-1 lg:order-2">
            {((activeTab === 'blog' ? posts : activeTab === 'audio' ? audios : activeTab === 'gallery' ? galleryImages : videos)).length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed text-gray-400">
                    Aucun contenu à afficher.
                </div>
            ) : (activeTab === 'blog' ? posts : activeTab === 'audio' ? audios : activeTab === 'gallery' ? galleryImages : videos).map(item => (
                <div key={item.id} className="bg-white p-3 lg:p-4 rounded-xl border flex items-center gap-3 hover:shadow-md transition-all">
                    {('image' in item || 'url' in item) && (activeTab !== 'audio' && activeTab !== 'video') && (
                        <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden border shrink-0">
                            <img src={'image' in item ? (item as BlogPost).image : (item as GalleryImage).url} className="w-full h-full object-cover" alt="miniature"/>
                        </div>
                    )}
                    <div className="flex-1 overflow-hidden min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{ 'title' in item ? item.title : (item as GalleryImage).caption }</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase truncate">
                            {'service' in item ? item.service : ('serviceName' in item ? item.serviceName : 'category' in item ? item.category : 'Général')}
                        </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                        {(activeTab !== 'video' && activeTab !== 'gallery') && (
                            <button onClick={e => { 'image' in item ? setEditingPost(item as BlogPost) : setEditingAudio(item as AudioResource); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit size={16}/>
                            </button>
                        )}
                        <button 
                            onClick={e => requestDelete(e, item.id, activeTab === 'blog' ? 'blog' : activeTab === 'audio' ? 'audio' : activeTab === 'gallery' ? 'gallery' : 'video', 'image' in item ? (item as BlogPost).image : (item as any).url)} 
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                            <Trash2 size={16}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Admin;
