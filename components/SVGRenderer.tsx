'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SVGRendererProps {
  svgContent: string;
  className?: string;
  title?: string;
}

export default function SVGRenderer({ svgContent, className, title }: SVGRendererProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  // Valider le SVG
  useEffect(() => {
    try {
      // Vérifier que le contenu contient bien une balise SVG
      if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
        setIsValid(false);
        return;
      }

      // Essayer de parser le SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      
      if (parserError) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } catch (error) {
      setIsValid(false);
    }
  }, [svgContent]);

  const handleDownload = () => {
    try {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'diagram'}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading SVG:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying SVG:', error);
    }
  };

  if (isValid === false) {
    return (
      <div className={cn(
        "bg-red-50 border border-red-200 rounded-lg p-4 my-4",
        className
      )}>
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">SVG non valide ou en cours de génération</span>
        </div>
        <details className="mt-2">
          <summary className="text-xs text-red-600 cursor-pointer">Voir le contenu brut</summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
            {svgContent}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 group",
      className
    )}>
      {/* Header avec actions */}
      <div className="flex items-center justify-between mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          {title && (
            <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          )}
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
            SVG Diagram
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2 text-xs"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span className="ml-1">{copied ? 'Copié' : 'Copier'}</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="h-7 px-2 text-xs"
          >
            <Download className="w-3 h-3" />
            <span className="ml-1">Télécharger</span>
          </Button>
        </div>
      </div>

      {/* Contenu SVG */}
      <div 
        ref={svgRef}
        className="svg-container max-w-full overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {/* Styles pour le SVG haute précision */}
      <style jsx>{`
        .svg-container svg {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          /* Haute précision - pas de lissage qui pourrait déformer */
          shape-rendering: geometricPrecision;
          text-rendering: geometricPrecision;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        
        .svg-container svg:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: box-shadow 0.2s ease;
        }
        
        /* Responsive adjustments avec préservation de la précision */
        @media (max-width: 640px) {
          .svg-container svg {
            max-width: 100%;
            min-width: 320px;
            /* Forcer la précision même sur mobile */
            shape-rendering: geometricPrecision;
          }
        }
        
        /* Styles haute précision pour les éléments critiques */
        .svg-container svg line,
        .svg-container svg path,
        .svg-container svg polyline,
        .svg-container svg polygon {
          shape-rendering: geometricPrecision;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        
        .svg-container svg text {
          text-rendering: geometricPrecision;
          font-smooth: never;
          -webkit-font-smoothing: none;
        }
        
        /* Grille de référence pour la précision (optionnelle) */
        .svg-container svg .precision-grid {
          opacity: 0.1;
          stroke: #ccc;
          stroke-width: 0.5;
        }
        
        /* Animation pour les éléments SVG interactifs - sans déformation */
        .svg-container svg * {
          transition: opacity 0.2s ease, fill 0.2s ease, stroke 0.2s ease;
          /* Pas de transition sur transform pour éviter les déformations */
        }
      `}</style>
    </div>
  );
}

// Fonction utilitaire pour extraire les SVG du contenu
export function extractSVGFromContent(content: string): string[] {
  const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/gi;
  const matches = content.match(svgRegex);
  return matches || [];
}

// Fonction utilitaire pour nettoyer le contenu en supprimant les SVG
export function removeSVGFromContent(content: string): string {
  const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/gi;
  return content.replace(svgRegex, '').trim();
}
