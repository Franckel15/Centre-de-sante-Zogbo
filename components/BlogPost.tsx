
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, BlogPost as BlogPostType } from '../services/api';
import { CalendarDays, User, ArrowLeft, Loader2, Tag } from 'lucide-react';
import BackToTop from './BackToTop';
import Reveal from './Reveal';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article non trouvé</h2>
        <Link to="/blog" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-bold flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Retour aux actualités
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-4xl mx-auto">
             <Reveal delay={0.2}>
                <div className="flex gap-2 mb-4">
                    <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {post.category}
                    </span>
                    {post.service && (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        {post.service}
                        </span>
                    )}
                </div>
             </Reveal>
             <Reveal delay={0.3}>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 shadow-sm">
                {post.title}
                </h1>
             </Reveal>
             <Reveal delay={0.4}>
                <div className="flex items-center text-gray-200 text-sm font-medium gap-6">
                    <span className="flex items-center"><CalendarDays size={16} className="mr-2" /> {post.date}</span>
                    <span className="flex items-center"><User size={16} className="mr-2" /> Par Admin</span>
                </div>
             </Reveal>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 font-bold mb-8 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour aux articles
        </Link>
        
        <Reveal>
            <article className="prose prose-lg prose-teal dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            {/* Note: In a real app with rich text, we would parse HTML here. 
                Since we use a textarea for excerpt in Admin, we treat it as paragraphs by splitting newlines. */}
            {post.excerpt.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6">{paragraph}</p>
            ))}
            </article>
        </Reveal>
        
        {/* Share / Tags Placeholder */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Tag size={16} />
              <span>Sujets : {post.category}, Santé, {post.service || 'Général'}</span>
           </div>
        </div>
      </div>

      <BackToTop />
    </div>
  );
};

export default BlogPost;
