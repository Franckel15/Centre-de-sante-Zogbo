import React, { useState } from 'react';
import { AudioResource } from '../../services/api';
import { Plus, Trash2, Loader2, FileAudio, Play, Pause, Edit2 } from 'lucide-react';
import { SERVICES } from '../../constants';

interface AdminAudiosProps {
  audios: AudioResource[];
  onUpload: (meta: { title: string; serviceName: string; description?: string }, file: File) => Promise<void>;
  onDelete: (id: number, url: string) => void;
  isLoading?: boolean;
}

export const AdminAudios: React.FC<AdminAudiosProps> = ({
  audios,
  onUpload,
  onDelete,
  isLoading
}) => {
  const [title, setTitle] = useState('');
  const [serviceName, setServiceName] = useState(SERVICES[0]?.title || 'Médecine Générale');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier audio (MP3/WAV/M4A/OGG).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpload({ title, serviceName, description }, file);
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (err) {
      console.error("Erreur upload audio:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Upload Form */}
      <div className="lg:col-span-5">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileAudio size={20} className="text-teal-600 dark:text-teal-400" />
            Ajouter un conseil audio
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Titre de l'audio *</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="ex: Conseils nutritionnels pour femmes enceintes"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Service Médical</label>
              <select 
                value={serviceName} 
                onChange={e => setServiceName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
              >
                {SERVICES.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Description (Optionnel)</label>
              <textarea 
                rows={3} 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Brève explication du sujet abordé..."
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Fichier Audio *</label>
              <input 
                type="file" 
                accept="audio/*" 
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
              Mettre en ligne l'audio
            </button>
          </form>
        </div>
      </div>

      {/* Audios List */}
      <div className="lg:col-span-7 space-y-3">
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Audios disponibles ({audios.length})</h4>
        {audios.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
            Aucun enregistrement audio pour le moment.
          </div>
        ) : (
          audios.map(aud => (
            <div 
              key={aud.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-3 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">{aud.serviceName}</span>
                  <h5 className="font-bold text-gray-900 dark:text-white text-sm truncate">{aud.title}</h5>
                  {aud.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{aud.description}</p>}
                </div>
                <button 
                  onClick={() => onDelete(aud.id, aud.url)} 
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors shrink-0"
                  title="Supprimer l'audio"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <audio controls src={aud.url} className="w-full h-8" preload="none" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
