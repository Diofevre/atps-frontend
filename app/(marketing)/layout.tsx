'use client';

import Footer from '@/components/ladingpage/Footer';
import Header from '@/components/ladingpage/Header';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = ({children} : Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#EECE84]/20 to-transparent blur-3xl transform rotate-45" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#964b6b]/20 to-transparent blur-3xl transform -rotate-45" />
      </div>

      {/* Content */}
      <div className="relative">
        <Header />
        <main className="">
          {children}
        </main>
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;