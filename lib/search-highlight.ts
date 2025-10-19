/**
 * Fonction utilitaire pour surligner les mots recherchés dans un texte
 * @param text - Le texte dans lequel surligner
 * @param searchTerm - Le terme de recherche à surligner
 * @returns Le texte avec les mots recherchés surlignés en HTML
 */
export const highlightSearchTerms = (text: string, searchTerm: string): string => {
  if (!searchTerm || !text) return text;
  
  // Diviser le terme de recherche en mots individuels
  const searchWords = searchTerm.trim().split(/\s+/).filter(word => word.length > 0);
  
  let highlightedText = text;
  
  // Surligner chaque mot de recherche
  searchWords.forEach(word => {
    // Créer une regex insensible à la casse pour chaque mot
    const regex = new RegExp(`\\b(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
  });
  
  return highlightedText;
};
