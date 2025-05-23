// Adapté la couleur selon la recommendation

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  return (
    <section className='bg-white dark:bg-gray-900 '>
      <div className='container flex items-center min-h-screen px-6 py-12 mx-auto'>
        <div className='flex flex-col items-center max-w-sm mx-auto text-center'>
          <p className='p-3 text-sm font-medium text-[#EECE84] rounded-full bg-[#EECE84]/10 dark:bg-gray-800'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='2'
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
              />
            </svg>
          </p>
          <h1 className='mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl'>
            404 - Page non trouvée
          </h1>
          <p className='mt-4 text-gray-500 dark:text-gray-400'>
            La page que vous cherchez n&apos;existe pas. Voici quelques liens
            utiles:
          </p>

          <div className='flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto'>
            <button
              onClick={() => router.back()}
              className='flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='w-5 h-5 rtl:rotate-180'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18'
                />
              </svg>
              <span>Retour</span>
            </button>
            <Link href='/'>
              <button className='w-1/2 px-5 py-2 text-sm tracking-wide text-black transition-colors duration-200 bg-[#EECE85] rounded-lg shrink-0 sm:w-auto hover:bg-[#EECE84]/90 dark:hover:bg-[#EECE84]/90 dark:bg-[#EECE84]'>
                Page d&apos;accueil
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;