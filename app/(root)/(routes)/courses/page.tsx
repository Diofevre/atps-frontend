'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineFeaturedVideo } from "react-icons/md";
import { useRequireAuth } from '@/hooks/useRequireAuth';

const Courses = () => {
  const { shouldShowLoading } = useRequireAuth();

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
    <div className="flex flex-col">
      {/* Header */}
      <header className="w-full px-4 mt-1">
        <div className="flex flex-row gap-1 items-center font-semibold text-xl">
          <MdOutlineFeaturedVideo className="h-4 w-4 md:h-6 md:w-6" />
          <span className="text-sm md:text-xl uppercase mt-1">Courses</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-4 2xl:mt-28 xl:mt-28 lg:mt-28 md:mt-6 sm:mt-6 mt-4 mb-4">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 uppercase font-semibold">
            {/* Top Cards */}
            {[
              { href: '#', img: '/Courses/Resume.png', alt: 'Resume ALT', label: 'Resume' },
              { href: '/courses/video', img: '/Courses/Video.png', alt: 'Video ALT', label: 'Video' },
              { href: '/courses/dictionary', img: '/Courses/Dictionary.png', alt: 'Dictionnary ALT', label: 'Dictionnary' },
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
                  rounded-[30px]
                  border
                  hover:shadow-xl hover:scale-105
                  transition-all 
                  duration-300
                  group
                `}
              >
                <div className={`
                  relative w-12 h-12 
                  transition-transform duration-300 
                  group-hover:scale-110
                `}>
                  <Image
                    alt={card.alt}
                    src={card.img}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="
                  text-sm font-medium 
                  transition-colors duration-300 
                  group-hover:text-sky-600
                ">
                  {card.label}
                </span>
              </Link>
            ))}

            {/* Manuals Card - Full Width */}
            <Link 
              href="/courses/manuals" 
              className="
                col-span-1 
                sm:col-span-1
                lg:col-span-3
                lg:aspect-[3/1]
                sm:aspect-[1/1]
                aspect-[1/1]
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
              {/* Decorative Images */}
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
                MANUALS
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Courses;