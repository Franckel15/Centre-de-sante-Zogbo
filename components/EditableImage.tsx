import React, { useState } from 'react';
import { useEdit } from '../context/EditContext';
import { Edit, Loader2, ImagePlus } from 'lucide-react';

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageKey: string;
}

const EditableImage: React.FC<EditableImageProps> = ({ imageKey, src, className = '', alt, ...props }) => {
  const { isEditMode, isInitialized, getImage, updateImage } = useEdit();
  const [loading, setLoading] = useState(false);
  
  const inputId = `file-upload-${imageKey}`;
  const currentSrc = getImage(imageKey, (src as string) || '');

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
       await updateImage(imageKey, file);
    } catch (error) {
       console.error(error);
       alert("Erreur lors du chargement de l'image.");
    } finally {
       setLoading(false);
       // Reset value to allow selecting the same file again if needed
       e.target.value = '';
    }
  };

  const wrapperClasses = className
    .split(' ')
    .filter(c => 
      c.startsWith('w-') || c.startsWith('h-') || c.startsWith('m-') || c.startsWith('p-') ||
      c.startsWith('rounded') || c.startsWith('aspect') || c === 'block' || c === 'inline-block' ||
      c === 'flex-1' || c === 'w-full' || c === 'h-full' || c.includes('shadow') || c.includes('relative')
    )
    .join(' ');
    
  if (className.includes('hidden')) return null;

  // Tant que la DB n'est pas initialisée, on affiche un squelette
  if (!isInitialized) {
      return (
          <div className={`${wrapperClasses} bg-gray-200 animate-pulse flex items-center justify-center min-h-[100px]`}>
              <Loader2 className="text-gray-300 animate-spin" size={24} />
          </div>
      );
  }

  return (
    <div 
        className={`relative group overflow-hidden ${wrapperClasses} ${isEditMode ? 'ring-4 ring-teal-400 ring-offset-2 z-20' : ''}`}
        style={{ display: className.includes('inline') ? 'inline-block' : undefined }}
    >
      <img 
        key={currentSrc} // Force re-render if source changes
        src={currentSrc} 
        alt={alt} 
        className={`${className} ${isEditMode ? 'opacity-90' : ''} transition-opacity duration-300`}
        {...props} 
      />

      {isEditMode && (
        <>
           <input
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
              disabled={loading}
           />
           
           <div className="absolute top-3 right-3 bg-teal-600 text-white p-2 rounded-full shadow-lg z-30 pointer-events-none animate-bounce">
              {loading ? <Loader2 size={16} className="animate-spin"/> : <Edit size={16} />}
           </div>

           <label
                htmlFor={inputId}
                onClick={(e) => e.stopPropagation()}
                className={`absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-40 transition-all duration-200
                    ${loading ? 'opacity-100 cursor-wait' : 'opacity-0 group-hover:opacity-100'}
                `}
                title="Cliquez pour changer l'image"
           >
                <div className="bg-white text-teal-800 px-6 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-3 transform scale-95 group-hover:scale-100 transition-transform border-2 border-teal-500">
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin text-teal-600" />
                            <span>Importation...</span>
                        </>
                    ) : (
                        <>
                            <ImagePlus size={20} className="text-teal-600" />
                            <span>Changer la photo</span>
                        </>
                    )}
                </div>
           </label>
        </>
      )}
    </div>
  );
};

export default EditableImage;