import React, { useState } from 'react';
import { BlogPost } from '../../services/api';
import { Plus, Edit2, Trash2, Loader2, ImagePlus, Newspaper } from 'lucide-react';
import { SERVICES } from '../../constants';

interface AdminBlogProps {
  posts: BlogPost[];
  onSave: (postData: { id?: number; title: string; excerpt: string; service?: string }, file?: File) => Promise<void>;
  onDelete: (id: number, image?: string) => void;
  isLoading?: boolean;
}

export const AdminBlog: React.FC<AdminBlogProps> = ({
  posts,
  onSave,
  onDelete,
  isLoading
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    service: SERVICES[0]?.title || 'Médecine Générale',
    excerpt: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = (post: BlogPost) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      service: post.service || SERVICES[0]?.title || 'Médecine Générale',
      excerpt: post.excerpt
    });
    setPreviewUrl(post.image || null);
    setFile(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      service: SERVICES[0]?.title || 'Médecine Générale',
      excerpt: ''
    });
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !file) {
      alert("Veuillez sélectionner une image d'illustration.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(
        {
          id: editingId || undefined,
          title: formData.title,
          service: formData.service,
          excerpt: formData.excerpt
        },
        file || undefined
      );
      handleCancel();
    } catch (err) {
      console.error("Erreur sauvegarde article blog:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Form Column */}
      <div className="lg:col-span-5">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            {editingId ? <Edit2 size={20} className="text-teal-600 dark:text-teal-400" /> : <Plus size={20} className="text-teal-600 dark:text-teal-400" />}
            {editingId ? "Modifier l'article" : "Publier un nouvel article"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Titre de l'article *</label>
              <input 
                type="text" 
                required 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="ex: Campagne de vaccination gratuite..."
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Service Associé</label>
              <select 
                value={formData.service} 
                onChange={e => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
              >
                {SERVICES.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Contenu / Résumé *</label>
              <textarea 
                rows={4} 
                required 
                value={formData.excerpt} 
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Rédigez ici le contenu de l'actualité..."
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                Image d'illustration {!editingId && '*'}
              </label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="blog-image-input" 
                />
                <label htmlFor="blog-image-input" className="cursor-pointer flex flex-col items-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-32 w-full object-cover rounded-lg mb-2" />
                  ) : (
                    <ImagePlus size={32} className="text-gray-400 mb-2" />
                  )}
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    {previewUrl ? "Changer l'image" : "Sélectionner une photo"}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Annuler
                </button>
              )}
              <button 
                type="submit" 
                disabled={isSubmitting || isLoading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                {editingId ? "Mettre à jour" : "Publier l'article"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Column */}
      <div className="lg:col-span-7 space-y-3">
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Articles publiés ({posts.length})</h4>
        {posts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
            Aucun article pour le moment.
          </div>
        ) : (
          posts.map(post => (
            <div 
              key={post.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-4 items-center hover:shadow-sm transition-all"
            >
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-gray-700" 
              />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{post.service || post.category}</span>
                <h5 className="font-bold text-gray-900 dark:text-white text-sm truncate">{post.title}</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{post.excerpt}</p>
                <span className="text-[10px] text-gray-400 block mt-1">{post.date}</span>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button 
                  onClick={() => handleEditClick(post)} 
                  className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => onDelete(post.id, post.image)} 
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
