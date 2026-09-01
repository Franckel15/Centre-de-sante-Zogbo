import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const { error } = await api.auth.signIn(email.trim(), password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error("Email ou mot de passe incorrect.");
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error("L'adresse email n'a pas encore été confirmée.");
        } else {
          throw new Error(error.message || "Erreur de connexion.");
        }
      }
      onSuccess();
    } catch (err: any) {
      console.error("Erreur de connexion admin:", err);
      setLoginError(err.message || "Impossible de se connecter.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12 relative">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full border border-gray-100 dark:border-gray-700 relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="bg-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-teal-900/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Espace Administration</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Centre de Santé de Zogbo</p>
        </div>

        {loginError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Adresse Email Administrateur
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@cszogbo.bj"
                className="w-full pl-11 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 text-sm"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoggingIn} 
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 flex justify-center items-center text-sm"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                <span>Authentification en cours...</span>
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft size={14} /> Retour au site public
          </button>
        </div>
      </div>
    </div>
  );
};
