import Heroes from '@/components/ladingpage/Heroes'
import JournalPage from '@/components/ladingpage/journal-page'
import SliderMarketing from '@/components/ladingpage/slider-marketing'
import React from 'react'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'ATPS Aviation - Premier ATPL Training Platform | 25,000+ Exam Questions',
  description: 'Master aviation effortlessly with ATPS. Your complete ATPL training platform featuring 25,000+ verified exam questions, AI-powered learning, comprehensive courses, flight simulator, and advanced analytics for aspiring pilots.',
  keywords: 'ATPL training, aviation exam preparation, pilot training, aviation questions bank, ATPL courses, flight school, pilot exam prep, aviation education, ATPL syllabus, EASA ATPL, aviation learning platform, pilot certification, airline pilot training',
  authors: [{ name: 'ATPS Aviation' }],
  openGraph: {
    title: 'ATPS Aviation - Premier ATPL Training Platform',
    description: 'Master aviation effortlessly with ATPS. 25,000+ verified exam questions, AI-powered learning, and comprehensive ATPL training.',
    url: 'https://app.myatps.com',
    siteName: 'ATPS Aviation',
    images: [
      {
        url: 'https://app.myatps.com/atps-default.png',
        width: 1200,
        height: 630,
        alt: 'ATPS Aviation Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATPS Aviation - Premier ATPL Training Platform',
    description: 'Master aviation effortlessly with ATPS. 25,000+ verified exam questions, AI-powered learning.',
    images: ['https://app.myatps.com/atps-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://app.myatps.com',
    languages: {
      'en-US': 'https://app.myatps.com',
      'fr-FR': 'https://app.myatps.com',
      'es-ES': 'https://app.myatps.com',
    },
  },
}

const HomePage = () => {
  return (
    <>
      <Heroes />
      <SliderMarketing />
      <JournalPage />
    </>
  )
}

export default HomePage;
