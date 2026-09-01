import React, { useState } from 'react';
import { VideoResource } from '../../services/api';
import { Plus, Trash2, Loader2, FileVideo } from 'lucide-react';
import { SERVICES } from '../../constants';

interface AdminVideosProps {
  videos: VideoResource[];
  onUpload: (meta: { title: string; category?: string }, file: File) => Promise<void>;
  onDelete: (id: number, url: string) => void;
  isLoading?: boolean;
}

export const AdminVideos: React.FC<AdminVideosProps> = ({
  videos,
  onUpload,
  onDelete,
  isLoading
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(SERVICES[0]?.title || 'Médecine Générale');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier vidéo (MP4/WebM).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpload({ title, category }, file);
      setTitle('');
      setFile(null);
    } catch (err) {
      console.error("Erreur upload vidéo:", err);
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
            <FileVideo size={20} className="text-teal-600 dark:text-teal-400" />
            Ajouter une capsule vidéo
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Titre de la vidéo *</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="ex: Gestes qui sauvent et premiers secours"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Catégorie</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
              >
                {SERVICES.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Fichier Vidéo (MP4/WebM) *</label>
              <input 
                type="file" 
                accept="video/mp4,video/webm" 
                required
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 dark:file:bg-teal-900/40 dark:file:text-teal-300 hover:file:bg-teal-100"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || isLoading || !file}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              Mettre en ligne la vidéo
            </button>
          </form>
        </div>
      </div>

      {/* Videos List */}
      <div className="lg:col-span-7 space-y-4">
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Vidéos publiées ({videos.length})</h4>
        {videos.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
            Aucune vidéo disponible pour le moment.
          </div>
        ) : (
          videos.map(vid => (
            <div 
              key={vid.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-3 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">{vid.category}</span>
                  <h5 className="font-bold text-gray-900 dark:text-white text-sm truncate">{vid.title}</h5>
                </div>
                <button 
                  onClick={() => onDelete(vid.id, vid.url)} 
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors shrink-0"
                  title="Supprimer la vidéo"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-56">
                <video controls src={vid.url} className="w-full h-full object-cover" preload="metadata" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
