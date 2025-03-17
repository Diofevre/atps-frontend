'use client'

import { Shield, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header for mobile */}
      <div className={`lg:hidden w-full ${isDark ? 'bg-[#EECE84]/70' : 'bg-[#EECE84]/90'} py-6 relative`}>
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-10 h-10 mx-auto text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 mt-2">ATPS Security</h1>
        </div>
      </div>

      {/* Theme toggle button - visible on all screens */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-4 right-4 p-2 rounded-full z-50 transition-colors
          ${isDark ? 'bg-gray-800 text-[#EECE84] hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main content */}
      <div className={`flex-1 flex items-center justify-center p-4 lg:p-0 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side decorative panel */}
      <div className={`hidden lg:flex lg:w-[45%] relative overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Professional gradient overlay */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-[#EECE84]/5 to-gray-900' 
            : 'bg-gradient-to-br from-gray-50 via-[#EECE84]/10 to-gray-50'
        }`} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${isDark ? 'opacity-3' : 'opacity-5'}`}>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }} />
          </div>
        </div>
        
        {/* Content overlay with glass effect */}
        <div className={`relative w-full flex flex-col items-center justify-center p-12 ${isDark ? 'text-[#EECE84]' : 'text-gray-900'}`}>
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo container with subtle shadow */}
            <div className={`${
              isDark 
                ? 'bg-gradient-to-br from-[#EECE84]/20 to-[#EECE84]/10' 
                : 'bg-gradient-to-br from-[#EECE84] to-[#EECE84]/80'
            } p-8 rounded-2xl shadow-2xl mb-8 backdrop-blur-md`}>
              <Shield className={`w-20 h-20 ${isDark ? 'text-[#EECE84]' : 'text-gray-900'}`} />
            </div>
            
            {/* Text content */}
            <h2 className="text-5xl font-bold mb-6 text-center bg-clip-text">ATPS Security</h2>
            <div className={`w-24 h-1 ${isDark ? 'bg-gradient-to-r from-[#EECE84]/0 via-[#EECE84]/50 to-[#EECE84]/0' : 'bg-gradient-to-r from-[#EECE84]/0 via-[#EECE84] to-[#EECE84]/0'} mb-6`} />
            <p className={`text-xl text-center max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
              Protecting your digital assets with industry-leading security solutions
            </p>
          </div>
          
          {/* Professional accent elements */}
          <div className={`absolute top-0 right-0 w-96 h-96 ${
            isDark 
              ? 'bg-gradient-to-br from-[#EECE84]/5 to-transparent' 
              : 'bg-gradient-to-br from-[#EECE84]/20 to-transparent'
          } rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
          <div className={`absolute bottom-0 left-0 w-96 h-96 ${
            isDark 
              ? 'bg-gradient-to-tl from-[#EECE84]/5 to-transparent' 
              : 'bg-gradient-to-tl from-[#EECE84]/20 to-transparent'
          } rounded-full blur-3xl translate-y-1/2 -translate-x-1/2`} />
        </div>

        {/* Professional bottom accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 ${
          isDark 
            ? 'bg-gradient-to-t from-gray-900 via-[#EECE84]/5 to-transparent' 
            : 'bg-gradient-to-t from-gray-50 via-[#EECE84]/10 to-transparent'
        }`} />
      </div>
    </div>
  );
}