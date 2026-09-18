
import React, { useEffect, useState } from 'react';
import { api, BlogPost } from '../services/api';
import { CalendarDays, ArrowRight, User, Loader2, Search, X, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 10;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchPosts = async () => {
        try {
            const data = await api.blog.getAll();
            setPosts(data);
        } catch (error) {
            console.error("Erreur chargement blog:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchPosts();
  }, []);

  // Réinitialiser la page à 1 lors d'une recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Logique de filtrage
  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.service && post.service.toLowerCase().includes(query))
    );
  });

  // Logique de Pagination
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Page Header - Centrage parfait avec espacement généreux sous la barre fixe */}
      <div className="bg-slate-900 dark:bg-black text-white pt-36 sm:pt-40 lg:pt-44 pb-14 lg:pb-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Projet conceptuel de démonstration
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white text-center w-full">
            Actualités & Conseils
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto text-center leading-relaxed">
            Restez informé des dernières nouvelles du centre de santé et de nos conseils santé.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20 relative z-10">
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={36} />
          </div>
        ) : (
          <>
            {/* Barre de Recherche */}
            <div className="max-w-2xl mx-auto mb-10 md:mb-12 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-12 py-3 md:py-3.5 bg-white dark:bg-gray-800 border border-slate-200/90 dark:border-gray-700 rounded-2xl leading-5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 shadow-xs transition-all text-sm md:text-base"
                placeholder="Rechercher un article, un sujet, un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <div className="bg-slate-100 dark:bg-gray-700 rounded-full p-1">
                    <X size={16} />
                  </div>
                </button>
              )}
            </div>

            {/* Grille des articles */}
            {filteredPosts.length > 0 ? (
              <>
                <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
                  {currentPosts.map((post) => (
                    <article 
                      key={post.id} 
                      className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xs hover:shadow-md transition-shadow duration-300 overflow-hidden h-full border border-slate-200/80 dark:border-gray-700 group"
                    >
                      <div className="relative h-48 md:h-52 overflow-hidden shrink-0 bg-slate-100 dark:bg-gray-700">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 z-20 flex flex-wrap items-start gap-1.5">
                          <span className="bg-white/95 dark:bg-gray-900/95 backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-bold text-teal-700 dark:text-teal-400 shadow-xs uppercase tracking-wider">
                            {post.category}
                          </span>
                          {post.service && (
                            <span className="bg-teal-700/90 text-white backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs uppercase tracking-wider">
                              {post.service}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 p-5 sm:p-6 flex flex-col">
                        <div className="flex items-center text-slate-400 dark:text-gray-400 text-xs mb-3 space-x-3">
                          <span className="flex items-center"><CalendarDays size={13} className="mr-1.5 text-teal-600" /> {post.date}</span>
                          <span className="flex items-center"><User size={13} className="mr-1.5 text-teal-600" /> Rédaction CS Zogbo</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-5 flex-1 line-clamp-3 leading-relaxed text-xs sm:text-sm">
                          {post.excerpt}
                        </p>
                        <Link 
                          to={`/blog/${post.id}`} 
                          className="inline-flex items-center text-teal-700 dark:text-teal-400 font-semibold hover:text-teal-800 dark:hover:text-teal-300 mt-auto group/link text-xs sm:text-sm"
                        >
                          Lire l'article complet 
                          <ArrowRight size={15} className="ml-1.5 transform group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col items-center gap-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 md:p-2.5 rounded-xl border border-slate-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Précédent"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      
                      <div className="flex gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl font-bold text-xs md:text-sm transition-all ${
                              currentPage === number
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border border-slate-200/80 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 md:p-2.5 rounded-xl border border-slate-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Suivant"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    <div className="text-center text-xs text-slate-400">
                      Page {currentPage} sur {totalPages}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* État vide */
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700">
                <div className="bg-slate-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  {searchQuery ? <Search size={26} className="text-slate-400"/> : <Newspaper size={26} className="text-slate-400"/>}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {searchQuery ? "Aucun résultat trouvé" : "Aucun article publié"}
                </h3>
                <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  {searchQuery 
                    ? `Nous n'avons trouvé aucun article correspondant à "${searchQuery}". Essayez d'autres mots-clés.`
                    : "Revenez bientôt pour de nouvelles actualités !"
                  }
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-teal-600 dark:text-teal-400 text-xs sm:text-sm font-semibold hover:underline"
                  >
                    Effacer la recherche
                  </button>
                )}
              </div>
            )}
            </>
        )}
      </div>
    </div>
  );
};

export default Blog;
