import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, BlogPost as BlogPostType } from '../services/api';
import { 
  CalendarDays, 
  User, 
  ArrowLeft, 
  Loader2, 
  Tag, 
  Clock, 
  ShieldCheck, 
  Phone, 
  CalendarCheck,
  Share2,
  ChevronRight
} from 'lucide-react';
import BackToTop from './BackToTop';
import { CONTACT_INFO } from '../constants';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await api.blog.getById(Number(id));
        setPost(data);
      } catch (error) {
        console.error("Erreur chargement article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-36 pb-20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={40} />
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-36 pb-20 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700 p-8 text-center shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Article non trouvé</h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">
            Cet article a peut-être été déplacé ou n'existe plus dans notre registre.
          </p>
          <Link 
            to="/blog" 
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors w-full"
          >
            <ArrowLeft size={16} /> Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* En-tête visible avec espacement sous le header fixe */}
      <div className="bg-slate-900 dark:bg-black text-white pt-28 pb-12 lg:pt-36 lg:pb-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Fil d'Ariane & Bouton retour */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <nav className="flex items-center gap-1.5 text-xs text-slate-400" aria-label="Fil d'Ariane">
              <Link to="/" className="hover:text-teal-300 transition-colors">Accueil</Link>
              <ChevronRight size={12} className="text-slate-600" />
              <Link to="/blog" className="hover:text-teal-300 transition-colors">Actualités</Link>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-teal-400 font-semibold">{post.category}</span>
            </nav>

            <Link 
              to="/blog" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
            >
              <ArrowLeft size={14} />
              Retour aux actualités
            </Link>
          </div>

          {/* Badges de catégorie & service */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            {post.service && (
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {post.service}
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-slate-800/90 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full text-xs">
              <ShieldCheck size={13} className="text-teal-400" />
              Information validée
            </span>
          </div>

          {/* Titre de l'article - toujours parfaitement lisible et visible */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Métadonnées de l'article */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 border-t border-slate-800 pt-4">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} className="text-teal-400" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={15} className="text-teal-400" />
              Rédaction CS Zogbo
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock size={15} className="text-teal-400" />
              3 min de lecture
            </span>
            <button
              onClick={handleShare}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-700"
              title="Partager l'article"
            >
              <Share2 size={13} />
              <span>{copied ? 'Lien copié !' : 'Partager'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteneur principal de l'article */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Image principale bien cadrée */}
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-gray-800 bg-slate-100 dark:bg-gray-800 shadow-xs mb-8 md:mb-10 aspect-video max-h-[460px]">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Corps de l'article */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <div className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed space-y-5">
            {post.excerpt.split('\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Note de sensibilisation médicale */}
        <div className="mt-10 p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 flex items-start gap-3">
          <ShieldCheck size={22} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <p className="font-bold text-teal-900 dark:text-teal-200 mb-1">
              Conseil de prévention médicale
            </p>
            <p className="leading-relaxed">
              Les articles publiés sur notre plateforme ont un but purement informatif et préventif. En cas de symptômes persistants ou de questions relatives à votre état de santé, veuillez consulter directement nos praticiens au Centre de Santé de Zogbo.
            </p>
          </div>
        </div>

        {/* Bloc d'appel à l'action */}
        <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Besoin d'une consultation au centre ?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
              Notre équipe médicale est à votre écoute 24h/24 et 7j/7.
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/appointment"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs whitespace-nowrap"
            >
              <CalendarCheck size={16} />
              Prendre rendez-vous
            </Link>
            <a
              href={`tel:${CONTACT_INFO.phoneRaw}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-750 text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 font-bold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              <Phone size={16} className="text-teal-600" />
              Ligne directe
            </a>
          </div>
        </div>

        {/* Tags & Navigation inférieure */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-xs sm:text-sm">
            <Tag size={15} className="text-teal-600" />
            <span>Thématiques : {post.category}, Santé publique{post.service ? `, ${post.service}` : ''}</span>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
          >
            <ArrowLeft size={16} />
            Voir toutes les actualités
          </Link>
        </div>
      </div>

      <BackToTop />
    </div>
  );
};

export default BlogPost;
