'use client'

import React, { useState, useEffect, useRef } from 'react';
import { MenuSidebar } from "@/lib/menu-sidebar";
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdvancedThemeSwitch } from '@/components/advanced-theme-switch';
import { useTheme } from 'next-themes';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fonction pour détecter si on est sur un petit écran (tablette/téléphone)
  const isMobileOrTablet = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024; // lg breakpoint de Tailwind
  };

  // Réduire la sidebar automatiquement sur tablette/téléphone quand on clique à l'extérieur
  useEffect(() => {
    if (!isMobileOrTablet()) return; // Seulement sur tablette/téléphone

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Ajouter les event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Nettoyer les event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Réduire la sidebar automatiquement sur tablette/téléphone quand on change de route
  useEffect(() => {
    if (isMobileOrTablet() && isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={() => {
        // Sur desktop, ouvrir au survol
        if (!isMobileOrTablet()) {
          setIsOpen(true);
        }
      }}
      onMouseLeave={() => {
        // Sur desktop, fermer quand on quitte
        if (!isMobileOrTablet()) {
          setIsOpen(false);
        }
      }}
      onTouchStart={(e) => {
        // Sur tablette, ouvrir au touch
        if (isMobileOrTablet() && !isOpen) {
          setIsOpen(true);
          e.stopPropagation();
        }
      }}
      className={`fixed left-0 top-0 z-50 max-h-screen overflow-hidden flex flex-col bg-sidebar border-r border-sidebar-border ${
        isOpen ? "w-60" : "w-20"
      }`}
      style={{ 
        height: '100dvh', // Dynamic viewport height for mobile
      }}
    >
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-5 pt-3">
        <Link href='/dashboard' className="flex items-center h-[40px] relative">
          <div className="relative flex-shrink-0">
            <Image
              src={isOpen ? "/atps.png" : "/atps-default.png"}
              alt="ATPS LOGO"
              height={isOpen ? 100 :40}
              width={isOpen ? 100 :40}
              className="transition-transform duration-300"
            />
          </div>
          <div 
            className={`flex items-center overflow-hidden transition-all duration-300 ${
              isOpen ? "w-auto opacity-100 ml-2" : "w-0 opacity-0"
            }`}
          >
            <span className="text-[30px] text-sidebar-foreground flex-shrink-0">|</span>
            <span className="text-[10px] font-semibold text-sidebar-foreground whitespace-nowrap ml-2">
              Airline Transport <br /> Pilot School
            </span>
          </div>
        </Link>
      </div>

      {/* Menu - Takes available space, no scroll */}
      <ul className="flex-1 flex flex-col justify-center px-5 min-h-0">
        {MenuSidebar.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <li className={`text-sm flex items-center gap-3 p-2 mt-2 cursor-pointer hover:bg-sidebar-accent active:bg-sidebar-accent rounded-md transition-colors duration-200 hover:text-[#EECE84] text-sidebar-foreground touch-manipulation ${
              pathname.startsWith(menu.path) && 'text-[#EECE84] bg-sidebar-accent'
            }`}>
              <span className="text-2xl min-w-[24px] flex-shrink-0">
                <menu.icon />
              </span>
              <span className={`text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isOpen ? "opacity-100 w-32" : "opacity-0 w-0"
              }`}>
                {menu.title}
              </span>
            </li>
          </Link>
        ))}
      </ul>

      {/* Theme Toggle Section - Fixed at bottom, always visible */}
      <div className="flex-shrink-0 p-5 pb-5 border-t border-sidebar-border">
        <div className={`flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'opacity-100 w-auto' : 'opacity-100 w-auto justify-center'
        }`}>
          {isOpen ? (
            <AdvancedThemeSwitch />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              className="p-2 rounded-lg hover:bg-sidebar-accent active:bg-sidebar-accent transition-colors duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center w-full"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-6 h-6 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;