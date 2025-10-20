'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AviationThumbnailProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

const AviationThumbnail: React.FC<AviationThumbnailProps> = ({ 
  src, 
  alt, 
  title, 
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  // Si c'est une URL d'asset aviation, utiliser un iframe ou object pour SVG
  const isAviationAsset = src.includes('/api/aviation-assets/asset/');

  // Gérer les erreurs d'image de manière plus robuste
  if (imageError || !src || src === '/placeholder-image.png') {
    return (
      <div className={`inline-block bg-gray-100 border border-gray-300 rounded-lg p-2 ${className}`}>
        <div className="w-24 h-24 flex items-center justify-center text-gray-500 text-xs">
          <Image
            src="/placeholder-image.svg"
            alt="Image non disponible"
            width={88}
            height={88}
            className="object-contain rounded"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail */}
      <div 
        className={`inline-block cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Ouvrir ${alt} en grand`}
      >
        {isAviationAsset ? (
          // Pour les assets aviation SVG, utiliser un conteneur avec background
          <div className="w-24 h-24 bg-white border border-gray-300 rounded-lg p-1 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <object
              data={src}
              type="image/svg+xml"
              className="w-full h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onError={() => {
                console.log('Asset aviation non trouvé:', src);
                setImageError(true);
              }}
            >
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                <div className="text-center">
                  <div className="text-lg mb-1">✈️</div>
                  <div>Asset aviation</div>
                </div>
              </div>
            </object>
          </div>
        ) : (
          // Pour les autres images
          <div className="w-24 h-24 bg-white border border-gray-300 rounded-lg p-1 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <Image
              src={src}
              alt={alt}
              width={88}
              height={88}
              className="object-contain rounded max-w-full max-h-full"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        {/* Titre optionnel */}
        {title && (
          <div className="text-xs text-gray-600 mt-1 text-center max-w-24 truncate">
            {title}
          </div>
        )}
      </div>

      {/* Modal d'expansion */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {title || alt}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            {/* Image agrandie */}
            <div className="flex justify-center">
              {isAviationAsset ? (
                <object
                  data={src}
                  type="image/svg+xml"
                  className="max-w-full max-h-96"
                >
                  <div className="w-96 h-96 bg-gray-100 flex items-center justify-center text-gray-500">
                    SVG non disponible
                  </div>
                </object>
              ) : (
                <Image
                  src={src}
                  alt={alt}
                  width={400}
                  height={400}
                  className="max-w-full max-h-96 object-contain"
                />
              )}
            </div>

            {/* Footer avec informations */}
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Cliquez en dehors de l'image ou appuyez sur Échap pour fermer</p>
              {isAviationAsset && (
                <p className="mt-2">
                  <a 
                    href={src} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Ouvrir l'image dans un nouvel onglet
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AviationThumbnail;
