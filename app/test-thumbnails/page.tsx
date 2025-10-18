import React from 'react';
import AviationThumbnail from '@/components/AviationThumbnail';

const TestAviationThumbnail = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Test Aviation Thumbnails</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">VOR Standard</h2>
          <AviationThumbnail 
            src="http://localhost:8000/api/aviation-assets/asset/navaid.vor.std"
            alt="VOR Standard"
            title="VOR Standard"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Altimètre</h2>
          <AviationThumbnail 
            src="http://localhost:8000/api/aviation-assets/asset/instr.altimeter.std"
            alt="Altimètre"
            title="Altimètre Standard"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">DME</h2>
          <AviationThumbnail 
            src="http://localhost:8000/api/aviation-assets/asset/navaid.dme.std"
            alt="DME Standard"
            title="DME Standard"
          />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions de test :</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Cliquez sur chaque thumbnail pour l'ouvrir en grand</li>
          <li>Appuyez sur Échap pour fermer le modal</li>
          <li>Cliquez en dehors du modal pour le fermer</li>
          <li>Vérifiez que les images SVG s'affichent correctement</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAviationThumbnail;
