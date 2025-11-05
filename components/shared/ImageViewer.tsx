/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCw, Move, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageViewerProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

interface Point {
  id: string;
  x: number;
  y: number;
}

interface Line {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface Circle {
  id: string;
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
}

interface AngleAnnotation {
  id: string;
  vertexX: number;
  vertexY: number;
  valueDeg: number;
  line1Id: string;
  line2Id: string;
}

interface DistanceAnnotation {
  id: string;
  midX: number;
  midY: number;
  distance: number;
  lineId: string;
}

type AnnotationType = 'point' | 'line' | 'circle' | 'angle' | 'distance';

const ImageViewer: React.FC<ImageViewerProps> = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [modalSize, setModalSize] = useState({ width: 800, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Touch events states
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  
  // Tool states
  const [activeTool, setActiveTool] = useState<'none' | 'point' | 'line' | 'circle' | 'perpendicular' | 'angle' | 'ruler'>('none');
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [annotationHistory, setAnnotationHistory] = useState<{ type: AnnotationType; id: string }[]>([]);
  
  // Drawing states
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStart, setLineStart] = useState<{ x: number; y: number } | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  
  // Circle drawing state
  const [isDrawingCircle, setIsDrawingCircle] = useState(false);
  const [circleStart, setCircleStart] = useState<{ x: number; y: number } | null>(null);
  
  // Perpendicular line state
  const [lastPerpendicularEnd, setLastPerpendicularEnd] = useState<{ x: number; y: number } | null>(null);
  const [lastPerpendicularVector, setLastPerpendicularVector] = useState<{ dx: number; dy: number } | null>(null);
  
  // Angle state
  const [lastAngleEnd, setLastAngleEnd] = useState<{ x: number; y: number } | null>(null);
  const [lastAngleVector, setLastAngleVector] = useState<{ dx: number; dy: number } | null>(null);
  const [currentAngle, setCurrentAngle] = useState<number | null>(null);
  const [angleFirstLine, setAngleFirstLine] = useState<Line | null>(null);
  const [isAngleLocked, setIsAngleLocked] = useState(false);
  const [angleAnnotations, setAngleAnnotations] = useState<AngleAnnotation[]>([]);
  
  // Ruler (distance) state
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [distanceAnnotations, setDistanceAnnotations] = useState<DistanceAnnotation[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setModalPosition({ x: 0, y: 0 });
      setModalSize({ width: 800, height: 600 });
      setPoints([]); // Réinitialiser les annotations
      setLines([]); // Réinitialiser les lignes
      setCircles([]); // Réinitialiser les cercles
      setAnnotationHistory([]); // Réinitialiser l'historique
      setActiveTool('none'); // Désactiver les outils
      setIsDrawingLine(false); // Réinitialiser l'état de dessin ligne
      setIsDrawingCircle(false); // Réinitialiser l'état de dessin cercle
      setLineStart(null); // Réinitialiser le point de départ ligne
      setCircleStart(null); // Réinitialiser le point de départ cercle
      setMousePosition(null); // Réinitialiser la position de la souris
      setHasMoved(false); // Réinitialiser le mouvement
      setLastPerpendicularEnd(null); // Réinitialiser perpendiculaire
      setLastPerpendicularVector(null); // Réinitialiser vecteur perpendiculaire
      setLastAngleEnd(null); // Réinitialiser angle
      setLastAngleVector(null); // Réinitialiser vecteur angle
      setCurrentAngle(null); // Réinitialiser angle courant
      setAngleFirstLine(null); // Réinitialiser première ligne angle
      setIsAngleLocked(false); // Réinitialiser verrouillage angle
      setAngleAnnotations([]); // Réinitialiser annotations d'angle
      setCurrentDistance(null); // Réinitialiser distance courante
      setDistanceAnnotations([]); // Réinitialiser annotations de distance
    } else {
      document.body.style.overflow = 'unset';
      setPoints([]); // Réinitialiser les annotations à la fermeture
      setLines([]); // Réinitialiser les lignes à la fermeture
      setCircles([]); // Réinitialiser les cercles à la fermeture
      setAnnotationHistory([]); // Réinitialiser l'historique à la fermeture
      setActiveTool('none'); // Désactiver les outils à la fermeture
      setIsDrawingLine(false); // Réinitialiser l'état de dessin ligne
      setIsDrawingCircle(false); // Réinitialiser l'état de dessin cercle
      setLineStart(null); // Réinitialiser le point de départ ligne
      setCircleStart(null); // Réinitialiser le point de départ cercle
      setMousePosition(null); // Réinitialiser la position de la souris
      setHasMoved(false); // Réinitialiser le mouvement
      setLastPerpendicularEnd(null); // Réinitialiser perpendiculaire
      setLastPerpendicularVector(null); // Réinitialiser vecteur perpendiculaire
      setLastAngleEnd(null); // Réinitialiser angle
      setLastAngleVector(null); // Réinitialiser vecteur angle
      setCurrentAngle(null); // Réinitialiser angle courant
      setAngleFirstLine(null); // Réinitialiser première ligne angle
      setIsAngleLocked(false); // Réinitialiser verrouillage angle
      setAngleAnnotations([]); // Réinitialiser annotations d'angle
      setCurrentDistance(null); // Réinitialiser distance courante
      setDistanceAnnotations([]); // Réinitialiser annotations de distance
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);


  // Gérer le changement d'outil et nettoyer les dessins non terminés
  useEffect(() => {
    // Nettoyer les dessins en cours pour l'outil précédent
    
    // Ligne simple non terminée
    if (activeTool !== 'line' && isDrawingLine && !lastPerpendicularEnd && !lastAngleEnd && !angleFirstLine) {
      setIsDrawingLine(false);
      setLineStart(null);
      setMousePosition(null);
      setHasMoved(false);
    }
    
    // Cercle non terminé
    if (activeTool !== 'circle' && isDrawingCircle) {
      setIsDrawingCircle(false);
      setCircleStart(null);
    }
    
    // Perpendiculaire non terminée
    if (activeTool !== 'perpendicular' && lastPerpendicularEnd) {
      // Annuler la dernière ligne perpendiculaire créée (non terminée)
      if (annotationHistory.length > 0) {
        const lastAnnotation = annotationHistory[annotationHistory.length - 1];
        if (lastAnnotation.type === 'line') {
          setLines(prev => prev.filter(l => l.id !== lastAnnotation.id));
          setAnnotationHistory(prev => prev.slice(0, -1));
        }
      }
      // Réinitialiser les états perpendiculaires
      setLastPerpendicularEnd(null);
      setLastPerpendicularVector(null);
      setLineStart(null);
      setMousePosition(null);
      setIsDrawingLine(false);
      setHasMoved(false);
    }
    
    // Angle non verrouillé
    if (activeTool !== 'angle' && (lastAngleEnd || angleFirstLine)) {
      // Si angle non verrouillé, annuler TOUTES les lignes d'angle créées
      if (!isAngleLocked && angleFirstLine) {
        // Supprimer toutes les lignes de l'angle (première et deuxième si elle existe)
        setLines(prev => prev.filter(l => l.id !== angleFirstLine.id));
        setAnnotationHistory(prev => prev.filter(ann => ann.id !== angleFirstLine.id));
        
        // Si on est en train de dessiner la deuxième ligne, ne rien supprimer de plus
        // car elle n'a pas encore été ajoutée
      }
      // Réinitialiser les états angle
      setLastAngleEnd(null);
      setLastAngleVector(null);
      setCurrentAngle(null);
      setLineStart(null);
      setMousePosition(null);
      setIsDrawingLine(false);
      setHasMoved(false);
      if (!isAngleLocked) {
        setAngleFirstLine(null);
      }
      setIsAngleLocked(false);
    }
    
    // Ruler (distance) non terminée
    if (activeTool !== 'ruler' && isDrawingLine && lineStart && !lastPerpendicularEnd && !lastAngleEnd && !angleFirstLine) {
      setIsDrawingLine(false);
      setLineStart(null);
      setMousePosition(null);
      setCurrentDistance(null);
      setHasMoved(false);
    }
  }, [activeTool]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => prev + 90);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Ne pas activer le drag si on utilise un outil
    if (activeTool !== 'none') return;
    
    // Toujours activer le drag, même au zoom 100%
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    
    // Gestion du mouvement pour les lignes et cercles
    if (activeTool === 'line' && isDrawingLine) {
      const coords = getImageCoordinates(e);
      if (coords && lineStart) {
        // Vérifier si l'utilisateur a bougé suffisamment
        const distance = Math.sqrt(
          Math.pow(coords.x - lineStart.x, 2) + Math.pow(coords.y - lineStart.y, 2)
        );
        
        if (distance > 5) { // Seuil de 5 pixels
          setHasMoved(true);
        }
        
        setMousePosition(coords);
      }
    } else if (activeTool === 'circle' && isDrawingCircle) {
      const coords = getImageCoordinates(e);
      if (coords) {
        setMousePosition(coords);
      }
    } else if (activeTool === 'perpendicular' && lineStart) {
      const coords = getImageCoordinates(e);
      if (coords) {
        // Si on est en train de dessiner après la première ligne (perpendiculaire contrainte)
        if (lastPerpendicularVector && lastPerpendicularEnd) {
          // Calculer la projection du point sur la ligne perpendiculaire
          const dx = coords.x - lineStart.x;
          const dy = coords.y - lineStart.y;
          
          // Calculer la projection sur le vecteur perpendiculaire
          const projection = dx * lastPerpendicularVector.dx + dy * lastPerpendicularVector.dy;
          
          // Contraindre le point sur la ligne perpendiculaire
          const constrainedX = lineStart.x + projection * lastPerpendicularVector.dx;
          const constrainedY = lineStart.y + projection * lastPerpendicularVector.dy;
          
          setMousePosition({ x: constrainedX, y: constrainedY });
        } else {
          // Première ligne : pas de contrainte
          setMousePosition(coords);
        }
      }
    } else if (activeTool === 'angle' && lineStart) {
      const coords = getImageCoordinates(e);
      if (coords) {
        setMousePosition(coords);
        
        // Si on est en train de dessiner après la première ligne, calculer l'angle
        if (lastAngleVector && lastAngleEnd) {
          const dx = coords.x - lineStart.x;
          const dy = coords.y - lineStart.y;
          
          // Calculer l'angle entre les deux vecteurs
          const dotProduct = dx * lastAngleVector.dx + dy * lastAngleVector.dy;
          const magnitude = Math.sqrt(dx * dx + dy * dy);
          
          if (magnitude > 0) {
            const cosAngle = dotProduct / magnitude;
            const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
            const angleDeg = (angleRad * 180) / Math.PI;
            setCurrentAngle(Math.round(angleDeg));
          }
        }
      }
    } else if (activeTool === 'ruler' && lineStart) {
      const coords = getImageCoordinates(e);
      if (coords) {
        setMousePosition(coords);
        
        // Calculer la distance en temps réel (en cm)
        const dx = coords.x - lineStart.x;
        const dy = coords.y - lineStart.y;
        const distancePx = Math.sqrt(dx * dx + dy * dy);
        // Conversion approximative : 96 DPI standard = 37.8 pixels/cm
        const distanceCm = distancePx / 37.8;
        setCurrentDistance(Math.round(distanceCm * 10) / 10); // Arrondi à 1 décimale
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Désactivé : le scroll sert maintenant à naviguer dans l'image, pas à zoomer
  // const handleWheel = (e: React.WheelEvent) => {
  //   e.preventDefault();
  //   const delta = e.deltaY > 0 ? 0.9 : 1.1;
  //   setScale(prev => Math.max(0.1, Math.min(10, prev * delta))); // Zoom de 10% à 1000%
  // };

  // Fonction pour obtenir les coordonnées précises sur l'image (mouse)
  const getImageCoordinates = (e: React.MouseEvent) => {
    if (!imageRef.current) return null;

    const imageRect = imageRef.current.getBoundingClientRect();
    
    // Position de la souris relative à l'image
    const mouseX = e.clientX - imageRect.left;
    const mouseY = e.clientY - imageRect.top;
    
    // Dimensions de l'image
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;
    const displayWidth = imageRect.width;
    const displayHeight = imageRect.height;
    
    // Vérifier si le clic est dans les limites de l'image
    if (mouseX < 0 || mouseX > displayWidth || mouseY < 0 || mouseY > displayHeight) {
      return null;
    }
    
    // Convertir les coordonnées de l'affichage vers les coordonnées de l'image originale
    const normalizedX = mouseX / displayWidth;
    const normalizedY = mouseY / displayHeight;
    
    const finalX = normalizedX * imageWidth;
    const finalY = normalizedY * imageHeight;
    
    return { x: finalX, y: finalY };
  };

  // Fonction pour obtenir les coordonnées précises sur l'image (touch)
  const getImageCoordinatesTouch = (touch: React.Touch) => {
    if (!imageRef.current) return null;

    const imageRect = imageRef.current.getBoundingClientRect();
    
    // Position du touch relative à l'image
    const touchX = touch.clientX - imageRect.left;
    const touchY = touch.clientY - imageRect.top;
    
    // Dimensions de l'image
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;
    const displayWidth = imageRect.width;
    const displayHeight = imageRect.height;
    
    // Vérifier si le touch est dans les limites de l'image
    if (touchX < 0 || touchX > displayWidth || touchY < 0 || touchY > displayHeight) {
      return null;
    }
    
    // Convertir les coordonnées de l'affichage vers les coordonnées de l'image originale
    const normalizedX = touchX / displayWidth;
    const normalizedY = touchY / displayHeight;
    
    const finalX = normalizedX * imageWidth;
    const finalY = normalizedY * imageHeight;
    
    return { x: finalX, y: finalY };
  };

  // Gestion des événements tactiles pour le drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeTool !== 'none') return;
    
    if (e.touches.length === 1) {
      // Un seul doigt : drag
      const touch = e.touches[0];
      setIsDragging(true);
      setTouchStart({ x: touch.clientX, y: touch.clientY });
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    } else if (e.touches.length === 2) {
      // Deux doigts : pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && touchStart) {
      // Un seul doigt : drag continu
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && initialDistance) {
      // Deux doigts : zoom par pincement
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scaleChange = distance / initialDistance;
      setScale(prev => Math.max(0.5, Math.min(5, prev * scaleChange)));
      setInitialDistance(distance);
    }
    
    // Gestion des outils avec touch
    if (activeTool !== 'none' && e.touches.length === 1) {
      const touch = e.touches[0];
      const coords = getImageCoordinatesTouch(touch);
      if (!coords) return;
      
      // Simuler les événements de souris pour les outils
      const syntheticEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => {}
      } as any;
      
      if (activeTool === 'line' && isDrawingLine && lineStart) {
        setMousePosition(coords);
        const distance = Math.sqrt(
          Math.pow(coords.x - lineStart.x, 2) + Math.pow(coords.y - lineStart.y, 2)
        );
        if (distance > 5) {
          setHasMoved(true);
        }
      } else if (activeTool === 'circle' && isDrawingCircle) {
        setMousePosition(coords);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setTouchStart(null);
      setInitialDistance(null);
    }
    
    // Gestion du clic pour les outils
    if (e.changedTouches.length === 1 && activeTool !== 'none') {
      const touch = e.changedTouches[0];
      const coords = getImageCoordinatesTouch(touch);
      if (coords) {
        // Simuler un clic de souris
        const syntheticEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => {}
        } as any;
        handleImageClick(syntheticEvent as any);
      }
    }
  };

  // Gestion du clic pour placer un point ou dessiner une ligne/cercle
  const handleImageClick = (e: React.MouseEvent) => {
    const coords = getImageCoordinates(e);
    if (!coords) return;

    if (activeTool === 'point') {
      const newPoint: Point = {
        id: `point-${Date.now()}`,
        x: coords.x,
        y: coords.y
      };
      setPoints(prev => [...prev, newPoint]);
      setAnnotationHistory(prev => [...prev, { type: 'point', id: newPoint.id }]);
    } else if (activeTool === 'circle') {
      if (!isDrawingCircle) {
        // Premier clic : commencer le cercle
        setCircleStart({ x: coords.x, y: coords.y });
        setIsDrawingCircle(true);
      } else {
        // Deuxième clic : finir le cercle
        if (circleStart) {
          const radiusX = Math.abs(coords.x - circleStart.x);
          const radiusY = Math.abs(coords.y - circleStart.y);
          
          const newCircle: Circle = {
            id: `circle-${Date.now()}`,
            centerX: circleStart.x,
            centerY: circleStart.y,
            radiusX,
            radiusY
          };
          setCircles(prev => [...prev, newCircle]);
          setAnnotationHistory(prev => [...prev, { type: 'circle', id: newCircle.id }]);
          setIsDrawingCircle(false);
          setCircleStart(null);
        }
      }
    } else if (activeTool === 'line') {
      if (!isDrawingLine) {
        // Premier clic : commencer la ligne (comme un point)
        setLineStart({ x: coords.x, y: coords.y });
        setMousePosition({ x: coords.x, y: coords.y });
        setIsDrawingLine(true);
        setHasMoved(false);
      } else {
        // Deuxième clic : finir la ligne ou créer un point
        if (lineStart) {
          if (hasMoved) {
            // Si l'utilisateur a bougé, créer une ligne
            const newLine: Line = {
              id: `line-${Date.now()}`,
              startX: lineStart.x,
              startY: lineStart.y,
              endX: coords.x,
              endY: coords.y
            };
            setLines(prev => [...prev, newLine]);
            setAnnotationHistory(prev => [...prev, { type: 'line', id: newLine.id }]);
          } else {
            // Si l'utilisateur n'a pas bougé, créer un point
            const newPoint: Point = {
              id: `point-${Date.now()}`,
              x: lineStart.x,
              y: lineStart.y
            };
            setPoints(prev => [...prev, newPoint]);
            setAnnotationHistory(prev => [...prev, { type: 'point', id: newPoint.id }]);
          }
          setIsDrawingLine(false);
          setLineStart(null);
          setMousePosition(null);
          setHasMoved(false);
        }
      }
    } else if (activeTool === 'perpendicular') {
      if (!isDrawingLine) {
        // Premier clic : commencer la première ligne
        setLineStart({ x: coords.x, y: coords.y });
        setMousePosition({ x: coords.x, y: coords.y });
        setIsDrawingLine(true);
        setHasMoved(false);
      } else {
        // Deuxième clic et suivants : créer la ligne et préparer la perpendiculaire
        if (lineStart) {
          // Si on a un vecteur perpendiculaire, contraindre le point final
          let finalX = coords.x;
          let finalY = coords.y;
          
          if (lastPerpendicularVector && lastPerpendicularEnd) {
            // Calculer la projection pour contraindre sur la perpendiculaire
            const dx = coords.x - lineStart.x;
            const dy = coords.y - lineStart.y;
            const projection = dx * lastPerpendicularVector.dx + dy * lastPerpendicularVector.dy;
            
            finalX = lineStart.x + projection * lastPerpendicularVector.dx;
            finalY = lineStart.y + projection * lastPerpendicularVector.dy;
          }
          
          // Créer la ligne
          const newLine: Line = {
            id: `line-${Date.now()}`,
            startX: lineStart.x,
            startY: lineStart.y,
            endX: finalX,
            endY: finalY
          };
          setLines(prev => [...prev, newLine]);
          setAnnotationHistory(prev => [...prev, { type: 'line', id: newLine.id }]);
          
          // Calculer le vecteur de la ligne actuelle
          const dx = finalX - lineStart.x;
          const dy = finalY - lineStart.y;
          
          // Calculer le vecteur perpendiculaire (rotation de 90°)
          const perpDx = -dy;
          const perpDy = dx;
          
          // Normaliser le vecteur perpendiculaire
          const length = Math.sqrt(perpDx * perpDx + perpDy * perpDy);
          const normalizedPerpDx = length > 0 ? perpDx / length : 0;
          const normalizedPerpDy = length > 0 ? perpDy / length : 0;
          
          // Préparer pour la prochaine ligne perpendiculaire
          setLastPerpendicularEnd({ x: finalX, y: finalY });
          setLastPerpendicularVector({ dx: normalizedPerpDx, dy: normalizedPerpDy });
          setLineStart({ x: finalX, y: finalY });
          setMousePosition({ x: finalX, y: finalY });
          // isDrawingLine reste à true pour continuer l'enchaînement
        }
      }
    } else if (activeTool === 'angle') {
      if (!angleFirstLine) {
        // Première ligne (2 clics)
        if (!isDrawingLine) {
          // Premier clic : démarrer la première ligne
          setLineStart({ x: coords.x, y: coords.y });
          setMousePosition({ x: coords.x, y: coords.y });
          setIsDrawingLine(true);
          setHasMoved(false);
        } else {
          // Deuxième clic : terminer la première ligne
          if (lineStart) {
            const newLine: Line = {
              id: `line-${Date.now()}`,
              startX: lineStart.x,
              startY: lineStart.y,
              endX: coords.x,
              endY: coords.y
            };
            setLines(prev => [...prev, newLine]);
            // NE PAS ajouter à l'historique, car fait partie de l'angle complet
            setAngleFirstLine(newLine);
            
            // Vecteur normalisé de la première ligne
            const dx = coords.x - lineStart.x;
            const dy = coords.y - lineStart.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const normalizedDx = length > 0 ? dx / length : 0;
            const normalizedDy = length > 0 ? dy / length : 0;
            
            setLastAngleEnd({ x: coords.x, y: coords.y });
            setLastAngleVector({ dx: normalizedDx, dy: normalizedDy });
            // Démarrer la seconde ligne à partir du vertex
            setLineStart({ x: coords.x, y: coords.y });
            setMousePosition({ x: coords.x, y: coords.y });
            setIsDrawingLine(true);
          }
        }
      } else if (!isAngleLocked) {
        // Troisième clic : verrouiller l'angle (ne plus enchaîner)
        if (lineStart) {
          const newLine: Line = {
            id: `line-${Date.now()}`,
            startX: lineStart.x,
            startY: lineStart.y,
            endX: coords.x,
            endY: coords.y
          };
          setLines(prev => [...prev, newLine]);
          // NE PAS ajouter à l'historique individuellement
          
          // Calculer l'angle final
          const dx = coords.x - lineStart.x;
          const dy = coords.y - lineStart.y;
          const magnitude = Math.sqrt(dx * dx + dy * dy);
          let finalAngle = currentAngle;
          if (lastAngleVector && magnitude > 0) {
            const dotProduct = dx * lastAngleVector.dx + dy * lastAngleVector.dy;
            const cosAngle = dotProduct / magnitude;
            const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
            finalAngle = Math.round((angleRad * 180) / Math.PI);
          }
          // Persister l'étiquette d'angle avec les IDs des deux lignes
          if (finalAngle != null && angleFirstLine) {
            const vertexX = angleFirstLine.endX;
            const vertexY = angleFirstLine.endY;
            const angleAnn: AngleAnnotation = {
              id: `angle-${Date.now()}`,
              vertexX,
              vertexY,
              valueDeg: finalAngle,
              line1Id: angleFirstLine.id,
              line2Id: newLine.id,
            };
            setAngleAnnotations(prev => [...prev, angleAnn]);
            // Ajouter l'angle à l'historique (pas les lignes individuelles)
            setAnnotationHistory(prev => [...prev, { type: 'angle', id: angleAnn.id }]);
          }
          
          // Verrouiller et nettoyer les états de dessin
          setIsAngleLocked(true);
          setIsDrawingLine(false);
          setLineStart(null);
          setMousePosition(null);
          setLastAngleEnd(null);
          setLastAngleVector(null);
          setCurrentAngle(null);
        }
      }
    } else if (activeTool === 'ruler') {
      if (!isDrawingLine) {
        // Premier clic : commencer la ligne de mesure
        setLineStart({ x: coords.x, y: coords.y });
        setMousePosition({ x: coords.x, y: coords.y });
        setIsDrawingLine(true);
        setHasMoved(false);
      } else {
        // Deuxième clic : terminer la ligne et créer l'annotation de distance
        if (lineStart) {
          const newLine: Line = {
            id: `line-${Date.now()}`,
            startX: lineStart.x,
            startY: lineStart.y,
            endX: coords.x,
            endY: coords.y
          };
          setLines(prev => [...prev, newLine]);
          
          // Calculer la distance (en pixels, puis convertir en cm)
          const dx = coords.x - lineStart.x;
          const dy = coords.y - lineStart.y;
          const distancePx = Math.sqrt(dx * dx + dy * dy);
          // Conversion approximative : 96 DPI = 37.8 pixels/cm
          const distanceCm = distancePx / 37.8;
          const roundedDistance = Math.round(distanceCm * 10) / 10; // Arrondi à 1 décimale
          
          // Calculer le point milieu
          const midX = (lineStart.x + coords.x) / 2;
          const midY = (lineStart.y + coords.y) / 2;
          
          // Créer l'annotation de distance
          const distanceAnn: DistanceAnnotation = {
            id: `distance-${Date.now()}`,
            midX,
            midY,
            distance: roundedDistance,
            lineId: newLine.id,
          };
          setDistanceAnnotations(prev => [...prev, distanceAnn]);
          
          // Ajouter à l'historique
          setAnnotationHistory(prev => [...prev, { type: 'distance', id: distanceAnn.id }]);
          
          // Réinitialiser pour une nouvelle mesure
          setIsDrawingLine(false);
          setLineStart(null);
          setMousePosition(null);
          setCurrentDistance(null);
          setHasMoved(false);
        }
      }
    }
  };

  const handlePrevImage = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setPoints([]); // Les annotations sont liées à une image spécifique
    setLines([]); // Les lignes sont liées à une image spécifique
    setCircles([]); // Les cercles sont liés à une image spécifique
    setAnnotationHistory([]); // Réinitialiser l'historique
    setActiveTool('none');
    setIsDrawingLine(false);
    setIsDrawingCircle(false);
    setLineStart(null);
    setCircleStart(null);
    setMousePosition(null);
    setHasMoved(false);
    setLastPerpendicularEnd(null);
    setLastPerpendicularVector(null);
    setLastAngleEnd(null);
    setLastAngleVector(null);
    setCurrentAngle(null);
    setAngleFirstLine(null);
    setIsAngleLocked(false);
    setAngleAnnotations([]);
    setCurrentDistance(null);
    setDistanceAnnotations([]);
  };

  const handleNextImage = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setPoints([]); // Les annotations sont liées à une image spécifique
    setLines([]); // Les lignes sont liées à une image spécifique
    setCircles([]); // Les cercles sont liés à une image spécifique
    setAnnotationHistory([]); // Réinitialiser l'historique
    setActiveTool('none');
    setIsDrawingLine(false);
    setIsDrawingCircle(false);
    setLineStart(null);
    setCircleStart(null);
    setMousePosition(null);
    setHasMoved(false);
    setLastPerpendicularEnd(null);
    setLastPerpendicularVector(null);
    setLastAngleEnd(null);
    setLastAngleVector(null);
    setCurrentAngle(null);
    setAngleFirstLine(null);
    setIsAngleLocked(false);
    setAngleAnnotations([]);
    setCurrentDistance(null);
    setDistanceAnnotations([]);
  };

  const handleResize = (direction: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = modalSize.width;
    const startHeight = modalSize.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) {
        newWidth = Math.max(400, Math.min(window.innerWidth - 100, startWidth + (moveEvent.clientX - startX)));
      }
      if (direction.includes('w')) {
        newWidth = Math.max(400, Math.min(window.innerWidth - 100, startWidth - (moveEvent.clientX - startX)));
      }
      if (direction.includes('s')) {
        newHeight = Math.max(300, Math.min(window.innerHeight - 100, startHeight + (moveEvent.clientY - startY)));
      }
      if (direction.includes('n')) {
        newHeight = Math.max(300, Math.min(window.innerHeight - 100, startHeight - (moveEvent.clientY - startY)));
      }

      setModalSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;

  // Annuler le dessin en cours si on clique en dehors de l'image
  const handleBackdropClick = () => {
    // Annuler ligne simple en cours
    if (activeTool === 'line' && isDrawingLine && !lastPerpendicularEnd && !lastAngleEnd && !angleFirstLine) {
      setIsDrawingLine(false);
      setLineStart(null);
      setMousePosition(null);
      setHasMoved(false);
    }
    
    // Annuler cercle en cours
    if (activeTool === 'circle' && isDrawingCircle) {
      setIsDrawingCircle(false);
      setCircleStart(null);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={handleBackdropClick}
        onTouchStart={(e) => {
          // Empêcher les événements touch de se propager à l'arrière-plan
          if (e.target === e.currentTarget) {
            // Si on clique sur l'arrière-plan, fermer
            onClose();
          }
        }}
        style={{ touchAction: 'none' }} // Empêcher les interactions par défaut sur l'arrière-plan
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, x: 0, y: 0 }}
          animate={{ 
            scale: 1, 
            x: modalPosition.x, 
            y: modalPosition.y,
            transition: { type: 'tween', duration: 0 }
          }}
          exit={{ scale: 0.9 }}
          className="relative bg-white rounded-lg overflow-hidden"
          style={{ 
            width: `${modalSize.width}px`,
            height: `${modalSize.height}px`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '2px solid #e5e7eb',
            pointerEvents: 'auto',
            willChange: isDraggingModal || isResizing ? 'transform' : 'auto',
            userSelect: 'none', // Désactive la sélection de texte dans tout le modal
            touchAction: 'auto' // Permet les interactions tactiles dans le modal
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()} // Empêcher la propagation des événements touch
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {/* Resize Handles */}
          <div 
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-20"
            onMouseDown={(e) => handleResize('ne', e)}
            style={{ background: '#EECE84', borderRadius: '0 0.5rem 0 0' }}
          />
          <div 
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-20"
            onMouseDown={(e) => handleResize('nw', e)}
            style={{ background: '#EECE84', borderRadius: '0.5rem 0 0 0' }}
          />
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20"
            onMouseDown={(e) => handleResize('se', e)}
            style={{ background: '#EECE84', borderRadius: '0 0 0.5rem 0' }}
          />
          <div 
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-20"
            onMouseDown={(e) => handleResize('sw', e)}
            style={{ background: '#EECE84', borderRadius: '0 0 0 0.5rem' }}
          />
          
          {/* Header - Draggable */}
          <div 
            className="absolute top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between z-10 border-b border-gray-700 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest('button')) return; // Ne pas drag si on clique sur le bouton close
              setIsDraggingModal(true);
              const startX = e.clientX - modalPosition.x;
              const startY = e.clientY - modalPosition.y;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                setModalPosition({
                  x: moveEvent.clientX - startX,
                  y: moveEvent.clientY - startY,
                });
              };
              
              const handleMouseUp = () => {
                setIsDraggingModal(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div className="flex items-center gap-3">
              <Move className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Image Viewer</span>
              {images.length > 1 && (
                <span className="text-gray-400 text-sm">{currentIndex + 1} of {images.length}</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Image Container */}
          <div 
            ref={imageContainerRef}
            className="absolute inset-0 mt-14 mb-16 flex items-center justify-center overflow-auto bg-white"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleImageClick}
            style={{ 
              cursor: (activeTool === 'point' || activeTool === 'line' || activeTool === 'circle' || activeTool === 'perpendicular' || activeTool === 'angle' || activeTool === 'ruler') ? 'crosshair' : (isDragging ? 'grabbing' : 'grab'),
              userSelect: 'none', // Désactive la sélection de texte dans le conteneur d'image
              touchAction: 'pan-y pan-x pinch-zoom', // Permet le scroll et le zoom par pincement
              WebkitOverflowScrolling: 'touch' // Smooth scrolling sur iOS
            }}
          >
            {/* Conteneur avec image et annotations */}
            <div className="relative">
              <motion.div
                className="relative"
                animate={{
                  scale,
                  rotate: rotation,
                  x: position.x,
                  y: position.y,
                }}
                transition={isDragging ? { duration: 0 } : { 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30
                }}
                style={{
                  willChange: isDragging ? 'transform' : 'auto',
                  transformOrigin: 'center center'
                }}
              >
                <img
                  ref={imageRef}
                  src={images[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none"
                  style={{ 
                    imageRendering: 'crisp-edges' as any,
                    userSelect: 'none' // Désactive la sélection de texte sur l'image
                  }}
                  draggable={false}
                />
                
                {/* Points et lignes directement sur l'image - même conteneur transformé */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* SVG pour les lignes, cercles et éléments temporaires */}
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Lignes définitives */}
                    {lines.map(line => {
                      if (!imageRef.current) return null;
                      
                      const imageWidth = imageRef.current.naturalWidth;
                      const imageHeight = imageRef.current.naturalHeight;
                      
                      // Coordonnées normalisées (0-1)
                      const startX = (line.startX / imageWidth) * 100;
                      const startY = (line.startY / imageHeight) * 100;
                      const endX = (line.endX / imageWidth) * 100;
                      const endY = (line.endY / imageHeight) * 100;
                      
                      return (
                        <line
                          key={line.id}
                          x1={`${startX}%`}
                          y1={`${startY}%`}
                          x2={`${endX}%`}
                          y2={`${endY}%`}
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      );
                    })}
                    
                    {/* Cercles définitifs */}
                    {circles.map(circle => {
                      if (!imageRef.current) return null;
                      
                      const imageWidth = imageRef.current.naturalWidth;
                      const imageHeight = imageRef.current.naturalHeight;
                      
                      // Coordonnées normalisées
                      const centerX = (circle.centerX / imageWidth) * 100;
                      const centerY = (circle.centerY / imageHeight) * 100;
                      const radiusX = (circle.radiusX / imageWidth) * 100;
                      const radiusY = (circle.radiusY / imageHeight) * 100;
                      
                      return (
                        <ellipse
                          key={circle.id}
                          cx={`${centerX}%`}
                          cy={`${centerY}%`}
                          rx={`${radiusX}%`}
                          ry={`${radiusY}%`}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />
                      );
                    })}
                    
                    {/* Ligne temporaire en cours de dessin */}
                    {isDrawingLine && lineStart && mousePosition && (
                      <line
                        x1={`${(lineStart.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        y1={`${(lineStart.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        x2={`${(mousePosition.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        y2={`${(mousePosition.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        stroke={hasMoved ? "#ef4444" : "#94a3b8"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={hasMoved ? "none" : "5,5"}
                      />
                    )}
                    
                    {/* Cercle temporaire en cours de dessin */}
                    {isDrawingCircle && circleStart && mousePosition && (
                      <ellipse
                        cx={`${(circleStart.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        cy={`${(circleStart.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        rx={`${Math.abs((mousePosition.x - circleStart.x) / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        ry={`${Math.abs((mousePosition.y - circleStart.y) / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )}
                    
                    {/* Ligne perpendiculaire temporaire */}
                    {activeTool === 'perpendicular' && lineStart && mousePosition && (
                      <line
                        x1={`${(lineStart.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        y1={`${(lineStart.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        x2={`${(mousePosition.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        y2={`${(mousePosition.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                      />
                    )}
                    
                    {/* Ligne angle temporaire */}
                    {activeTool === 'angle' && lineStart && mousePosition && (
                      <line
                        x1={`${(lineStart.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        y1={`${(lineStart.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        x2={`${(mousePosition.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        y2={`${(mousePosition.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                      />
                    )}
                    
                    {/* Ligne ruler temporaire */}
                    {activeTool === 'ruler' && lineStart && mousePosition && (
                      <line
                        x1={`${(lineStart.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        y1={`${(lineStart.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        x2={`${(mousePosition.x / (imageRef.current?.naturalWidth || 1)) * 100}%`}
                        y2={`${(mousePosition.y / (imageRef.current?.naturalHeight || 1)) * 100}%`}
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                      />
                    )}
                  </svg>
                  
                  {/* Points */}
                  {points.map(point => {
                    if (!imageRef.current) return null;
                    
                    const imageWidth = imageRef.current.naturalWidth;
                    const imageHeight = imageRef.current.naturalHeight;
                    
                    // Coordonnées normalisées (0-1)
                    const normalizedX = point.x / imageWidth;
                    const normalizedY = point.y / imageHeight;
                    
                    return (
                      <div
                        key={point.id}
                        className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"
                        style={{
                          left: `${normalizedX * 100}%`,
                          top: `${normalizedY * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 10
                        }}
                      />
                    );
                  })}
                  
                  {/* Affichage de l'angle en temps réel */}
                  {activeTool === 'angle' && currentAngle !== null && lineStart && mousePosition && (
                    <div
                      className="absolute bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        left: `${(lineStart.x / (imageRef.current?.naturalWidth || 1)) * 100}%`,
                        top: `${(lineStart.y / (imageRef.current?.naturalHeight || 1)) * 100}%`,
                        transform: 'translate(-50%, -150%)',
                        zIndex: 20
                      }}
                    >
                      {currentAngle}°
                    </div>
                  )}

                  {/* Angles verrouillés persistants */}
                  {angleAnnotations.map(ann => (
                    <div
                      key={ann.id}
                      className="absolute bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        left: `${(ann.vertexX / (imageRef.current?.naturalWidth || 1)) * 100}%`,
                        top: `${(ann.vertexY / (imageRef.current?.naturalHeight || 1)) * 100}%`,
                        transform: 'translate(-50%, -150%)',
                        zIndex: 20
                      }}
                    >
                      {ann.valueDeg}°
                    </div>
                  ))}
                  
                  {/* Affichage de la distance en temps réel */}
                  {activeTool === 'ruler' && currentDistance !== null && lineStart && mousePosition && (
                    <div
                      className="absolute bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        left: `${((lineStart.x + mousePosition.x) / 2 / (imageRef.current?.naturalWidth || 1)) * 100}%`,
                        top: `${((lineStart.y + mousePosition.y) / 2 / (imageRef.current?.naturalHeight || 1)) * 100}%`,
                        transform: 'translate(-50%, -150%)',
                        zIndex: 20
                      }}
                    >
                      {currentDistance} cm
                    </div>
                  )}
                  
                  {/* Distances persistantes */}
                  {distanceAnnotations.map(ann => (
                    <div
                      key={ann.id}
                      className="absolute bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        left: `${(ann.midX / (imageRef.current?.naturalWidth || 1)) * 100}%`,
                        top: `${(ann.midY / (imageRef.current?.naturalHeight || 1)) * 100}%`,
                        transform: 'translate(-50%, -150%)',
                        zIndex: 20
                      }}
                    >
                      {ann.distance} cm
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Controls - Draggable */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm px-4 py-3 z-10 border-t border-gray-700 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest('button')) return; // Ne pas drag si on clique sur un bouton
              setIsDraggingModal(true);
              const startX = e.clientX - modalPosition.x;
              const startY = e.clientY - modalPosition.y;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                setModalPosition({
                  x: moveEvent.clientX - startX,
                  y: moveEvent.clientY - startY,
                });
              };
              
              const handleMouseUp = () => {
                setIsDraggingModal(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 text-white" />
                </button>
                
                <div className="px-4 py-1 bg-gray-700 rounded-full text-white text-sm font-medium min-w-[70px] text-center">
                  {Math.round(scale * 100)}%
                </div>
                
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={handleRotate}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  aria-label="Rotate"
                >
                  <RotateCw className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 px-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2"
                  aria-label="Reset"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Reset</span>
                </button>
              </div>

              {/* Annotation Tools */}
              <div className="flex items-center gap-2 border-l border-gray-600 pl-4">
                <button
                  onClick={() => setActiveTool(activeTool === 'point' ? 'none' : 'point')}
                  className={`p-2 rounded-full transition-colors ${
                    activeTool === 'point' 
                      ? 'bg-[#EECE84] text-black' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title="Point"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'line' ? 'none' : 'line')}
                  className={`p-2 rounded-full transition-colors ${
                    activeTool === 'line' 
                      ? 'bg-[#EECE84] text-black' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title="Ligne"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'circle' ? 'none' : 'circle')}
                  className={`p-2 rounded-full transition-colors ${
                    activeTool === 'circle' 
                      ? 'bg-[#EECE84] text-black' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title="Cercle/Ovale"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="12" rx="9" ry="6"/>
                  </svg>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'perpendicular' ? 'none' : 'perpendicular')}
                  className={`p-2 rounded-full transition-colors ${
                    activeTool === 'perpendicular' 
                      ? 'bg-[#EECE84] text-black' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title="Ligne Perpendiculaire"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'angle' ? 'none' : 'angle')}
                  className={`p-2 rounded-full transition-colors ${
                    activeTool === 'angle' 
                      ? 'bg-[#EECE84] text-black' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title="Mesurer Angle (Compas)"
                >
                  {/* Compass icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="1"/>
                    <path d="m12 6-8.5 14h3.5"/>
                    <path d="m12 6 8.5 14h-3.5"/>
                  </svg>
                </button>

                <button
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  title="Cercle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <circle cx="12" cy="12" r="8"/>
                  </svg>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'ruler' ? 'none' : 'ruler')}
                  className={`p-2 rounded-full transition-colors ${
                    activeTool === 'ruler' 
                      ? 'bg-[#EECE84] text-black' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title="Règle (Mesurer Distance)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/>
                    <path d="m14.5 12.5 2-2"/>
                    <path d="m11.5 9.5 2-2"/>
                    <path d="m8.5 6.5 2-2"/>
                    <path d="m17.5 15.5 2-2"/>
                  </svg>
                </button>

                {/* Undo button */}
                {annotationHistory.length > 0 && (
                  <button
                    onClick={() => {
                      // Récupérer la dernière annotation de l'historique
                      const lastAnnotation = annotationHistory[annotationHistory.length - 1];
                      
                      if (lastAnnotation.type === 'point') {
                        setPoints(prev => prev.filter(p => p.id !== lastAnnotation.id));
                      } else if (lastAnnotation.type === 'line') {
                        setLines(prev => prev.filter(l => l.id !== lastAnnotation.id));
                      } else if (lastAnnotation.type === 'circle') {
                        setCircles(prev => prev.filter(c => c.id !== lastAnnotation.id));
                      } else if (lastAnnotation.type === 'angle') {
                        // Supprimer l'annotation d'angle
                        const angleAnn = angleAnnotations.find(a => a.id === lastAnnotation.id);
                        if (angleAnn) {
                          // Supprimer les deux lignes de l'angle
                          setLines(prev => prev.filter(l => l.id !== angleAnn.line1Id && l.id !== angleAnn.line2Id));
                          // Supprimer l'étiquette d'angle
                          setAngleAnnotations(prev => prev.filter(a => a.id !== lastAnnotation.id));
                        }
                      } else if (lastAnnotation.type === 'distance') {
                        // Supprimer l'annotation de distance
                        const distanceAnn = distanceAnnotations.find(d => d.id === lastAnnotation.id);
                        if (distanceAnn) {
                          // Supprimer la ligne de distance
                          setLines(prev => prev.filter(l => l.id !== distanceAnn.lineId));
                          // Supprimer l'étiquette de distance
                          setDistanceAnnotations(prev => prev.filter(d => d.id !== lastAnnotation.id));
                        }
                      }
                      
                      // Supprimer de l'historique
                      setAnnotationHistory(prev => prev.slice(0, -1));
                    }}
                    className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white"
                    title="Annuler la dernière annotation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v6h6"/>
                      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                    </svg>
                  </button>
                )}

                {/* Clear all button */}
                {(points.length > 0 || lines.length > 0 || circles.length > 0 || angleAnnotations.length > 0 || distanceAnnotations.length > 0) && (
                  <button
                    onClick={() => {
                      setPoints([]);
                      setLines([]);
                      setCircles([]);
                      setAngleAnnotations([]);
                      setDistanceAnnotations([]);
                      setAnnotationHistory([]);
                    }}
                    className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white"
                    title="Effacer toutes les annotations"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" x2="10" y1="11" y2="17"/>
                      <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevImage}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="px-4 py-1 bg-gray-700 rounded-full text-white text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                  </div>
                  
                  <button
                    onClick={handleNextImage}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageViewer;