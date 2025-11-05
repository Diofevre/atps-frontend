'use client'

import React, { useState } from 'react';
import { MenuSidebar } from "@/lib/menu-sidebar";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`fixed left-0 top-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isOpen ? "w-60" : "w-20"
      }`}
      style={{ 
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-5 pt-3">
        <Link href='/dashboard' className="flex items-center h-[40px] relative">
          <div className="relative flex-shrink-0">
            <Image
              src={isOpen ? "/atps.png" : "/atps-default.png"}
              alt="ATPS LOGO"
              height={isOpen ? 100 : 40}
              width={isOpen ? 100 : 40}
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
                className={`flex items-center gap-3 p-3 mb-1 cursor-pointer rounded-md transition-all duration-200 ${
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
    </div>
  );
};

export default Sidebar;
