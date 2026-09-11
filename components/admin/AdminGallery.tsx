import React, { useState } from 'react';
import { GalleryImage } from '../../services/api';
import { Plus, Trash2, Loader2, ImagePlus, Filter } from 'lucide-react';

interface AdminGalleryProps {
  images: GalleryImage[];
  onUpload: (meta: { caption: string; category: string }, file: File) => Promise<void>;
  onDelete: (id: number, url: string) => void;
  isLoading?: boolean;
}

const CATEGORIES = ['Tous', 'Locaux', 'Équipements', 'Équipe', 'Maternité', 'Laboratoire'];

export const AdminGallery: React.FC<AdminGalleryProps> = ({
  images,
  onUpload,
  onDelete,
  isLoading
}) => {
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Locaux');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier image.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpload({ caption, category }, file);
      setCaption('');
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Erreur ajout photo galerie:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredImages = images.filter(img => {
    if (selectedCategory === 'Tous') return true;
    return img.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ImagePlus size={20} className="text-teal-600 dark:text-teal-400" />
          Ajouter une photo à la galerie
        </h3>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Légende / Description *</label>
            <input 
              type="text" 
              required 
              value={caption} 
              onChange={e => setCaption(e.target.value)}
              placeholder="ex: Salle de consultation n°1"
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Catégorie</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
            >
              {CATEGORIES.filter(c => c !== 'Tous').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Fichier Photo *</label>
            <input 
              type="file" 
              accept="image/*" 
              required
              onChange={handleFileChange}
              className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 dark:file:bg-teal-900/40 dark:file:text-teal-300 hover:file:bg-teal-100"
            />
          </div>

          <div className="sm:col-span-2">
            <button 
              type="submit" 
              disabled={isSubmitting || isLoading || !file}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              Ajouter
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
          <Filter size={14} /> Filtre :
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === cat 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {cat} {cat === 'Tous' ? `(${images.length})` : `(${images.filter(i => i.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
            Aucune photo dans cette catégorie.
          </div>
        ) : (
          filteredImages.map(img => (
            <div 
              key={img.id} 
              className="group relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 aspect-square shadow-sm"
            >
              <img 
                src={img.url} 
                alt={img.caption} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                <button 
                  onClick={() => onDelete(img.id, img.url)} 
                  className="self-end p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg"
                  title="Supprimer la photo"
                >
                  <Trash2 size={14} />
                </button>
                <div>
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">{img.category}</span>
                  <p className="text-xs text-white font-medium truncate">{img.caption}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
