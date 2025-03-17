'use client';

import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { support } from '@/lib/menu-sidebar';

const SupportPage = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="flex flex-col md:flex-row relative justify-between h-auto md:h-[600px] ml-0 md:ml-16 items-center">
      {/* Liste des questions à gauche */}
      <div className="flex flex-col w-full md:w-1/2 bg-white dark:bg-slate-900 shadow-lg rounded-xl md:-ml-16 z-10">
        {support.map((item, index) => {
          const getRoundedClass = () => {
            if (index === 0) return 'rounded-t-xl';
            if (index === support.length - 1) return 'rounded-b-xl';
            return 'rounded-none';
          };

          return (
            <div key={item.id}>
              <div
                className={`flex items-center justify-between cursor-pointer transition-all duration-300 p-6 ${
                  activeId === item.id ? 'bg-[#EECE84]' : 'text-black'
                } ${getRoundedClass()}`}
                onClick={() => setActiveId(item.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-4 w-4 rounded-[16px] ${
                      activeId === item.id ? 'bg-black' : 'bg-[#EECE84]'
                    }`}
                  ></div>
                  <h2 className={`font-medium ${activeId === item.id ? 'dark:text-black' : 'dark:text-white'}`}>
                    {item.title}
                  </h2>
                </div>
                <ChevronRight
                  className={activeId === item.id ? 'text-black' : 'text-[#EECE84]'}
                />
              </div>
              {index !== support.length - 1 && <Separator />}
            </div>
          );
        })}
      </div>

      {/* Carte de détails à droite */}
      <div className="flex-1 overflow-hidden relative md:-ml-28 z-0 mt-6 md:mt-0">
        {activeId !== null ? (
          <div className="bg-white dark:bg-transparent rounded-[16px] p-6 md:p-16 w-full md:w-[700px] h-auto md:h-[510px] border border-[#EECE84]">
            <h2 className="text-2xl font-extrabold mb-4 ml-0 md:ml-24">
              {support.find((item) => item.id === activeId)?.title}
            </h2>
            <p className="text-gray-700 leading-6 ml-0 md:ml-24 dark:text-white">
              {support.find((item) => item.id === activeId)?.description}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-transparent rounded-[16px] p-6 md:p-16 w-full md:w-[700px] h-auto md:h-[510px] border border-[#EECE84]">
            <h2 className="text-2xl font-extrabold mb-4 ml-0 md:ml-24">
              {support[0]?.title}
            </h2>
            <p className="text-gray-700 leading-6 ml-0 md:ml-24 dark:text-white">
              {support[0]?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;