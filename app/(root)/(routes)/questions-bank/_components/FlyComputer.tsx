"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface FlyComputerProps {
  isVisible: boolean;
  onClose: () => void;
}

const FlyComputer: React.FC<FlyComputerProps> = ({ isVisible, onClose }) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [discRotation, setDiscRotation] = useState(0);
  const [isDraggingCursor, setIsDraggingCursor] = useState(false);
  const [isDraggingDisc, setIsDraggingDisc] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialCursorPosition, setInitialCursorPosition] = useState(0);
  const [rotationCenter, setRotationCenter] = useState({ cx: 0, cy: 0 });
  const [initialAngle, setInitialAngle] = useState(0);
  const [cumulativeAngle, setCumulativeAngle] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<'none' | 'cursor' | 'disc'>('none');
  const [isDraggingFlyComputer, setIsDraggingFlyComputer] = useState(false);
  const [flyComputerPosition, setFlyComputerPosition] = useState({ x: 0, y: 0 });
  const [dragStartFlyComputer, setDragStartFlyComputer] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // État pour le zoom
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // État pour la navigation lors du zoom
  const [isPanning, setIsPanning] = useState(false); // État pour le panning
  const [panStart, setPanStart] = useState({ x: 0, y: 0 }); // Position de départ du pan
  
  // États pour la rotation de la face arrière (séparés de la face avant)
  const [backDiscRotation, setBackDiscRotation] = useState(0);
  const [isDraggingBackDisc, setIsDraggingBackDisc] = useState(false);
  const [backRotationCenter, setBackRotationCenter] = useState({ cx: 0, cy: 0 });
  const [backInitialAngle, setBackInitialAngle] = useState(0);
  const [backCumulativeAngle, setBackCumulativeAngle] = useState(0);
  
  // Référence pour l'animation frame pour la fluidité
  const animationFrameRef = useRef<number | null>(null);
  const pendingRotationRef = useRef<number | null>(null);
  
  // Pas besoin d'animation frame pour le déplacement - mise à jour immédiate
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Charger les SVG depuis le dossier public
  const [baseSvg, setBaseSvg] = useState<string>('');
  const [cursorSvg, setCursorSvg] = useState<string>('');
  const [discSvg, setDiscSvg] = useState<string>('');
  const [backSvg, setBackSvg] = useState<string>('');
  const [backBaseSvg, setBackBaseSvg] = useState<string>(''); // SVG plus grand (fond)
  const [backDiscSvg, setBackDiscSvg] = useState<string>(''); // SVG plus petit (disque rotatif)

  useEffect(() => {
    // Charger les SVG
    const loadSvgs = async () => {
      try {
        const [baseResponse, cursorResponse, discResponse, backBaseResponse, backDialResponse] = await Promise.all([
          fetch('/e6b_components/e6b.plate.svg'),
          fetch('/e6b_components/e6b.cursor.svg'),
          fetch('/e6b_components/e6b.disc.svg'),
          fetch('/e6b_components/e6b_tas_base.svg'),
          fetch('/e6b_components/e6b_tas_dial.svg')
        ]);

        if (baseResponse.ok) setBaseSvg(await baseResponse.text());
        if (cursorResponse.ok) setCursorSvg(await cursorResponse.text());
        if (discResponse.ok) setDiscSvg(await discResponse.text());
        if (backBaseResponse.ok) {
          setBackBaseSvg(await backBaseResponse.text());
        }
        if (backDialResponse.ok) {
          setBackDiscSvg(await backDialResponse.text());
        }
      } catch (error) {
        console.error('Erreur lors du chargement des SVG:', error);
      }
    };

    loadSvgs();
  }, []);

  // CENTRE DE ROTATION DYNAMIQUE - Se recalcule quand le SVG change
  const calculateRotationCenter = useCallback(() => {
    if (!svgRef.current) return { cx: 330, cy: 500 };
    
    const svg = svgRef.current;
    const bbox = svg.getBBox();
    
    // Calculer le centre du SVG
    const center = {
      cx: bbox.x + bbox.width / 2,
      cy: bbox.y + bbox.height / 2
    };
    
    console.log('🎯 Centre de rotation DYNAMIQUE calculé (Face avant):', center);
    return center;
  }, []);

  // Recalculer le centre de rotation quand le SVG est chargé ou redimensionné
  useEffect(() => {
    if (baseSvg && svgRef.current) {
      const newCenter = calculateRotationCenter();
      setRotationCenter(newCenter);
    }
  }, [baseSvg, calculateRotationCenter]);

  // Recalculer le centre de rotation quand le FlyComputer est déplacé
  useEffect(() => {
    if (baseSvg && svgRef.current && flyComputerPosition.x !== 0 && flyComputerPosition.y !== 0) {
      // Petit délai pour laisser le DOM se mettre à jour
      const timer = setTimeout(() => {
        const newCenter = calculateRotationCenter();
        setRotationCenter(newCenter);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [flyComputerPosition, baseSvg, calculateRotationCenter]);

  // MONITOR EN TEMPS RÉEL POUR LE DIAGNOSTIC
  useEffect(() => {
    const monitor = () => {
      console.log('📊 ÉTAT ACTUEL DU FLYCOMPUTER:', {
        flyComputerPosition,
        rotationCenter,
        isDraggingDisc,
        svgRect: svgRef.current?.getBoundingClientRect(),
        discRotation,
        zoomLevel,
        panOffset,
        timestamp: new Date().toISOString()
      });
    };
    
    // Monitorer toutes les 3 secondes
    const interval = setInterval(monitor, 3000);
    
    return () => clearInterval(interval);
  }, [flyComputerPosition, rotationCenter, isDraggingDisc, discRotation, zoomLevel, panOffset]);

  // CENTRE DE ROTATION FIXE ET STABLE POUR LA FACE ARRIÈRE
  useEffect(() => {
    // Centre fixe pour la face arrière - différent de la face avant
    const backFixedCenter = {
      cx: 295, // Centre horizontal pour la face arrière
      cy: 500  // Centre vertical pour la face arrière
    };
    
    setBackRotationCenter(backFixedCenter);
    console.log('✅ Centre de rotation FIXE et STABLE (Face arrière):', backFixedCenter);
  }, []); // Calculé une seule fois au montage

  // Fonction pour convertir les coordonnées client en coordonnées SVG
  const clientToSVG = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) {
      console.error('🚨 SVG REF MANQUANT!');
      return { x: 0, y: 0 };
    }
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const ctm = svg.getScreenCTM();
    
    // DIAGNOSTIC: Logs détaillés
    console.log('🔍 DIAGNOSTIC CLIENT_TO_SVG:', {
      input: { clientX, clientY },
      flyComputerPos: flyComputerPosition,
      rect: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      },
      ctm: ctm ? {
        a: ctm.a, b: ctm.b, c: ctm.c, d: ctm.d,
        e: ctm.e, f: ctm.f
      } : null
    });
    
    if (!ctm) {
      console.error('🚨 CTM MANQUANT!');
      return { x: 0, y: 0 };
    }
    
    const inverseCTM = ctm.inverse();
    const point = svg.createSVGPoint();
    point.x = clientX - rect.left;
    point.y = clientY - rect.top;
    
    const result = point.matrixTransform(inverseCTM);
    
    // VÉRIFIER SI LE RÉSULTAT EST VALIDE
    if (isNaN(result.x) || isNaN(result.y)) {
      console.error('🚨 CONVERSION INVALIDE!', {
        input: { clientX, clientY },
        point: { x: point.x, y: point.y },
        result: { x: result.x, y: result.y }
      });
      return { x: 0, y: 0 };
    }
    
    console.log('✅ Conversion réussie:', { clientX, clientY, svgX: result.x, svgY: result.y });
    return result;
  }, [flyComputerPosition]);

  // Fonction de rotation FLUIDE et PRÉCISE (Face avant)
  const updateDiscRotation = (newRotation: number) => {
    // Stocker la rotation en attente
    pendingRotationRef.current = newRotation;
    
    // Annuler l'animation frame précédente si elle existe
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Programmer la mise à jour pour le prochain frame
    animationFrameRef.current = requestAnimationFrame(() => {
      if (pendingRotationRef.current !== null) {
        setDiscRotation(pendingRotationRef.current);
        console.log('🔄 Rotation fluide (Face avant):', pendingRotationRef.current.toFixed(1), '°');
        pendingRotationRef.current = null;
      }
      animationFrameRef.current = null;
    });
  };

  // Fonction de déplacement IMMÉDIAT et PRÉCIS du FlyComputer
  const updateFlyComputerPosition = (newPosition: {x: number, y: number}) => {
    // Mise à jour IMMÉDIATE pour une fluidité parfaite
    setFlyComputerPosition(newPosition);
    console.log('🎯 Position FlyComputer immédiate:', newPosition);
  };

  // Fonction de rotation SIMPLE et STABLE (Face arrière)
  const updateBackDiscRotation = (newRotation: number) => {
    // Rotation simple : garder la valeur telle quelle
    setBackDiscRotation(newRotation);
    console.log('🔄 Rotation mise à jour (Face arrière):', newRotation, '°');
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'cursor' | 'disc' | 'backDisc' | 'flycomputer') => {
    e.preventDefault();
    
    if (type === 'flycomputer') {
      // Déplacer tout le flycomputer
      setDragStartFlyComputer({ x: e.clientX, y: e.clientY });
      setIsDraggingFlyComputer(true);
    } else {
      e.stopPropagation(); // Empêcher la propagation
      
      // CORRECTION : Toujours mettre à jour dragStart pour le mouvement vertical
      setDragStart({ x: e.clientX, y: e.clientY });
      
      if (type === 'disc') {
        // Convertir les coordonnées en coordonnées SVG
        const svgPoint = clientToSVG(e.clientX, e.clientY);
        
        // Calculer l'angle de départ par rapport au centre FIXE et STABLE
        const angle = Math.atan2(svgPoint.y - rotationCenter.cy, svgPoint.x - rotationCenter.cx);
        setInitialAngle(angle);
        setCumulativeAngle(discRotation);
        
        setIsDraggingDisc(true);
        console.log('🎯 Début rotation (Face avant) avec centre STABLE:', rotationCenter, 'angle initial:', angle);
      } else if (type === 'backDisc') {
        // Convertir les coordonnées en coordonnées SVG
        const svgPoint = clientToSVG(e.clientX, e.clientY);
        
        // Calculer l'angle de départ par rapport au centre FIXE et STABLE (Face arrière)
        const angle = Math.atan2(svgPoint.y - backRotationCenter.cy, svgPoint.x - backRotationCenter.cx);
        setBackInitialAngle(angle);
        setBackCumulativeAngle(backDiscRotation);
        
        setIsDraggingBackDisc(true);
        console.log('🎯 Début rotation (Face arrière) avec centre STABLE:', backRotationCenter, 'angle initial:', angle);
      } else if (type === 'cursor') {
        // CORRECTION : Mouvement vertical fluide et précis
        setInitialCursorPosition(cursorPosition);
        setIsDraggingCursor(true);
        console.log('📏 Début mouvement vertical fluide, position initiale:', cursorPosition);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDraggingDisc) {
      setCumulativeAngle(discRotation);
      console.log('🔄 Fin rotation (Face avant), angle final:', discRotation.toFixed(1));
    }
    
    if (isDraggingBackDisc) {
      setBackCumulativeAngle(backDiscRotation);
      console.log('🔄 Fin rotation (Face arrière), angle final:', backDiscRotation.toFixed(1));
    }
    
    if (isDraggingCursor) {
      console.log('📏 Fin mouvement vertical, position finale:', cursorPosition.toFixed(1));
    }
    
    if (isPanning) {
      handlePanEnd();
    }
    
    setIsDraggingCursor(false);
    setIsDraggingDisc(false);
    setIsDraggingBackDisc(false);
    setIsDraggingFlyComputer(false);
  };

  const handleFlipFlyComputer = () => {
    setIsFlipped(!isFlipped);
  };

  // Fonctions de zoom avec reset du pan
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3)); // Limite à 300%
    // Reset du pan quand on zoome
    if (zoomLevel < 1.5) {
      setPanOffset({ x: 0, y: 0 });
    }
    console.log('🔍 Zoom in:', (zoomLevel + 0.2).toFixed(1));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5)); // Limite à 50%
    // Reset du pan quand on dézoome
    if (zoomLevel - 0.2 <= 1) {
      setPanOffset({ x: 0, y: 0 });
    }
    console.log('🔍 Zoom out:', (zoomLevel - 0.2).toFixed(1));
  };

  // Fonctions de navigation (panning) optimisées avec useCallback
  const handlePanStart = useCallback((e: React.MouseEvent) => {
    // Seulement si on est zoomé
    if (zoomLevel > 1) {
      e.preventDefault();
      e.stopPropagation();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [zoomLevel]);

  const handlePanMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      e.preventDefault();
      
      // Navigation directe et précise - pas de délai
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, zoomLevel, panStart]);

  const handlePanEnd = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
    }
  }, [isPanning]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingFlyComputer) {
      // DÉPLACEMENT DIRECT ET PRÉCIS - suit parfaitement le curseur
      const deltaX = e.clientX - dragStartFlyComputer.x;
      const deltaY = e.clientY - dragStartFlyComputer.y;
      
      // Mise à jour IMMÉDIATE et DIRECTE de la position
      setFlyComputerPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      // Mise à jour IMMÉDIATE du point de référence
      setDragStartFlyComputer({ x: e.clientX, y: e.clientY });
      
      console.log('🎯 Déplacement FlyComputer DIRECT:', {
        deltaX: deltaX.toFixed(1),
        deltaY: deltaY.toFixed(1),
        mousePos: { x: e.clientX, y: e.clientY },
        dragStart: dragStartFlyComputer
      });
      
    } else if (isPanning && zoomLevel > 1) {
      // Navigation lors du zoom
      handlePanMove(e);
      
    } else if (isDraggingCursor) {
      // MOUVEMENT VERTICAL FLUIDE et PRÉCIS - suit parfaitement la souris
      const deltaY = e.clientY - dragStart.y;
      const newPosition = initialCursorPosition + deltaY;
      
      // Limites avec rebond doux au lieu de blocage brutal
      const clampedPosition = Math.max(-250, Math.min(250, newPosition));
      setCursorPosition(clampedPosition);
      
      console.log('📏 Mouvement vertical fluide:', {
        deltaY: deltaY.toFixed(1),
        newPosition: newPosition.toFixed(1),
        clampedPosition: clampedPosition.toFixed(1)
      });
      
    } else if (isDraggingDisc) {
      // DIAGNOSTIC: Logs détaillés pour la rotation
      console.log('🔍 DIAGNOSTIC ROTATION DÉTAILLÉ:', {
        // Coordonnées de la souris
        mouseClient: { x: e.clientX, y: e.clientY },
        // Position du FlyComputer
        flyComputerPos: flyComputerPosition,
        // Position du SVG
        svgRect: svgRef.current?.getBoundingClientRect(),
        // Centre de rotation actuel
        rotationCenter: rotationCenter,
        // État de la rotation
        isDraggingDisc: isDraggingDisc,
        initialAngle: initialAngle,
        cumulativeAngle: cumulativeAngle,
        discRotation: discRotation
      });
      
      // ROTATION FLUIDE et PRÉCISE - suit parfaitement la souris
      const svgPoint = clientToSVG(e.clientX, e.clientY);
      
      // VÉRIFICATIONS DE SÉCURITÉ
      if (rotationCenter.cx === 0 || rotationCenter.cy === 0) {
        console.error('🚨 CENTRE DE ROTATION INVALIDE!', rotationCenter);
        return;
      }
      
      if (svgPoint.x === 0 && svgPoint.y === 0) {
        console.error('🚨 CONVERSION SVG INVALIDE!', svgPoint);
        return;
      }
      
      // Calculer l'angle actuel par rapport au centre FIXE et STABLE
      const currentAngle = Math.atan2(svgPoint.y - rotationCenter.cy, svgPoint.x - rotationCenter.cx);
      
      // VÉRIFIER SI L'ANGLE EST VALIDE
      if (isNaN(currentAngle)) {
        console.error('🚨 ANGLE INVALIDE!', {
          svgPoint,
          rotationCenter,
          deltaX: svgPoint.x - rotationCenter.cx,
          deltaY: svgPoint.y - rotationCenter.cy
        });
        return;
      }
      
      // Calculer la différence d'angle avec normalisation fluide
      let deltaAngle = currentAngle - initialAngle;
      
      // Normalisation pour éviter les sauts de 360°
      if (deltaAngle > Math.PI) {
        deltaAngle -= 2 * Math.PI;
      } else if (deltaAngle < -Math.PI) {
        deltaAngle += 2 * Math.PI;
      }
      
      // Convertir en degrés avec sensibilité ajustée pour plus de fluidité
      const deltaDegrees = (deltaAngle * 180 / Math.PI);
      
      // Appliquer la rotation cumulative avec sensibilité fine
      const newRotation = cumulativeAngle + deltaDegrees;
      updateDiscRotation(newRotation);
      
      console.log('✅ Rotation fluide (Face avant):', {
        svgPoint: { x: svgPoint.x.toFixed(1), y: svgPoint.y.toFixed(1) },
        rotationCenter: { cx: rotationCenter.cx.toFixed(1), cy: rotationCenter.cy.toFixed(1) },
        currentAngle: (currentAngle * 180 / Math.PI).toFixed(1),
        deltaAngle: (deltaAngle * 180 / Math.PI).toFixed(1),
        deltaDegrees: deltaDegrees.toFixed(1),
        newRotation: newRotation.toFixed(1),
        // Vérifications
        isCenterValid: rotationCenter.cx > 0 && rotationCenter.cy > 0,
        isSvgPointValid: svgPoint.x > 0 && svgPoint.y > 0,
        isAngleValid: !isNaN(currentAngle)
      });
      
    } else if (isDraggingBackDisc) {
      // ROTATION FLUIDE et PRÉCISE - suit parfaitement la souris (Face arrière)
      const svgPoint = clientToSVG(e.clientX, e.clientY);
      
      // Calculer l'angle actuel par rapport au centre FIXE et STABLE (Face arrière)
      const currentAngle = Math.atan2(svgPoint.y - backRotationCenter.cy, svgPoint.x - backRotationCenter.cx);
      
      // Calculer la différence d'angle avec normalisation fluide
      let deltaAngle = currentAngle - backInitialAngle;
      
      // Normalisation pour éviter les sauts de 360°
      if (deltaAngle > Math.PI) {
        deltaAngle -= 2 * Math.PI;
      } else if (deltaAngle < -Math.PI) {
        deltaAngle += 2 * Math.PI;
      }
      
      // Convertir en degrés avec sensibilité ajustée pour plus de fluidité
      const deltaDegrees = (deltaAngle * 180 / Math.PI);
      
      // Appliquer la rotation cumulative avec sensibilité fine
      const newRotation = backCumulativeAngle + deltaDegrees;
      updateBackDiscRotation(newRotation);
      
      console.log('🔄 Rotation fluide (Face arrière):', {
        currentAngle: (currentAngle * 180 / Math.PI).toFixed(1),
        deltaDegrees: deltaDegrees.toFixed(1),
        newRotation: newRotation.toFixed(1)
      });
    }
  };

  // Gestion des événements globaux
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingFlyComputer) {
        // DÉPLACEMENT DIRECT ET PRÉCIS - suit parfaitement le curseur
        const deltaX = e.clientX - dragStartFlyComputer.x;
        const deltaY = e.clientY - dragStartFlyComputer.y;
        
        // Mise à jour IMMÉDIATE et DIRECTE de la position
        setFlyComputerPosition(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
        
        // Mise à jour IMMÉDIATE du point de référence
        setDragStartFlyComputer({ x: e.clientX, y: e.clientY });
        
      } else if (isDraggingCursor) {
        // Mouvement vertical DIRECT : position initiale + déplacement exact
        const deltaY = e.clientY - dragStart.y;
        const newPosition = initialCursorPosition + deltaY;
        setCursorPosition(Math.max(-250, Math.min(250, newPosition)));
      } else if (isDraggingDisc) {
        // ROTATION FLUIDE et PRÉCISE - suit parfaitement la souris (Face avant)
        const svgPoint = clientToSVG(e.clientX, e.clientY);
        
        // Calculer l'angle actuel par rapport au centre FIXE et STABLE (Face avant)
        const currentAngle = Math.atan2(svgPoint.y - rotationCenter.cy, svgPoint.x - rotationCenter.cx);
        
        // Calculer la différence d'angle avec normalisation fluide
        let deltaAngle = currentAngle - initialAngle;
        
        // Normalisation pour éviter les sauts de 360°
        if (deltaAngle > Math.PI) {
          deltaAngle -= 2 * Math.PI;
        } else if (deltaAngle < -Math.PI) {
          deltaAngle += 2 * Math.PI;
        }
        
        // Convertir en degrés avec sensibilité ajustée pour plus de fluidité
        const deltaDegrees = (deltaAngle * 180 / Math.PI);
        
        // Appliquer la rotation cumulative avec sensibilité fine
        const newRotation = cumulativeAngle + deltaDegrees;
        updateDiscRotation(newRotation);
        
        console.log('🔄 Rotation fluide (Face avant):', {
          currentAngle: (currentAngle * 180 / Math.PI).toFixed(1),
          deltaDegrees: deltaDegrees.toFixed(1),
          newRotation: newRotation.toFixed(1)
        });
        
      } else if (isDraggingBackDisc) {
        // Rotation basée sur le mouvement du pointeur (Face arrière)
        const svgPoint = clientToSVG(e.clientX, e.clientY);
        
        // Calculer l'angle actuel
        const currentAngle = Math.atan2(svgPoint.y - backRotationCenter.cy, svgPoint.x - backRotationCenter.cx);
        
        // Calculer la différence d'angle (normaliser autour de π pour éviter les sauts)
        let deltaAngle = currentAngle - backInitialAngle;
        if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
        if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
        
        // Appliquer la rotation cumulative
        const newRotation = (backCumulativeAngle + (deltaAngle * 180 / Math.PI)) % 360;
        setBackDiscRotation(newRotation);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDraggingDisc) {
        setCumulativeAngle(discRotation);
        // Nettoyer l'animation frame en attente
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        if (pendingRotationRef.current !== null) {
          // Appliquer immédiatement la dernière rotation en attente
          setDiscRotation(pendingRotationRef.current);
          pendingRotationRef.current = null;
        }
      }
      if (isDraggingBackDisc) {
        setBackCumulativeAngle(backDiscRotation);
      }
      if (isDraggingFlyComputer) {
        // Pas de nettoyage nécessaire - mise à jour immédiate
        console.log('🎯 Fin déplacement FlyComputer');
      }
      setIsDraggingCursor(false);
      setIsDraggingDisc(false);
      setIsDraggingBackDisc(false);
      setIsDraggingFlyComputer(false);
    };

    if (isDraggingCursor || isDraggingDisc || isDraggingBackDisc || isDraggingFlyComputer) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      // Nettoyer les animation frames en cours
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // Pas de nettoyage d'animation frame pour le déplacement
    };
  }, [isDraggingCursor, isDraggingDisc, isDraggingBackDisc, isDraggingFlyComputer, dragStart, dragStartFlyComputer, initialCursorPosition, initialAngle, cumulativeAngle, rotationCenter, backInitialAngle, backCumulativeAngle, backRotationCenter]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* E6B Flight Computer déplaçable */}
      <div 
        className="absolute w-2/3 h-full"
        style={{ 
          transform: `translate3d(${flyComputerPosition.x}px, ${flyComputerPosition.y}px, 0)`,
          cursor: isDraggingFlyComputer ? 'grabbing' : 'grab',
          // Optimisations CSS pour la fluidité IMMÉDIATE
          willChange: 'transform',
          transition: 'none', // AUCUNE transition pour une fluidité parfaite
          // Accélération GPU pour les performances
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          // Forcer l'accélération matérielle
          transformOrigin: 'center center',
          // Optimisations supplémentaires
          contain: 'layout style paint'
        }}
        onMouseDown={(e) => handleMouseDown(e, 'flycomputer')}
      >
        {/* Barre de boutons centrée en haut */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            {/* Bouton retourner (voir l'arrière du CRP5) */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400/90 hover:bg-yellow-400 text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleFlipFlyComputer}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">Switch</span>
            </button>

            {/* Bouton zoom out */}
            <button
              onClick={handleZoomOut}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
              <span className="text-sm font-medium">Zoom -</span>
            </button>

            {/* Bouton zoom in */}
            <button
              onClick={handleZoomIn}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              <span className="text-sm font-medium">Zoom +</span>
            </button>

          </div>
        </div>

        {/* E6B Flight Computer */}
        <div 
          className="relative w-full h-full flex justify-center"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            alignItems: 'flex-start',
            paddingTop: isFlipped ? '250px' : '0px'
          }}
        >
          <svg
            ref={svgRef}
            className={isFlipped ? "w-auto h-auto" : "w-full h-full"}
            viewBox={isFlipped ? "0 0 591 1000" : "0 0 660 1000"}
            preserveAspectRatio="xMidYMid meet"
            style={{
              transition: isPanning ? 'none' : 'opacity 0.6s ease-in-out',
              transform: isFlipped 
                ? `scale(${zoomLevel * 1.5}) translate3d(${panOffset.x}px, ${panOffset.y}px, 0)` 
                : `scale(${zoomLevel}) translate3d(${panOffset.x}px, ${panOffset.y}px, 0)`,
              cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
              willChange: isPanning ? 'transform' : 'auto',
              ...(isFlipped && {
                maxWidth: '90%',
                maxHeight: '90%'
              })
            }}
            onMouseDown={zoomLevel > 1 ? handlePanStart : undefined}
            onMouseMove={zoomLevel > 1 ? handleMouseMove : undefined}
            onMouseUp={zoomLevel > 1 ? handleMouseUp : undefined}
          >
            {!isFlipped ? (
              // Face avant - E6B interactif
              <>
                {/* #base : fond immobile (ne jamais toucher) */}
                <g id="base">
                  {baseSvg && (
                    <g dangerouslySetInnerHTML={{ __html: baseSvg }} />
                  )}
                </g>

                {/* #slider : groupe qui se translate uniquement en Y */}
                <g 
                  id="slider"
                  transform={`translate(0, ${cursorPosition})`}
                >
                  {/* Fenêtre grise (cursor) avec effet hover */}
                  {cursorSvg && (
                    <g 
                      style={{
                        cursor: isDraggingCursor ? 'grabbing' : 'grab'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'cursor')}
                      onMouseEnter={() => setHoveredElement('cursor')}
                      onMouseLeave={() => setHoveredElement('none')}
                    >
                      <g 
                        dangerouslySetInnerHTML={{ __html: cursorSvg }}
                        style={{
                          filter: hoveredElement === 'cursor' ? 'drop-shadow(0 0 12px rgba(255, 235, 59, 0.8)) brightness(1.2)' : 'none',
                          transition: 'filter 0.3s ease'
                        }}
                      />
                    </g>
                  )}

                  {/* #rotor : disque blanc seulement, enfant de #slider - PRIORITÉ ABSOLUE */}
                  <g 
                    id="rotor"
                    transform={`rotate(${discRotation}, ${rotationCenter.cx}, ${rotationCenter.cy})`}
                    style={{ 
                      cursor: isDraggingDisc ? 'grabbing' : 'grab',
                      pointerEvents: 'all' // Assurer que les événements sont capturés
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); // Empêcher la propagation vers le slider
                      handleMouseDown(e, 'disc');
                    }}
                    onMouseEnter={() => setHoveredElement('disc')}
                    onMouseLeave={() => setHoveredElement('none')}
                  >
                    {discSvg && (
                      <g 
                        dangerouslySetInnerHTML={{ __html: discSvg }}
                        style={{
                          filter: hoveredElement === 'disc' ? 'drop-shadow(0 0 12px rgba(255, 235, 59, 0.8)) brightness(1.2)' : 'none',
                          transition: 'filter 0.3s ease',
                          pointerEvents: 'all' // Assurer que les événements sont capturés
                        }}
                      />
                    )}
                  </g>
                </g>
              </>
            ) : (
              // Face arrière - Structure avec tas-base et tas-dial
              <>
                {/* tas-base : fond immobile (ne jamais toucher) */}
                {backBaseSvg && (
                  <g dangerouslySetInnerHTML={{ __html: backBaseSvg }} />
                )}
                
                {/* tas-dial : élément rotatif - appliquer la rotation */}
                <g 
                  transform={`rotate(${backDiscRotation}, ${backRotationCenter.cx}, ${backRotationCenter.cy})`}
                  style={{ 
                    cursor: isDraggingBackDisc ? 'grabbing' : 'grab',
                    pointerEvents: 'all' // Assurer que les événements sont capturés
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation(); // Empêcher la propagation
                    handleMouseDown(e, 'backDisc');
                  }}
                  onMouseEnter={() => setHoveredElement('disc')}
                  onMouseLeave={() => setHoveredElement('none')}
                >
                  {/* tas-dial SVG */}
                  {backDiscSvg && (
                    <g 
                      dangerouslySetInnerHTML={{ __html: backDiscSvg }}
                      style={{
                        filter: hoveredElement === 'disc' ? 'drop-shadow(0 0 12px rgba(255, 235, 59, 0.8)) brightness(1.2)' : 'none',
                        transition: 'filter 0.3s ease',
                        pointerEvents: 'all' // Assurer que les événements sont capturés
                      }}
                    />
                  )}
                </g>
              </>
            )}
          </svg>
        </div>

        {/* Bouton de fermeture centré en bas */}
        <button
          onClick={onClose}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 p-2 text-yellow-900 hover:text-yellow-950"
          onMouseDown={(e) => e.stopPropagation()} // Empêcher le drag du flycomputer
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FlyComputer;