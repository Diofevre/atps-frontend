'use client'

import React, { useState } from 'react';
import { MenuSidebar } from "@/lib/menu-sidebar";
import Image from "next/image";
import { GiUpgrade } from "react-icons/gi";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdvancedThemeSwitch } from '@/components/advanced-theme-switch';
import { useTheme } from 'next-themes';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`h-screen p-5 pt-3 transition-all duration-300 flex flex-col ${
        isOpen ? "w-60" : "w-20"
      }`}
    >
      <Link href='/dashboard' className="flex items-center h-[40px] mb-8 relative mt-2">
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
          <span className="text-[30px] text-gray-700 flex-shrink-0">|</span>
          <span className="text-[10px] font-semibold text-gray-700 whitespace-nowrap ml-2">
            Airline Transport <br /> Pilot School
          </span>
        </div>
      </Link>

      {/* Centered Menu */}
      <ul className="flex-1 flex flex-col justify-center">
        {MenuSidebar.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <li className={`text-sm flex items-center gap-3 p-2 mt-2 cursor-pointer hover:bg-primary/5 rounded-md transition-colors duration-200 hover:text-[#EECE84] ${
              pathname.startsWith(menu.path) && 'text-[#EECE84] bg-primary/5'
            }`}>
              <span className="text-2xl min-w-[24px]">
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

      {/* Theme Toggle Section */}
      <div className={`mb-4 ${isOpen ? 'px-2' : 'px-2'}`}>
        <div className={`flex items-center transition-all duration-300 ${
          isOpen ? 'opacity-100 w-auto' : 'opacity-100 w-auto justify-center'
        }`}>
          {isOpen ? (
            <AdvancedThemeSwitch />
          ) : (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-primary/5 transition-colors duration-200"
              title="Toggle theme"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Mode Section */}
      <div 
        onClick={() => router.push('/settings')}
        className={`cursor-pointer hover:bg-primary/5 rounded-md transition-colors duration-200 hover:text-[#EECE84] ${
          pathname === '/settings' && 'text-[#EECE84] bg-primary/5'
        }`}
      >
        <div className={`flex items-center gap-2 ${isOpen && 'p-2'}`}>
          <GiUpgrade className="text-2xl min-w-[24px] ml-2" />
          <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isOpen ? "opacity-100 w-32" : "opacity-0 w-0"
          }`}>
            <span className="text-[14px] text-gray-700">
              Upgrade plan
            </span>
            <span className="text-[10px] text-gray-600">
              More access to the features
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;