import Heroes from '@/components/ladingpage/Heroes'
import JournalPage from '@/components/ladingpage/journal-page'
import SliderMarketing from '@/components/ladingpage/slider-marketing'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'ATPS Aviation - Premier ATPL Training Platform | 25,000+ Exam Questions',
  description: 'Master aviation effortlessly with ATPS. Your complete ATPL training platform featuring 25,000+ verified exam questions, AI-powered learning, comprehensive courses, flight simulator, and advanced analytics for aspiring pilots.',
  keywords: 'ATPL training, ATPL questions, ATPL exam questions, aviation exam preparation, pilot training, aviation questions bank, ATPL courses, flight school, pilot exam prep, aviation education, ATPL syllabus, EASA ATPL, aviation learning platform, pilot certification, airline pilot training, pilot study app, aviation test prep, pilot exam simulator, ATPL question bank, aviation practice tests, Flightradar24 alternative, ATPL study guide, pilot training software, aviation ground school',
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
  // Structured Data for SEO (JSON-LD)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ATPS Aviation',
    alternateName: 'Air Transport Pilot School',
    url: 'https://myatps.com',
    logo: 'https://myatps.com/atps-logo.png',
    description: 'Premier ATPL training platform with 25,000+ verified exam questions, AI-powered learning, and comprehensive aviation courses',
    foundingDate: '2020',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@atps.com',
    },
    sameAs: [
      // Add your social media profiles here
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ATPS Aviation',
    url: 'https://myatps.com',
    description: 'Master aviation effortlessly with ATPS. Premier ATPL training platform.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://myatps.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'ATPL Training Program',
    provider: {
      '@type': 'Organization',
      name: 'ATPS Aviation',
      sameAs: 'https://myatps.com',
    },
    description: 'Complete ATPL training with 25,000+ verified exam questions, AI-powered learning, comprehensive courses, and flight simulator',
    courseCode: 'ATPL-ATPS',
    educationalCredentialAwarded: 'ATPL Certification',
    teaches: [
      'Aviation Theory',
      'Mass and Balance',
      'Air Law',
      'Navigation',
      'Performance',
      'Flight Planning',
    ],
    audience: {
      '@type': 'Audience',
      educationalRole: 'student pilot',
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      
      <Heroes />
      <SliderMarketing />
      <JournalPage />
    </>
  )
}

export default HomePage;
