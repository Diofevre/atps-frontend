'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import SVGRenderer from '@/components/SVGRenderer';
import { precisionSVGTemplates, generatePreciseCurve } from '@/lib/precision-svg-templates';

// Exemples de SVG d'aviation haute précision
const aviationSVGExamples = {
  performanceCurve: {
    title: "Courbe Thrust vs Drag Précise",
    svg: precisionSVGTemplates.performanceCurve.generate({
      thrustPoints: [
        {x: 50, y: 200}, {x: 100, y: 180}, {x: 150, y: 160}, 
        {x: 200, y: 150}, {x: 250, y: 145}, {x: 300, y: 140}
      ],
      dragPoints: [
        {x: 50, y: 80}, {x: 100, y: 90}, {x: 150, y: 110}, 
        {x: 200, y: 140}, {x: 250, y: 180}, {x: 300, y: 230}
      ],
      intersection: {x: 200, y: 145},
      xAxis: {min: 50, max: 300, label: "Vitesse (kts)"},
      yAxis: {min: 50, max: 250, label: "Force (N)"}
    })
  },

  workflow: {
    title: "Workflow Décollage Précise",
    svg: precisionSVGTemplates.workflow.generate({
      steps: [
        {id: 'start', label: 'Début', x: 100, y: 100, type: 'start'},
        {id: 'check', label: 'Checklist', x: 250, y: 100, type: 'process'},
        {id: 'weather', label: 'Météo OK?', x: 400, y: 100, type: 'decision'},
        {id: 'taxi', label: 'Taxi', x: 400, y: 200, type: 'process'},
        {id: 'takeoff', label: 'Décollage', x: 400, y: 300, type: 'process'},
        {id: 'end', label: 'En vol', x: 550, y: 300, type: 'end'}
      ],
      connections: [
        {from: 'start', to: 'check'},
        {from: 'check', to: 'weather'},
        {from: 'weather', to: 'taxi', label: 'Oui'},
        {from: 'taxi', to: 'takeoff'},
        {from: 'takeoff', to: 'end'}
      ]
    })
  },

  systemDiagram: {
    title: "Système Hydraulique Précise",
    svg: precisionSVGTemplates.systemDiagram.generate({
      components: [
        {id: 'tank', label: 'Réservoir', x: 150, y: 150, width: 80, height: 60, type: 'tank'},
        {id: 'pump', label: 'Pompe', x: 300, y: 150, width: 60, height: 60, type: 'pump'},
        {id: 'valve1', label: 'Vanne 1', x: 450, y: 100, width: 40, height: 40, type: 'valve'},
        {id: 'valve2', label: 'Vanne 2', x: 450, y: 200, width: 40, height: 40, type: 'valve'},
        {id: 'actuator', label: 'Actionneur', x: 600, y: 150, width: 80, height: 60, type: 'component'}
      ],
      pipes: [
        {from: 'tank', to: 'pump', pressure: 2.5, flow: '5 L/min'},
        {from: 'pump', to: 'valve1', pressure: 15.0, flow: '5 L/min'},
        {from: 'pump', to: 'valve2', pressure: 15.0, flow: '5 L/min'},
        {from: 'valve1', to: 'actuator', pressure: 12.0, flow: '3 L/min'},
        {from: 'valve2', to: 'actuator', pressure: 12.0, flow: '2 L/min'}
      ]
    })
  },

  vor: {
    title: "Station VOR Haute Précision",
    svg: `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <defs>
        <pattern id="vorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
        </pattern>
        <radialGradient id="vorGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#dbeafe;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
        </radialGradient>
      </defs>
      
      <!-- Background avec grille de précision -->
      <rect width="400" height="300" fill="url(#vorGrid)" opacity="0.1"/>
      
      <!-- Cercle principal VOR avec coordonnées exactes -->
      <circle cx="200" cy="150" r="80" fill="url(#vorGradient)" stroke="#2563eb" stroke-width="3" shape-rendering="geometricPrecision"/>
      
      <!-- Directions cardinales avec positions précises -->
      <line x1="200" y1="70" x2="200" y2="230" stroke="#dc2626" stroke-width="3" shape-rendering="geometricPrecision"/>
      <line x1="120" y1="150" x2="280" y2="150" stroke="#dc2626" stroke-width="3" shape-rendering="geometricPrecision"/>
      
      <!-- Centre VOR précis -->
      <circle cx="200" cy="150" r="8" fill="#dc2626" shape-rendering="geometricPrecision"/>
      
      <!-- Labels avec positions exactes -->
      <text x="205" y="65" font-family="Arial" font-size="14" font-weight="bold" fill="#374151" text-anchor="middle" text-rendering="geometricPrecision">N</text>
      <text x="205" y="240" font-family="Arial" font-size="14" font-weight="bold" fill="#374151" text-anchor="middle" text-rendering="geometricPrecision">S</text>
      <text x="115" y="155" font-family="Arial" font-size="14" font-weight="bold" fill="#374151" text-anchor="middle" text-rendering="geometricPrecision">W</text>
      <text x="285" y="155" font-family="Arial" font-size="14" font-weight="bold" fill="#374151" text-anchor="middle" text-rendering="geometricPrecision">E</text>
      
      <!-- Titre VOR -->
      <text x="200" y="180" font-family="Arial" font-size="16" font-weight="bold" fill="#1f2937" text-anchor="middle" text-rendering="geometricPrecision">VOR</text>
      
      <!-- Fréquence avec position précise -->
      <text x="200" y="200" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle" text-rendering="geometricPrecision">108.5 MHz</text>
      
      <!-- Indicateurs de précision -->
      <circle cx="200" cy="150" r="60" fill="none" stroke="#10b981" stroke-width="1" stroke-dasharray="5,5" opacity="0.5" shape-rendering="geometricPrecision"/>
      <circle cx="200" cy="150" r="40" fill="none" stroke="#10b981" stroke-width="1" stroke-dasharray="3,3" opacity="0.3" shape-rendering="geometricPrecision"/>
    </svg>`
  }
};

export default function SVGDemo() {
  const [selectedExample, setSelectedExample] = useState<keyof typeof aviationSVGExamples>('performanceCurve');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Visualiseur SVG Haute Précision pour l'Aviation
        </h1>
        <p className="text-gray-600">
          Diagrammes SVG avec coordonnées exactes, courbes mathématiques précises et workflows sans superposition
        </p>
      </div>

      {/* Sélecteur d'exemples */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(aviationSVGExamples).map((key) => (
          <Button
            key={key}
            variant={selectedExample === key ? "default" : "outline"}
            onClick={() => setSelectedExample(key as keyof typeof aviationSVGExamples)}
            className={selectedExample === key ? "bg-[#EECE84] hover:bg-[#EECE84]/90" : ""}
          >
            {aviationSVGExamples[key as keyof typeof aviationSVGExamples].title}
          </Button>
        ))}
      </div>

      {/* Affichage du SVG sélectionné */}
      <div className="flex justify-center">
        <SVGRenderer
          svgContent={aviationSVGExamples[selectedExample].svg}
          title={aviationSVGExamples[selectedExample].title}
          className="max-w-full"
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Caractéristiques de précision :</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
          <li><strong>Coordonnées exactes</strong> : Tous les éléments utilisent des positions calculées mathématiquement</li>
          <li><strong>Courbes précises</strong> : Courbes de Bézier avec contrôle précis pour les courbes de performance</li>
          <li><strong>Workflows sans superposition</strong> : Positions calculées pour éviter les chevauchements</li>
          <li><strong>Grilles de référence</strong> : Grilles de précision pour l'alignement parfait</li>
          <li><strong>Rendu géométrique</strong> : shape-rendering="geometricPrecision" pour éviter le lissage</li>
        </ul>
        
        <div className="mt-3 p-3 bg-white rounded border">
          <p className="text-sm font-medium text-gray-700 mb-1">Exemple de prompt haute précision :</p>
          <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            "Crée un diagramme SVG précis d'une courbe thrust vs drag avec coordonnées exactes et point d'intersection calculé"
          </code>
        </div>
      </div>
    </div>
  );
}
