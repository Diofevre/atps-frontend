// Test script pour vérifier le rendu SVG dans le chatbot
// Ce script peut être exécuté dans la console du navigateur pour tester

const testSVGContent = `
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- VOR Station Diagram -->
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" stroke-width="1"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="300" height="200" fill="url(#grid)" />
  
  <!-- VOR Station Circle -->
  <circle cx="150" cy="100" r="60" stroke="#2563eb" stroke-width="3" fill="none" />
  
  <!-- Cardinal Directions -->
  <line x1="150" y1="40" x2="150" y2="160" stroke="#dc2626" stroke-width="2" />
  <line x1="90" y1="100" x2="210" y2="100" stroke="#dc2626" stroke-width="2" />
  
  <!-- VOR Station Center -->
  <circle cx="150" cy="100" r="8" fill="#dc2626" />
  
  <!-- Labels -->
  <text x="155" y="35" font-family="Arial" font-size="12" fill="#374151">N</text>
  <text x="155" y="175" font-family="Arial" font-size="12" fill="#374151">S</text>
  <text x="85" y="105" font-family="Arial" font-size="12" fill="#374151">W</text>
  <text x="215" y="105" font-family="Arial" font-size="12" fill="#374151">E</text>
  
  <!-- VOR Label -->
  <text x="150" y="120" font-family="Arial" font-size="14" font-weight="bold" fill="#1f2937" text-anchor="middle">VOR</text>
  
  <!-- Frequency -->
  <text x="150" y="140" font-family="Arial" font-size="10" fill="#6b7280" text-anchor="middle">108.5 MHz</text>
</svg>
`;

const testMessage = `
Voici un diagramme d'une station VOR (VHF Omnidirectional Range) :

${testSVGContent}

**Explication :**
- Le cercle bleu représente la zone de couverture de la station VOR
- Les lignes rouges indiquent les directions cardinales (N, S, E, W)
- Le point rouge central est la station VOR
- La fréquence est affichée en bas

Ce type de diagramme est essentiel pour comprendre la navigation aérienne.
`;

// Fonction pour tester le rendu SVG
function testSVGRendering() {
  console.log('🧪 Test du rendu SVG dans le chatbot');
  
  // Simuler l'extraction des SVG
  const svgMatches = testMessage.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi);
  console.log('SVG détectés:', svgMatches?.length || 0);
  
  if (svgMatches) {
    svgMatches.forEach((svg, index) => {
      console.log(`SVG ${index + 1}:`, svg.substring(0, 100) + '...');
    });
  }
  
  return {
    message: testMessage,
    svgCount: svgMatches?.length || 0,
    isValid: svgMatches && svgMatches.length > 0
  };
}

// Exporter pour utilisation dans le navigateur
if (typeof window !== 'undefined') {
  window.testSVGRendering = testSVGRendering;
  window.testSVGContent = testSVGContent;
  window.testMessage = testMessage;
}

console.log('✅ Script de test SVG chargé. Utilisez testSVGRendering() pour tester.');
