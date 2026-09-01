import React, { useState } from 'react';
import { ContactMessage } from '../../services/api';
import { Mail, Phone, Trash2, CheckCircle, Eye, X, User, Calendar } from 'lucide-react';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onDelete: (id: number) => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({
  messages,
  onDelete
}) => {
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  return (
    <div className="space-y-4">
      {/* Detail Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-in zoom-in-95 relative border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setViewingMessage(null)} 
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Fermer"
            >
              <X size={22}/>
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Mail size={24} className="text-teal-600 dark:text-teal-400"/> Message de Contact
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                <span className="block text-[11px] font-bold text-gray-400 uppercase">Expéditeur</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">{viewingMessage.name}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                  <span className="block text-[11px] font-bold text-gray-400 uppercase">Email</span>
                  <a href={`mailto:${viewingMessage.email}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline break-all">
                    {viewingMessage.email}
                  </a>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                  <span className="block text-[11px] font-bold text-gray-400 uppercase">Téléphone</span>
                  <a href={`tel:${viewingMessage.phone}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
                    {viewingMessage.phone}
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                <span className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Message</span>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{viewingMessage.message}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <a 
                  href={`mailto:${viewingMessage.email}?subject=Réponse Centre de Santé Zogbo`}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors text-xs text-center flex items-center justify-center gap-2"
                >
                  <Mail size={16}/> Répondre par Email
                </a>
                <a 
                  href={`tel:${viewingMessage.phone}`}
                  className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors text-xs text-center flex items-center justify-center gap-2"
                >
                  <Phone size={16}/> Appeler
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages List */}
      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Boîte de réception ({messages.length})</h4>
      {messages.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
          Aucun message reçu pour le moment.
        </div>
      ) : (
        messages.map(msg => (
          <div 
            key={msg.id} 
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                <Mail size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-gray-900 dark:text-white text-sm truncate">{msg.name}</h5>
                  <span className="text-[10px] text-gray-400">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString('fr-FR') : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{msg.message}</p>
                <div className="flex items-center gap-3 text-[11px] text-teal-600 dark:text-teal-400 mt-0.5">
                  <span>{msg.phone}</span>
                  <span>•</span>
                  <span>{msg.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setViewingMessage(msg)} 
                className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Lire le message"
              >
                <Eye size={16} /> <span className="hidden sm:inline">Lire</span>
              </button>
              <button 
                onClick={() => onDelete(msg.id)} 
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
  );
};
