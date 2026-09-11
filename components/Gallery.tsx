
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Page Header */}
       <div className="bg-teal-800 dark:bg-teal-950 text-white pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <Reveal direction="down">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Notre Galerie</h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-teal-100 text-xl max-w-2xl mx-auto">
                    Visitez nos locaux en images et découvrez nos vidéos exclusives.
                </p>
             </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
            <Reveal>
                <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 inline-flex">
                    <button 
                        onClick={() => setActiveTab('photos')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'photos' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <ImageIcon size={20}/> Photos
                    </button>
                    <button 
                        onClick={() => setActiveTab('videos')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'videos' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Video size={20}/> Vidéos
                    </button>
                </div>
            </Reveal>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={40}/>
            </div>
        ) : activeTab === 'photos' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.length === 0 ? (
                <div className="col-span-full text-center py-20">
                     <ImageIcon size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4"/>
                     <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune photo disponible pour le moment.</p>
                </div>
            ) : images.map((image, index) => (
                <Reveal key={image.id} delay={index * 0.1} width="100%">
                    <div className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer aspect-[4/3] bg-gray-200 dark:bg-gray-800">
                    <img
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                        <span className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
                        {image.category}
                        </span>
                        <h3 className="text-white text-xl font-bold">{image.caption}</h3>
                    </div>
                    </div>
                </Reveal>
            ))}
            </div>
        ) : (
            <div>
                {videos.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <Video size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4"/>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune vidéo disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {videos.map((video, index) => (
                            <Reveal key={video.id} delay={index * 0.1} width="100%">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                                    <div className="aspect-video bg-black relative">
                                        <video controls className="w-full h-full" src={video.url}></video>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{video.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">{video.category || 'Général'}</p>
                                    </div>
                                </div>
                            </Reveal>
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
