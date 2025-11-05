'use client'

import React, { useState, useEffect, useRef } from 'react';
import { MenuSidebar } from "@/lib/menu-sidebar";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdvancedThemeSwitch } from '@/components/advanced-theme-switch';
import { useTheme } from 'next-themes';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Détecter si on est sur mobile/tablette
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fermer la sidebar quand on clique à l'extérieur (uniquement pour mobile/tablette)
  useEffect(() => {
    if (!isMobile) return; // Ne pas fermer sur desktop

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Fermer la sidebar automatiquement quand on change de route (uniquement pour mobile/tablette)
  useEffect(() => {
    if (!isMobile || !isOpen) return; // Ne pas fermer sur desktop ou si déjà fermé

    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Délai plus long pour éviter les conflits
    return () => clearTimeout(timer);
  }, [pathname, isOpen, isMobile]);

  // Gérer l'ouverture/fermeture selon le type d'appareil
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      setIsOpen(false);
    }
  };

  // Sur mobile/tablette, permettre l'ouverture manuelle
  const handleToggle = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={isMobile ? handleToggle : undefined}
      className={`fixed left-0 top-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isOpen ? "w-60" : "w-20"
      }`}
      style={{ 
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden', // Empêcher le scroll sur la sidebar elle-même
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

      {/* Menu - Scrollable if needed */}
      <ul className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4" style={{ minHeight: 0 }}>
        {MenuSidebar.map((menu, index) => {
          const isActive = pathname.startsWith(menu.path);
          
          return (
            <Link href={menu.path} key={index}>
              <li 
                className={`flex items-center gap-3 p-3 mb-1 cursor-pointer rounded-md transition-all duration-200 touch-manipulation ${
                  isActive
                    ? 'bg-[#EECE84] dark:bg-[#EECE84] text-gray-900 dark:text-gray-900 shadow-md'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-[#EECE84]'
                }`}
              >
                <span className={`text-2xl min-w-[24px] flex-shrink-0 flex items-center justify-center ${
                  isActive ? 'text-gray-900' : 'text-sidebar-foreground'
                }`}>
                  <menu.icon />
                </span>
                <span className={`text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                } ${isActive ? 'text-gray-900 font-semibold' : ''}`}>
                  {menu.title}
                </span>
              </li>
            </Link>
          );
        })}
      </ul>

      {/* Theme Toggle Section - Fixed at bottom, always visible */}
      <div className="flex-shrink-0 p-5 pb-5 border-t border-sidebar-border">
        <div className={`flex items-center transition-all duration-300 ${
          isOpen ? 'opacity-100 w-full justify-start' : 'opacity-100 w-full justify-center'
        }`}>
          {isOpen ? (
            <AdvancedThemeSwitch />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const newTheme = theme === "dark" ? "light" : "dark";
                setTheme(newTheme);
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