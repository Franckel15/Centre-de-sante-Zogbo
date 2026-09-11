
import React, { useEffect, useState } from 'react';
import { api, BlogPost } from '../services/api';
import { CalendarDays, ArrowRight, User, Loader2, Search, X, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

const POSTS_PER_PAGE = 10;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Page Header */}
       <div className="bg-teal-800 dark:bg-teal-950 text-white pt-32 pb-16 lg:pt-40 lg:pb-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-teal-900/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
             <Reveal direction="down">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Actualités & Conseils</h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto">
                    Restez informés des dernières nouvelles du centre et de nos conseils santé.
                </p>
             </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={40} />
            </div>
        ) : (
            <>
                {/* Barre de Recherche */}
                <Reveal>
                    <div className="max-w-2xl mx-auto mb-10 md:mb-12 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-12 py-3 md:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full leading-5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm transition-all text-sm md:text-base"
                            placeholder="Rechercher un article, un sujet, un service..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                            >
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                                    <X size={16} />
                                </div>
                            </button>
                        )}
                    </div>
                </Reveal>

                {/* Grille des articles */}
                {filteredPosts.length > 0 ? (
                    <>
                        <div className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {currentPosts.map((post, index) => (
                            <Reveal key={post.id} delay={index * 0.1} width="100%">
                                <article className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-gray-100 dark:border-gray-700 group">
                                <div className="relative h-48 md:h-56 overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-1">
                                        <span className="bg-white/95 backdrop-blur px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold text-teal-700 shadow-sm uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                        {post.service && (
                                            <span className="bg-blue-600/90 backdrop-blur px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold text-white shadow-sm uppercase tracking-wider">
                                                {post.service}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex-1 p-5 md:p-8 flex flex-col">
                                    <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs md:text-sm mb-3 md:mb-4 space-x-4">
                                        <span className="flex items-center"><CalendarDays size={14} className="mr-1.5" /> {post.date}</span>
                                        <span className="flex items-center"><User size={14} className="mr-1.5" /> Admin</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 line-clamp-2 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 flex-1 line-clamp-3 leading-relaxed text-sm md:text-base">
                                        {post.excerpt}
                                    </p>
                                    <Link to={`/blog/${post.id}`} className="inline-flex items-center text-teal-600 dark:text-teal-400 font-bold hover:text-teal-800 dark:hover:text-teal-300 mt-auto group/link text-sm md:text-base">
                                        Lire l'article complet 
                                        <ArrowRight size={18} className="ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                </article>
                            </Reveal>
                        ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <Reveal width="100%">
                                <div className="mt-12 flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 md:p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Précédent"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                            <button
                                                key={number}
                                                onClick={() => paginate(number)}
                                                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg font-bold text-sm md:text-base transition-all ${
                                                    currentPage === number
                                                        ? 'bg-teal-600 text-white shadow-md'
                                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {number}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 md:p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Suivant"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                                <div className="text-center mt-4 text-xs text-gray-400">
                                    Page {currentPage} sur {totalPages}
                                </div>
                            </Reveal>
                        )}
                    </>
                ) : (
                    /* État vide */
                    <Reveal>
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                {searchQuery ? <Search size={30} className="text-gray-400"/> : <Newspaper size={30} className="text-gray-400"/>}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {searchQuery ? "Aucun résultat trouvé" : "Aucun article publié"}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                                {searchQuery 
                                    ? `Nous n'avons trouvé aucun article correspondant à "${searchQuery}". Essayez d'autres mots-clés.`
                                    : "Revenez bientôt pour de nouvelles actualités !"
                                }
                            </p>
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 text-teal-600 dark:text-teal-400 font-bold hover:text-teal-800 dark:hover:text-teal-300 hover:underline"
                                >
                                    Effacer la recherche
                                </button>
                            )}
                        </div>
                    </Reveal>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default Blog;
