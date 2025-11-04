'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AlignLeft } from "lucide-react";
import { useAuth } from '@/lib/mock-clerk';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const QuestionBank = () => {
  const { shouldShowLoading } = useRequireAuth();
  const { getToken } = useAuth();
  const [unfinishedTests, setUnfinishedTests] = useState(0);

  useEffect(() => {
    const fetchUnfinishedTests = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests/count-unfinished`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUnfinishedTests(data.count);
      } catch (error) {
        console.error('Error fetching unfinished tests:', error);
        setUnfinishedTests(0);
      }
    };

    fetchUnfinishedTests();
  }, [getToken]);

  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-main-gradient">
      {/* Header */}
      <header className="w-full px-4 mt-1">
        <div className="flex flex-row gap-1 items-center font-semibold text-xl">
          <AlignLeft className="h-4 w-4 md:h-6 md:w-6" />
          <span className="text-sm md:text-xl">QUESTIONS BANK</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-4 2xl:mt-28 xl:mt-28 lg:mt-28 md:mt-6 sm:mt-6 mt-4 mb-4">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 uppercase font-semibold">
            {/* Study Card */}
            <Link 
              href="questions-bank/study" 
              className="
                col-span-1 
                sm:col-span-2 
                lg:col-span-2
                aspect-[2/1]
                flex
                items-center 
                justify-center 
                cursor-pointer 
                bg-gradient-to-tr 
                from-sky-600 
                to-blue-100 
                shadow-md
                rounded-[30px] 
                hover:shadow-xl 
                transition-all 
                duration-300 
                relative
                overflow-hidden 
                group
              "
            >
              {/* Decorative Images with improved positioning */}
              <Image 
                alt="Cloud 1"
                src="/Manuals/Nuage.png"
                width={150}
                height={150}
                className="absolute -top-4 left-1/3 opacity-80 transition-transform duration-700 group-hover:translate-x-4"
              />
              <Image 
                alt="Cloud 2"
                src="/Manuals/Nuage.png"
                width={250}
                height={250}
                className="absolute top-8 -left-20 opacity-80 transition-transform duration-700 group-hover:-translate-x-4"
              />
              <Image 
                alt="Cloud 3"
                src="/Manuals/Nuage.png"
                width={100}
                height={100}
                className="absolute bottom-4 left-1/3 opacity-80 transition-transform duration-700 group-hover:translate-y-4"
              />
              <Image 
                alt="Moon"
                src="/Manuals/Moon.png"
                width={200}
                height={200}
                className="absolute top-4 right-4 opacity-80 transition-transform duration-700 group-hover:rotate-12"
              />
              <span className="text-black/80 text-xl font-bold relative z-10 transition-transform duration-300 group-hover:scale-110">
                Study
              </span>
            </Link>

            {/* Other Cards */}
            {[
              { href: '/questions-bank/exam', img: '/qb/examen.png', alt: 'Start an exam', label: 'Start an exam' },
              { 
                href: unfinishedTests > 0 ? '/questions-bank/resume' : '#',
                img: '/qb/resume.png', 
                alt: 'Resume', 
                label: 'Resume',
                disabled: unfinishedTests === 0
              },
              { href: '/questions-bank/history', img: '/qb/history.png', alt: 'History', label: 'History' },
              { href: '/questions-bank/search', img: '/qb/search.png', alt: 'Search', label: 'Search' },
            ].map((card, index) => (
              <Link 
                key={index}
                href={card.href}
                className={`
                  col-span-1 
                  aspect-square
                  flex 
                  flex-col 
                  items-center 
                  justify-center 
                  gap-4
                  bg-white
                  shadow-md 
                  border
                  rounded-[30px] 
                  ${!card.disabled ? 'hover:shadow-xl hover:scale-105' : 'opacity-50 cursor-not-allowed'}
                  transition-all 
                  duration-300
                  group
                `}
                onClick={e => {
                  if (card.disabled) {
                    e.preventDefault();
                  }
                }}
              >
                <div className={`
                  relative w-12 h-12 
                  transition-transform duration-300 
                  ${!card.disabled ? 'group-hover:scale-110' : ''}
                `}>
                  {card.img && (
                    <Image
                      alt={card.alt}
                      src={card.img}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <span className={`
                  text-sm font-medium 
                  transition-colors duration-300 
                  ${!card.disabled ? 'group-hover:text-sky-600' : ''}
                `}>
                  {card.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionBank;