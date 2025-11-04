/**
 * Device Detection Utilities
 * 
 * Centralized utilities for detecting device types and capabilities
 * to avoid code duplication across components.
 */

/**
 * Check if the current device is a mobile or tablet
 * Uses Tailwind's `lg` breakpoint (1024px) as the threshold
 * 
 * @returns {boolean} True if device width is less than 1024px
 */
export const isMobileOrTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024; // lg breakpoint de Tailwind
};

/**
 * Check if the current device is mobile (typically < 768px)
 * 
 * @returns {boolean} True if device width is less than 768px
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // md breakpoint de Tailwind
};

/**
 * Check if the current device is tablet (typically 768px - 1023px)
 * 
 * @returns {boolean} True if device width is between 768px and 1023px
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= 768 && width < 1024;
};

/**
 * Check if the current device is desktop (>= 1024px)
 * 
 * @returns {boolean} True if device width is 1024px or greater
 */
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return true; // SSR: assume desktop
  return window.innerWidth >= 1024;
};

/**
 * Get current viewport width
 * 
 * @returns {number} Current viewport width in pixels
 */
export const getViewportWidth = (): number => {
  if (typeof window === 'undefined') return 1024; // SSR: default to desktop
  return window.innerWidth;
};

/**
 * Get current viewport height
 * 
 * @returns {number} Current viewport height in pixels
 */
export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') return 768; // SSR: default
  return window.innerHeight;
};
