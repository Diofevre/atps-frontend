/**
 * Nettoie le texte des retours à la ligne excessifs
 * Transforme 3+ retours consécutifs en maximum 2
 */
export function cleanExcessiveLineBreaks(text: string | null | undefined): string {
  if (!text) return '';

  return text
    // 1. Normaliser les <br> variants (<br/>, <br />, <BR>, etc.)
    .replace(/<br\s*\/?>/gi, '<br/>')
    
    // 2. Réduire les <br/> multiples → max 2
    .replace(/(<br\/>[\s]*){3,}/gi, '<br/><br/>')
    
    // 3. Réduire les \n multiples → max 2
    .replace(/\n{3,}/g, '\n\n')
    
    // 4. Nettoyer espaces autour des <br/>
    .replace(/\s*<br\/>\s*/gi, '<br/>')
    
    // 5. Réduire espaces multiples → 1 espace
    .replace(/ {2,}/g, ' ')
    
    // 6. Trim début et fin
    .trim();
}

/**
 * Nettoie le HTML pour l'affichage
 * Version plus agressive pour les explications longues
 */
export function cleanHTML(html: string | null | undefined): string {
  if (!html) return '';

  return html
    // 1. Normaliser <br>
    .replace(/<br\s*\/?>/gi, '<br/>')
    
    // 2. Multiple <br/> → 2 max
    .replace(/(<br\/>[\s\n]*){3,}/gi, '<br/><br/>')
    
    // 3. Espaces avant/après <p>
    .replace(/<p>\s+/gi, '<p>')
    .replace(/\s+<\/p>/gi, '</p>')
    
    // 4. Multiple </p><p> avec espace → normal
    .replace(/<\/p>\s*<p>/gi, '</p><p>')
    
    // 5. Nettoyer &nbsp; excessifs
    .replace(/(&nbsp;){3,}/gi, '&nbsp;&nbsp;')
    
    // 6. Trim
    .trim();
}

/**
 * Formatage pour affichage React (dangerouslySetInnerHTML)
 */
export function formatForDisplay(text: string | null | undefined): string {
  const cleaned = cleanExcessiveLineBreaks(text);
  
  // Convertir \n en <br/> pour l'affichage HTML
  return cleaned.replace(/\n/g, '<br/>');
}







