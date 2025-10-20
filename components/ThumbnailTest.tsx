// Test component pour vérifier les thumbnails
import React from 'react';
import AviationThumbnail from '@/components/AviationThumbnail';

const ThumbnailTest = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Test des Thumbnails</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Test 1: Image normale (devrait fonctionner)</h3>
        <AviationThumbnail 
          src="https://via.placeholder.com/100x100/0066CC/FFFFFF?text=Test"
          alt="Image de test"
          title="Image de test"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Test 2: Asset aviation (devrait afficher placeholder)</h3>
        <AviationThumbnail 
          src="http://localhost:8000/api/aviation-assets/asset/nonexistent"
          alt="Asset aviation inexistant"
          title="Asset aviation inexistant"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Test 3: URL invalide (devrait afficher placeholder)</h3>
        <AviationThumbnail 
          src="https://invalid-url-that-does-not-exist.com/image.jpg"
          alt="URL invalide"
          title="URL invalide"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Test 4: Pas de src (devrait afficher placeholder)</h3>
        <AviationThumbnail 
          src=""
          alt="Pas de src"
          title="Pas de src"
        />
      </div>
    </div>
  );
};

export default ThumbnailTest;
