import React, { useState, useEffect } from 'react';
import { Announcement } from '../../services/api';
import { Megaphone, Save, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AdminAnnouncementProps {
  announcement: Announcement | null;
  onSave: (message: string, type: 'alert' | 'info', active: boolean) => Promise<void>;
  isLoading?: boolean;
}

export const AdminAnnouncement: React.FC<AdminAnnouncementProps> = ({
  announcement,
  onSave,
  isLoading
}) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'alert' | 'info'>('info');
  const [active, setActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (announcement) {
      setMessage(announcement.message || '');
      setType(announcement.type || 'info');
      setActive(!!announcement.active);
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await onSave(message, type, active);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Erreur sauvegarde bannière:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Megaphone size={22} className="text-teal-600 dark:text-teal-400" />
          Bannière d'Alerte / Information du Site
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Cette bannière s'affiche en haut de toutes les pages pour les annonces importantes (ex: fermetures exceptionnelles, campagnes de vaccination).
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle size={16}/> Paramètres de la bannière enregistrés avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
          <div>
            <span className="font-bold text-sm text-gray-900 dark:text-white block">Activer la bannière</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Rendre visible le message aux visiteurs</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={active} 
              onChange={e => setActive(e.target.checked)} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Type de message</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('info')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                type === 'info' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-400/30' 
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Info size={16}/> Information Générale (Bleu)
            </button>
            <button
              type="button"
              onClick={() => setType('alert')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                type === 'alert' 
                  ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300 ring-2 ring-red-400/30' 
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              <AlertTriangle size={16}/> Alerte Urgente (Rouge)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Texte du message *</label>
          <textarea
            rows={3}
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="ex: Campagne nationale de vaccination contre la rougeole ce samedi..."
            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-white"
          ></textarea>
        </div>

        {/* Live Preview */}
        {message && (
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Aperçu en direct</span>
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              type === 'alert' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {type === 'alert' ? <AlertTriangle size={16} className="shrink-0"/> : <Info size={16} className="shrink-0"/>}
              <span>{message}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};
