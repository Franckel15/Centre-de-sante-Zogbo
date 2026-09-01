import React from 'react';
import { AlertTriangle, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  isLoading, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">{message}</p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={onCancel} 
              disabled={isLoading} 
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
            >
              Annuler
            </button>
            <button 
              onClick={onConfirm} 
              disabled={isLoading} 
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-colors flex justify-center items-center disabled:opacity-50 text-sm"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AlertModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ 
  isOpen, 
  type, 
  title, 
  message, 
  onClose 
}) => {
  if (!isOpen) return null;
  const colors = type === 'success' 
    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
    : type === 'error' 
    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertCircle;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${colors}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <div className="max-h-[200px] overflow-y-auto mb-5 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-left">
          <p className="text-xs text-gray-600 dark:text-gray-300 break-words leading-relaxed">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="w-full bg-gray-900 hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
