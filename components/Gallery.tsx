
import React, { useState, useEffect } from 'react';
import { api, VideoResource, GalleryImage } from '../services/api';
import { Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import BackToTop from './BackToTop';
import Reveal from './Reveal';

const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          try {
              const [videosData, imagesData] = await Promise.all([
                  api.videos.getAll(),
                  api.gallery.getAll()
              ]);
              setVideos(videosData);
              setImages(imagesData);
          } catch (e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      };
      fetchData();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Page Header */}
      <div className="bg-slate-900 dark:bg-black text-white pt-28 pb-14 lg:pt-36 lg:pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Projet conceptuel de démonstration
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
            Espace Multimédia & Galerie
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Visite visuelle des installations et séquences d'information sanitaire du centre.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20 relative z-10">
        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-xs border border-slate-200/80 dark:border-gray-700 inline-flex">
            <button 
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'photos' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon size={18}/> Photos
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'videos' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video size={18}/> Vidéos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={36}/>
          </div>
        ) : activeTab === 'photos' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {images.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700">
                <ImageIcon size={36} className="mx-auto text-slate-300 dark:text-gray-600 mb-3"/>
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Aucune photo disponible pour le moment.</p>
              </div>
            ) : images.map((image) => (
              <div 
                key={image.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-gray-700 shadow-xs aspect-[4/3] bg-slate-100 dark:bg-gray-800"
              >
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                    {image.category}
                  </span>
                  <h3 className="text-white text-base font-bold">{image.caption}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {videos.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/80 dark:border-gray-700">
                <Video size={36} className="mx-auto text-slate-300 dark:text-gray-600 mb-3"/>
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Aucune vidéo disponible pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {videos.map((video) => (
                  <div 
                    key={video.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-gray-700 shadow-xs"
                  >
                    <div className="aspect-video bg-black relative">
                      <video controls className="w-full h-full" src={video.url}></video>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{video.title}</h3>
                      <p className="text-xs text-teal-700 dark:text-teal-400 uppercase tracking-wider font-semibold">{video.category || 'Général'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <BackToTop />
    </div>
  );
};

export default Gallery;
