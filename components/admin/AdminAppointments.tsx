import React, { useState } from 'react';
import { Appointment } from '../../services/api';
import { 
  CalendarClock, 
  Phone, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  X, 
  User, 
  Clock, 
  Hash, 
  Eye, 
  Filter 
} from 'lucide-react';

interface AdminAppointmentsProps {
  appointments: Appointment[];
  onUpdateStatus: (id: number, status: 'pending' | 'confirmed' | 'cancelled') => void;
  onDelete: (id: number) => void;
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({
  appointments,
  onUpdateStatus,
  onDelete
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs px-2.5 py-1 rounded-full font-bold">Confirmé</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-xs px-2.5 py-1 rounded-full font-bold">Refusé</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-xs px-2.5 py-1 rounded-full font-bold">En attente</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-in zoom-in-95 relative border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setViewingAppointment(null)} 
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Fermer"
            >
              <X size={22}/>
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <CalendarClock size={24} className="text-teal-600 dark:text-teal-400"/> Détails du Rendez-vous
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                  <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase">Patient</span>
                  <span className="font-bold text-gray-900 dark:text-white break-words text-base">{viewingAppointment.name}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                  <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase">Téléphone</span>
                  <a href={`tel:${viewingAppointment.phone}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5 mt-0.5">
                    <Phone size={14}/> {viewingAppointment.phone}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                  <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase">Date</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {new Date(viewingAppointment.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                  <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase">Heure</span>
                  <span className="font-bold text-gray-900 dark:text-white">{viewingAppointment.time}</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 flex justify-between items-center">
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase">Code de Suivi</span>
                  <span className="font-mono font-bold text-lg text-teal-600 dark:text-teal-400">{viewingAppointment.tracking_code || 'N/A'}</span>
                </div>
                <div>{getStatusBadge(viewingAppointment.status)}</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">Motif de consultation</span>
                <p className="text-gray-700 dark:text-gray-300 italic">{viewingAppointment.reason || "Aucun motif particulier précisé."}</p>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  onClick={() => {
                    onUpdateStatus(viewingAppointment.id, 'confirmed');
                    setViewingAppointment(prev => prev ? { ...prev, status: 'confirmed' } : null);
                  }} 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-xs"
                >
                  Confirmer le rendez-vous
                </button>
                <button 
                  onClick={() => {
                    onUpdateStatus(viewingAppointment.id, 'cancelled');
                    setViewingAppointment(prev => prev ? { ...prev, status: 'cancelled' } : null);
                  }} 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors text-xs"
                >
                  Refuser le rendez-vous
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <Filter size={16} /> Filtres :
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {f === 'all' && `Tous (${appointments.length})`}
              {f === 'pending' && `En attente (${appointments.filter(a => a.status === 'pending').length})`}
              {f === 'confirmed' && `Confirmés (${appointments.filter(a => a.status === 'confirmed').length})`}
              {f === 'cancelled' && `Refusés (${appointments.filter(a => a.status === 'cancelled').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500">
            Aucun rendez-vous dans cette catégorie.
          </div>
        ) : (
          filteredAppointments.map(item => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl shrink-0">
                  <User size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{item.name}</h4>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1"><Phone size={12}/> {item.phone}</span>
                    <span className="flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400">
                      <Clock size={12}/> {new Date(item.date).toLocaleDateString('fr-FR')} à {item.time}
                    </span>
                    {item.tracking_code && (
                      <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-[11px]">
                        {item.tracking_code}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button 
                  onClick={() => setViewingAppointment(item)} 
                  className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Voir les détails"
                >
                  <Eye size={16} /> <span className="hidden sm:inline">Détails</span>
                </button>
                {item.status !== 'confirmed' && (
                  <button 
                    onClick={() => onUpdateStatus(item.id, 'confirmed')} 
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                    title="Confirmer"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                {item.status !== 'cancelled' && (
                  <button 
                    onClick={() => onUpdateStatus(item.id, 'cancelled')} 
                    className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                    title="Refuser"
                  >
                    <XCircle size={18} />
                  </button>
                )}
                <button 
                  onClick={() => onDelete(item.id)} 
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
