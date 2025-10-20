'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Move, 
  Ruler, 
  Download, 
  Printer, 
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Target,
  FileText,
  Circle,
  Square,
  Minus,
  Dot,
  RotateCcw as RotateIcon,
  Trash2
} from 'lucide-react';

interface AdvancedImageViewerProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

interface Point {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

interface Line {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  distance?: number;
  angle?: number;
  isPerpendicular?: boolean;
  timestamp: number;
}

interface Ellipse {
  id: string;
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  timestamp: number;
}

interface Annotation {
  id: string;
  type: 'point' | 'line' | 'ellipse';
  data: Point | Line | Ellipse;
  color: string;
}

const AdvancedImageViewer: React.FC<AdvancedImageViewerProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showTools, setShowTools] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Partial<Line> | null>(null);
  const [currentEllipse, setCurrentEllipse] = useState<Partial<Ellipse> | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  const imageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tool states
  const [activeTool, setActiveTool] = useState<'pan' | 'dot' | 'line' | 'perpendicular' | 'measure_distance' | 'measure_angle' | 'ellipse' | 'rotate' | 'clear'>('pan');

  // Get precise coordinates relative to image
  const getImageCoordinates = useCallback((e: React.MouseEvent) => {
    const container = imageRef.current;
    const img = container?.querySelector('img');
    if (!container || !img) return { x: 0, y: 0 };
    
    // Get container bounds
    const containerRect = container.getBoundingClientRect();
    
    // Get image natural dimensions
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    // Get displayed image dimensions (before scale transform)
    const displayedWidth = img.offsetWidth / scale;
    const displayedHeight = img.offsetHeight / scale;
    
    // Calculate image position within container (centered)
    const imageLeft = (containerRect.width - displayedWidth) / 2;
    const imageTop = (containerRect.height - displayedHeight) / 2;
    
    // Get mouse position relative to container
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    // Adjust for image pan offset
    const adjustedMouseX = mouseX - position.x;
    const adjustedMouseY = mouseY - position.y;
    
    // Calculate position relative to image bounds
    const relativeX = (adjustedMouseX - imageLeft) / displayedWidth;
    const relativeY = (adjustedMouseY - imageTop) / displayedHeight;
    
    // Convert to natural image coordinates
    const imageX = relativeX * naturalWidth;
    const imageY = relativeY * naturalHeight;
    
    // Clamp to image bounds
    return { 
      x: Math.max(0, Math.min(naturalWidth, imageX)), 
      y: Math.max(0, Math.min(naturalHeight, imageY)) 
    };
  }, [position, scale]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.2, 10));
    setZoomLevel(prev => Math.min(Math.round(prev * 1.2), 1000));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.2, 0.1));
    setZoomLevel(prev => Math.max(Math.round(prev / 1.2), 10));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setZoomLevel(100);
    setAnnotations([]);
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => prev + 90);
  }, []);

  const handleClear = useCallback(() => {
    setAnnotations([]);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (activeTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      return;
    }

    if (activeTool === 'dot') {
      const coords = getImageCoordinates(e);
      const newPoint: Point = {
        id: `point-${Date.now()}`,
        x: coords.x,
        y: coords.y,
        timestamp: Date.now()
      };
      
      const newAnnotation: Annotation = {
        id: `annotation-${Date.now()}`,
        type: 'point',
        data: newPoint,
        color: '#ef4444'
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      return;
    }

    if (activeTool === 'line' || activeTool === 'perpendicular' || activeTool === 'measure_distance') {
      const coords = getImageCoordinates(e);
      setIsDrawing(true);
      setCurrentLine({
        id: `line-${Date.now()}`,
        startX: coords.x,
        startY: coords.y,
        endX: coords.x,
        endY: coords.y,
        isPerpendicular: activeTool === 'perpendicular',
        timestamp: Date.now()
      });
      return;
    }

    if (activeTool === 'ellipse') {
      const coords = getImageCoordinates(e);
      setIsDrawing(true);
      setCurrentEllipse({
        id: `ellipse-${Date.now()}`,
        centerX: coords.x,
        centerY: coords.y,
        radiusX: 0,
        radiusY: 0,
        timestamp: Date.now()
      });
      return;
    }
  }, [activeTool, position, getImageCoordinates]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isDragging && activeTool === 'pan') {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    if (isDrawing && currentLine) {
      const coords = getImageCoordinates(e);
      const distance = Math.sqrt(Math.pow(coords.x - currentLine.startX!, 2) + Math.pow(coords.y - currentLine.startY!, 2));
      const angle = Math.atan2(coords.y - currentLine.startY!, coords.x - currentLine.startX!) * (180 / Math.PI);
      
      setCurrentLine(prev => prev ? {
        ...prev,
        endX: coords.x,
        endY: coords.y,
        distance: distance,
        angle: angle
      } : null);
      return;
    }

    if (isDrawing && currentEllipse) {
      const coords = getImageCoordinates(e);
      setCurrentEllipse(prev => prev && prev.centerX !== undefined && prev.centerY !== undefined ? {
        ...prev,
        radiusX: Math.abs(coords.x - prev.centerX),
        radiusY: Math.abs(coords.y - prev.centerY)
      } : null);
      return;
    }
  }, [isDragging, dragStart, position, activeTool, isDrawing, currentLine, currentEllipse, getImageCoordinates]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    if (isDrawing && currentLine) {
      const coords = getImageCoordinates(e);
      const finalLine: Line = {
        ...currentLine,
        endX: coords.x,
        endY: coords.y,
        distance: Math.sqrt(Math.pow(coords.x - currentLine.startX!, 2) + Math.pow(coords.y - currentLine.startY!, 2)),
        angle: Math.atan2(coords.y - currentLine.startY!, coords.x - currentLine.startX!) * (180 / Math.PI)
      } as Line;
      
      const newAnnotation: Annotation = {
        id: currentLine.id!,
        type: 'line',
        data: finalLine,
        color: activeTool === 'measure_distance' ? '#3b82f6' : '#ef4444'
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      setCurrentLine(null);
      setIsDrawing(false);
      return;
    }

    if (isDrawing && currentEllipse) {
      const coords = getImageCoordinates(e);
      const finalEllipse: Ellipse = {
        ...currentEllipse,
        radiusX: Math.abs(coords.x - currentEllipse.centerX!),
        radiusY: Math.abs(coords.y - currentEllipse.centerY!)
      } as Ellipse;
      
      const newAnnotation: Annotation = {
        id: currentEllipse.id!,
        type: 'ellipse',
        data: finalEllipse,
        color: '#10b981'
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      setCurrentEllipse(null);
      setIsDrawing(false);
      return;
    }
  }, [isDragging, isDrawing, currentLine, currentEllipse, activeTool, getImageCoordinates]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(10, scale * delta));
    setScale(newScale);
    setZoomLevel(Math.round(newScale * 100));
  }, [scale]);

  const handlePrevImage = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    handleReset();
  }, [images.length, handleReset]);

  const handleNextImage = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    handleReset();
  }, [images.length, handleReset]);

  const drawAnnotations = useCallback(() => {
    const canvas = canvasRef.current;
    const container = imageRef.current;
    const img = container?.querySelector('img');
    if (!canvas || !container || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get image scaling factors
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const displayedWidth = img.offsetWidth / scale;
    const displayedHeight = img.offsetHeight / scale;
    
    // Calculate image position within container (centered)
    const imageLeft = (rect.width - displayedWidth) / 2;
    const imageTop = (rect.height - displayedHeight) / 2;
    
    // Scale factor from natural to displayed
    const scaleX = displayedWidth / naturalWidth;
    const scaleY = displayedHeight / naturalHeight;

    // Convert image coordinates to canvas coordinates
    const toCanvasCoords = (imageX: number, imageY: number) => {
      return {
        x: imageX * scaleX + imageLeft + position.x,
        y: imageY * scaleY + imageTop + position.y
      };
    };

    // Draw existing annotations
    annotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color;
      ctx.fillStyle = annotation.color;
      ctx.lineWidth = 2;
      ctx.font = '12px Arial';

      if (annotation.type === 'point') {
        const point = annotation.data as Point;
        const coords = toCanvasCoords(point.x, point.y);
        
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }

      if (annotation.type === 'line') {
        const line = annotation.data as Line;
        const startCoords = toCanvasCoords(line.startX, line.startY);
        const endCoords = toCanvasCoords(line.endX, line.endY);

        ctx.beginPath();
        ctx.moveTo(startCoords.x, startCoords.y);
        ctx.lineTo(endCoords.x, endCoords.y);
        ctx.stroke();

        // Draw distance/angle text
        if (line.distance !== undefined) {
          const midX = (startCoords.x + endCoords.x) / 2;
          const midY = (startCoords.y + endCoords.y) / 2;
          
          let text = `${Math.round(line.distance)}px`;
          if (line.angle !== undefined) {
            text += ` (${Math.round(line.angle)}°)`;
          }
          
          ctx.fillStyle = annotation.color;
          ctx.fillRect(midX - ctx.measureText(text).width/2 - 2, midY - 15, ctx.measureText(text).width + 4, 14);
          ctx.fillStyle = 'white';
          ctx.fillText(text, midX, midY - 3);
        }
      }

      if (annotation.type === 'ellipse') {
        const ellipse = annotation.data as Ellipse;
        const centerCoords = toCanvasCoords(ellipse.centerX, ellipse.centerY);
        const radiusX = ellipse.radiusX * scaleX;
        const radiusY = ellipse.radiusY * scaleY;

        ctx.beginPath();
        ctx.ellipse(centerCoords.x, centerCoords.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw current line being drawn
    if (currentLine) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      const startCoords = toCanvasCoords(currentLine.startX!, currentLine.startY!);
      const endCoords = toCanvasCoords(currentLine.endX!, currentLine.endY!);

      ctx.beginPath();
      ctx.moveTo(startCoords.x, startCoords.y);
      ctx.lineTo(endCoords.x, endCoords.y);
      ctx.stroke();

      // Draw preview text
      if (currentLine.distance !== undefined) {
        const midX = (startCoords.x + endCoords.x) / 2;
        const midY = (startCoords.y + endCoords.y) / 2;
        const text = `${Math.round(currentLine.distance)}px`;
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(midX - ctx.measureText(text).width/2 - 2, midY - 15, ctx.measureText(text).width + 4, 14);
        ctx.fillStyle = 'white';
        ctx.fillText(text, midX, midY - 3);
      }
    }

    // Draw current ellipse being drawn
    if (currentEllipse) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      const centerCoords = toCanvasCoords(currentEllipse.centerX!, currentEllipse.centerY!);
      const radiusX = currentEllipse.radiusX! * scaleX;
      const radiusY = currentEllipse.radiusY! * scaleY;

      ctx.beginPath();
      ctx.ellipse(centerCoords.x, centerCoords.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [annotations, currentLine, currentEllipse, scale, position]);

  useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const ToolButton = ({ tool, icon: Icon, label, onClick }: {
    tool: string;
    icon: React.ElementType;
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        activeTool === tool 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        {/* Sidebar Tools */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: showTools ? 0 : -100, opacity: showTools ? 1 : 0 }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-lg p-3 flex flex-col gap-2 shadow-2xl z-30"
        >
          {/* Navigation Tools */}
          <ToolButton
            tool="pan"
            icon={Move}
            label="Pan Tool - Déplacer l'image"
            onClick={() => setActiveTool('pan')}
          />

          <div className="border-t border-gray-600 my-2" />

          {/* Drawing Tools */}
          <ToolButton
            tool="dot"
            icon={Dot}
            label="Dot - Marquer un point"
            onClick={() => setActiveTool('dot')}
          />
          <ToolButton
            tool="line"
            icon={Minus}
            label="Line - Dessiner une ligne"
            onClick={() => setActiveTool('line')}
          />
          <ToolButton
            tool="perpendicular"
            icon={Square}
            label="Perpendicular Line - Ligne perpendiculaire"
            onClick={() => setActiveTool('perpendicular')}
          />
          <ToolButton
            tool="ellipse"
            icon={Circle}
            label="Ellipse - Dessiner un cercle/ellipse"
            onClick={() => setActiveTool('ellipse')}
          />

          <div className="border-t border-gray-600 my-2" />

          {/* Measurement Tools */}
          <ToolButton
            tool="measure_distance"
            icon={Ruler}
            label="Measure Distance - Mesurer une distance"
            onClick={() => setActiveTool('measure_distance')}
          />

          <div className="border-t border-gray-600 my-2" />

          {/* Transform Tools */}
          <ToolButton
            tool="rotate"
            icon={RotateIcon}
            label="Rotate Image - Rotation 90°"
            onClick={handleRotate}
          />

          <div className="border-t border-gray-600 my-2" />

          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <div className="px-3 py-1 bg-gray-700 rounded text-white text-xs font-medium text-center min-w-[60px]">
            {zoomLevel}%
          </div>
          
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="border-t border-gray-600 my-2" />

          {/* Action Buttons */}
          <button
            onClick={handleReset}
            className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
            title="Reset View - Réinitialiser"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            title="Clear Image - Effacer les annotations"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Main Image Container */}
        <div className="relative flex-1 max-w-6xl max-h-full p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-lg overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between z-20 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTools(!showTools)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                  title="Toggle Tools"
                >
                  <Move className="w-5 h-5 text-white" />
                </button>
                <span className="text-white text-sm font-medium">
                  Advanced Image Viewer
                </span>
                {images.length > 1 && (
                  <span className="text-gray-400 text-sm">
                    {currentIndex + 1} of {images.length}
                  </span>
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
              ref={imageRef}
              className="relative mt-14 mb-16 flex items-center justify-center overflow-hidden bg-gray-100"
              style={{ height: '70vh' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setIsDragging(false)}
              onWheel={handleWheel}
            >
              <motion.div
                animate={{
                  x: position.x,
                  y: position.y,
                  scale: scale,
                  rotate: rotation
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative select-none"
                style={{
                  cursor: activeTool === 'pan' ? (isDragging ? 'grabbing' : 'grab') : 
                          activeTool === 'dot' ? 'crosshair' :
                          activeTool === 'line' ? 'crosshair' :
                          activeTool === 'perpendicular' ? 'crosshair' :
                          activeTool === 'measure_distance' ? 'crosshair' :
                          activeTool === 'ellipse' ? 'crosshair' :
                          'default'
                }}
              >
                <img
                  src={images[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
                
                {/* Measurement Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 10 }}
                />
              </motion.div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm px-4 py-3 z-20 border-t border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-2">
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

                {/* Status */}
                <div className="text-gray-400 text-xs">
                  {activeTool === 'pan' ? '🖱️ Drag to pan' : 
                   activeTool === 'dot' ? '📍 Click to place dot' : 
                   activeTool === 'line' ? '📏 Drag to draw line' : 
                   activeTool === 'perpendicular' ? '📐 Drag for perpendicular line' : 
                   activeTool === 'measure_distance' ? '📏 Drag to measure distance' : 
                   activeTool === 'ellipse' ? '⭕ Drag to draw ellipse' : 
                   '🔧 Select a tool'}
                </div>

                {/* Clear Annotations */}
                {annotations.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    Clear Annotations ({annotations.length})
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AdvancedImageViewer;
