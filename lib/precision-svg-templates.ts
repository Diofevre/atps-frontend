// Templates SVG haute précision pour l'aviation
// Chaque template utilise des coordonnées exactes et des calculs précis

export const precisionSVGTemplates = {
  // Template pour courbes de performance avec précision mathématique
  performanceCurve: {
    title: "Courbe de Performance Précise",
    generate: (data: {
      thrustPoints: Array<{x: number, y: number}>,
      dragPoints: Array<{x: number, y: number}>,
      intersection?: {x: number, y: number},
      xAxis: {min: number, max: number, label: string},
      yAxis: {min: number, max: number, label: string}
    }) => {
      const width = 500;
      const height = 350;
      const margin = {top: 40, right: 60, bottom: 60, left: 80};
      const plotWidth = width - margin.left - margin.right;
      const plotHeight = height - margin.top - margin.bottom;

      // Calculs précis pour les échelles
      const xScale = plotWidth / (data.xAxis.max - data.xAxis.min);
      const yScale = plotHeight / (data.yAxis.max - data.yAxis.min);

      // Conversion des points en coordonnées SVG précises
      const thrustPath = data.thrustPoints.map((point, i) => {
        const x = margin.left + (point.x - data.xAxis.min) * xScale;
        const y = margin.top + plotHeight - (point.y - data.yAxis.min) * yScale;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(' ');

      const dragPath = data.dragPoints.map((point, i) => {
        const x = margin.left + (point.x - data.xAxis.min) * xScale;
        const y = margin.top + plotHeight - (point.y - data.yAxis.min) * yScale;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(' ');

      // Grille de précision
      const gridLines = [];
      for (let i = 0; i <= 10; i++) {
        const x = margin.left + (i / 10) * plotWidth;
        const y = margin.top + (i / 10) * plotHeight;
        
        gridLines.push(`<line x1="${x.toFixed(2)}" y1="${margin.top}" x2="${x.toFixed(2)}" y2="${margin.top + plotHeight}" stroke="#e5e7eb" stroke-width="0.5" opacity="0.3"/>`);
        gridLines.push(`<line x1="${margin.left}" y1="${y.toFixed(2)}" x2="${margin.left + plotWidth}" y2="${y.toFixed(2)}" stroke="#e5e7eb" stroke-width="0.5" opacity="0.3"/>`);
      }

      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        <defs>
          <pattern id="precisionGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" stroke-width="0.5"/>
          </pattern>
        </defs>
        
        <!-- Background avec grille de précision -->
        <rect width="${width}" height="${height}" fill="url(#precisionGrid)" opacity="0.1"/>
        
        <!-- Grille principale -->
        ${gridLines.join('')}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#374151" stroke-width="2" shape-rendering="geometricPrecision"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#374151" stroke-width="2" shape-rendering="geometricPrecision"/>
        
        <!-- Courbe de thrust -->
        <path d="${thrustPath}" stroke="#dc2626" stroke-width="3" fill="none" shape-rendering="geometricPrecision"/>
        
        <!-- Courbe de drag -->
        <path d="${dragPath}" stroke="#2563eb" stroke-width="3" fill="none" shape-rendering="geometricPrecision"/>
        
        ${data.intersection ? `
        <!-- Point d'intersection précis -->
        <circle cx="${(margin.left + (data.intersection.x - data.xAxis.min) * xScale).toFixed(2)}" 
                cy="${(margin.top + plotHeight - (data.intersection.y - data.yAxis.min) * yScale).toFixed(2)}" 
                r="4" fill="#059669" shape-rendering="geometricPrecision"/>
        ` : ''}
        
        <!-- Labels des axes -->
        <text x="${margin.left + plotWidth / 2}" y="${height - 10}" font-family="Arial" font-size="12" fill="#374151" text-anchor="middle" text-rendering="geometricPrecision">${data.xAxis.label}</text>
        <text x="15" y="${margin.top + plotHeight / 2}" font-family="Arial" font-size="12" fill="#374151" text-anchor="middle" transform="rotate(-90, 15, ${margin.top + plotHeight / 2})" text-rendering="geometricPrecision">${data.yAxis.label}</text>
        
        <!-- Titre -->
        <text x="${width / 2}" y="20" font-family="Arial" font-size="14" font-weight="bold" fill="#1f2937" text-anchor="middle" text-rendering="geometricPrecision">Courbe de Performance</text>
      </svg>`;
    }
  },

  // Template pour workflows avec positions exactes
  workflow: {
    title: "Workflow Aviation Précise",
    generate: (data: {
      steps: Array<{
        id: string,
        label: string,
        x: number,
        y: number,
        type: 'process' | 'decision' | 'start' | 'end'
      }>,
      connections: Array<{
        from: string,
        to: string,
        label?: string
      }>
    }) => {
      const width = 600;
      const height = 400;
      const stepWidth = 120;
      const stepHeight = 60;

      // Génération des étapes avec positions précises
      const steps = data.steps.map(step => {
        const rectX = step.x - stepWidth / 2;
        const rectY = step.y - stepHeight / 2;
        
        let shape = '';
        let className = '';
        
        switch (step.type) {
          case 'start':
            shape = `<ellipse cx="${step.x}" cy="${step.y}" rx="${stepWidth / 2}" ry="${stepHeight / 2}" fill="#10b981" stroke="#059669" stroke-width="2" shape-rendering="geometricPrecision"/>`;
            className = 'start-step';
            break;
          case 'end':
            shape = `<ellipse cx="${step.x}" cy="${step.y}" rx="${stepWidth / 2}" ry="${stepHeight / 2}" fill="#ef4444" stroke="#dc2626" stroke-width="2" shape-rendering="geometricPrecision"/>`;
            className = 'end-step';
            break;
          case 'decision':
            const diamondPoints = [
              `${step.x},${step.y - stepHeight / 2}`,
              `${step.x + stepWidth / 2},${step.y}`,
              `${step.x},${step.y + stepHeight / 2}`,
              `${step.x - stepWidth / 2},${step.y}`
            ].join(' ');
            shape = `<polygon points="${diamondPoints}" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" shape-rendering="geometricPrecision"/>`;
            className = 'decision-step';
            break;
          default:
            shape = `<rect x="${rectX}" y="${rectY}" width="${stepWidth}" height="${stepHeight}" rx="8" fill="#3b82f6" stroke="#2563eb" stroke-width="2" shape-rendering="geometricPrecision"/>`;
            className = 'process-step';
        }
        
        return `
          <g class="${className}">
            ${shape}
            <text x="${step.x}" y="${step.y + 5}" font-family="Arial" font-size="11" fill="white" text-anchor="middle" text-rendering="geometricPrecision">${step.label}</text>
          </g>
        `;
      }).join('');

      // Génération des connexions avec calculs précis
      const connections = data.connections.map(conn => {
        const fromStep = data.steps.find(s => s.id === conn.from);
        const toStep = data.steps.find(s => s.id === conn.to);
        
        if (!fromStep || !toStep) return '';
        
        // Calcul précis des points de connexion
        const dx = toStep.x - fromStep.x;
        const dy = toStep.y - fromStep.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Points de connexion sur les bords des formes
        const fromX = fromStep.x + (dx / distance) * (stepWidth / 2);
        const fromY = fromStep.y + (dy / distance) * (stepHeight / 2);
        const toX = toStep.x - (dx / distance) * (stepWidth / 2);
        const toY = toStep.y - (dy / distance) * (stepHeight / 2);
        
        // Flèche précise
        const arrowLength = 10;
        const arrowAngle = Math.atan2(dy, dx);
        const arrowX1 = toX - arrowLength * Math.cos(arrowAngle - Math.PI / 6);
        const arrowY1 = toY - arrowLength * Math.sin(arrowAngle - Math.PI / 6);
        const arrowX2 = toX - arrowLength * Math.cos(arrowAngle + Math.PI / 6);
        const arrowY2 = toY - arrowLength * Math.sin(arrowAngle + Math.PI / 6);
        
        return `
          <g class="connection">
            <line x1="${fromX.toFixed(2)}" y1="${fromY.toFixed(2)}" x2="${toX.toFixed(2)}" y2="${toY.toFixed(2)}" 
                  stroke="#6b7280" stroke-width="2" shape-rendering="geometricPrecision"/>
            <polygon points="${toX.toFixed(2)},${toY.toFixed(2)} ${arrowX1.toFixed(2)},${arrowY1.toFixed(2)} ${arrowX2.toFixed(2)},${arrowY2.toFixed(2)}" 
                     fill="#6b7280" shape-rendering="geometricPrecision"/>
            ${conn.label ? `
              <text x="${(fromX + toX) / 2}" y="${(fromY + toY) / 2 - 5}" font-family="Arial" font-size="10" fill="#6b7280" text-anchor="middle" text-rendering="geometricPrecision">${conn.label}</text>
            ` : ''}
          </g>
        `;
      }).join('');

      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        <defs>
          <pattern id="workflowGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" stroke-width="0.5"/>
          </pattern>
        </defs>
        
        <!-- Background avec grille de précision -->
        <rect width="${width}" height="${height}" fill="url(#workflowGrid)" opacity="0.1"/>
        
        <!-- Connexions (en arrière-plan) -->
        ${connections}
        
        <!-- Étapes (au premier plan) -->
        ${steps}
        
        <!-- Titre -->
        <text x="${width / 2}" y="25" font-family="Arial" font-size="16" font-weight="bold" fill="#1f2937" text-anchor="middle" text-rendering="geometricPrecision">Workflow Aviation</text>
      </svg>`;
    }
  },

  // Template pour diagrammes de systèmes avec précision technique
  systemDiagram: {
    title: "Diagramme de Système Précise",
    generate: (data: {
      components: Array<{
        id: string,
        label: string,
        x: number,
        y: number,
        width: number,
        height: number,
        type: 'component' | 'valve' | 'pump' | 'tank'
      }>,
      pipes: Array<{
        from: string,
        to: string,
        pressure?: number,
        flow?: string
      }>
    }) => {
      const width = 700;
      const height = 500;
      
      // Génération des composants avec dimensions précises
      const components = data.components.map(comp => {
        const rectX = comp.x - comp.width / 2;
        const rectY = comp.y - comp.height / 2;
        
        let shape = '';
        let fillColor = '#e5e7eb';
        let strokeColor = '#6b7280';
        
        switch (comp.type) {
          case 'valve':
            shape = `<rect x="${rectX}" y="${rectY}" width="${comp.width}" height="${comp.height}" rx="4" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" shape-rendering="geometricPrecision"/>
                     <line x1="${comp.x - comp.width/4}" y1="${comp.y}" x2="${comp.x + comp.width/4}" y2="${comp.y}" stroke="${strokeColor}" stroke-width="3" shape-rendering="geometricPrecision"/>`;
            break;
          case 'pump':
            shape = `<circle cx="${comp.x}" cy="${comp.y}" r="${comp.width/2}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" shape-rendering="geometricPrecision"/>
                     <text x="${comp.x}" y="${comp.y + 3}" font-family="Arial" font-size="12" fill="${strokeColor}" text-anchor="middle" text-rendering="geometricPrecision">P</text>`;
            break;
          case 'tank':
            shape = `<rect x="${rectX}" y="${rectY}" width="${comp.width}" height="${comp.height}" rx="8" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" shape-rendering="geometricPrecision"/>
                     <rect x="${rectX + 5}" y="${rectY + 5}" width="${comp.width - 10}" height="${comp.height - 10}" rx="4" fill="none" stroke="${strokeColor}" stroke-width="1" shape-rendering="geometricPrecision"/>`;
            break;
          default:
            shape = `<rect x="${rectX}" y="${rectY}" width="${comp.width}" height="${comp.height}" rx="6" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" shape-rendering="geometricPrecision"/>`;
        }
        
        return `
          <g class="component-${comp.id}">
            ${shape}
            <text x="${comp.x}" y="${comp.y + comp.height/2 + 15}" font-family="Arial" font-size="10" fill="#374151" text-anchor="middle" text-rendering="geometricPrecision">${comp.label}</text>
          </g>
        `;
      }).join('');

      // Génération des tuyaux avec calculs précis
      const pipes = data.pipes.map(pipe => {
        const fromComp = data.components.find(c => c.id === pipe.from);
        const toComp = data.components.find(c => c.id === pipe.to);
        
        if (!fromComp || !toComp) return '';
        
        // Calcul précis des points de connexion
        const dx = toComp.x - fromComp.x;
        const dy = toComp.y - fromComp.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const fromX = fromComp.x + (dx / distance) * (fromComp.width / 2);
        const fromY = fromComp.y + (dy / distance) * (fromComp.height / 2);
        const toX = toComp.x - (dx / distance) * (toComp.width / 2);
        const toY = toComp.y - (dy / distance) * (toComp.height / 2);
        
        // Flèche de flux
        const arrowLength = 12;
        const arrowAngle = Math.atan2(dy, dx);
        const arrowX1 = toX - arrowLength * Math.cos(arrowAngle - Math.PI / 6);
        const arrowY1 = toY - arrowLength * Math.sin(arrowAngle - Math.PI / 6);
        const arrowX2 = toX - arrowLength * Math.cos(arrowAngle + Math.PI / 6);
        const arrowY2 = toY - arrowLength * Math.sin(arrowAngle + Math.PI / 6);
        
        return `
          <g class="pipe-${pipe.from}-${pipe.to}">
            <line x1="${fromX.toFixed(2)}" y1="${fromY.toFixed(2)}" x2="${toX.toFixed(2)}" y2="${toY.toFixed(2)}" 
                  stroke="#059669" stroke-width="4" shape-rendering="geometricPrecision"/>
            <polygon points="${toX.toFixed(2)},${toY.toFixed(2)} ${arrowX1.toFixed(2)},${arrowY1.toFixed(2)} ${arrowX2.toFixed(2)},${arrowY2.toFixed(2)}" 
                     fill="#059669" shape-rendering="geometricPrecision"/>
            ${pipe.pressure ? `
              <text x="${(fromX + toX) / 2}" y="${(fromY + toY) / 2 - 8}" font-family="Arial" font-size="9" fill="#059669" text-anchor="middle" text-rendering="geometricPrecision">${pipe.pressure} bar</text>
            ` : ''}
            ${pipe.flow ? `
              <text x="${(fromX + toX) / 2}" y="${(fromY + toY) / 2 + 8}" font-family="Arial" font-size="9" fill="#059669" text-anchor="middle" text-rendering="geometricPrecision">${pipe.flow}</text>
            ` : ''}
          </g>
        `;
      }).join('');

      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        <defs>
          <pattern id="systemGrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#f3f4f6" stroke-width="0.5"/>
          </pattern>
        </defs>
        
        <!-- Background avec grille de précision -->
        <rect width="${width}" height="${height}" fill="url(#systemGrid)" opacity="0.1"/>
        
        <!-- Tuyaux (en arrière-plan) -->
        ${pipes}
        
        <!-- Composants (au premier plan) -->
        ${components}
        
        <!-- Titre -->
        <text x="${width / 2}" y="25" font-family="Arial" font-size="16" font-weight="bold" fill="#1f2937" text-anchor="middle" text-rendering="geometricPrecision">Diagramme de Système</text>
      </svg>`;
    }
  }
};

// Fonction utilitaire pour générer des courbes mathématiques précises
export function generatePreciseCurve(points: Array<{x: number, y: number}>, smoothness: number = 0.3): string {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    if (next) {
      // Courbe de Bézier avec contrôle précis
      const cp1x = prev.x + (curr.x - prev.x) * smoothness;
      const cp1y = prev.y + (curr.y - prev.y) * smoothness;
      const cp2x = curr.x - (next.x - curr.x) * smoothness;
      const cp2y = curr.y - (next.y - curr.y) * smoothness;
      
      path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
    } else {
      path += ` L ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
    }
  }
  
  return path;
}
