import { MdDashboard, MdBook, MdQuiz, MdNewspaper, MdGroups, MdAccountCircle, MdFlight, MdArticle, MdSearch } from 'react-icons/md';
import RolledNewspaperIcon from '@/components/icons/RolledNewspaperIcon';

export const MenuSidebar = [
  { title: 'Dashboard', path: '/dashboard', icon: MdDashboard },
  { title: 'Courses', path: '/courses', icon: MdBook },
  { title: 'Question Bank', path: '/questions-bank', icon: MdQuiz },
  { title: 'ATC Simulator', path: '/atc-simulator', icon: MdFlight },
  { title: 'News', path: '/news', icon: RolledNewspaperIcon },
  { title: 'Blog', path: '/blog', icon: MdArticle },
  { title: 'Community', path: '/community', icon: MdGroups },
  { title: 'Account', path: '/user-profile', icon: MdAccountCircle },
];

export const LandingMenues = [
  { title: 'Partnerships', path: '/partnerships'},
  { title: 'Blog', path: '/blog'},
  { title: 'FAQs', path: '/faqs'},
  { title: 'Pricing', path: '/pricing'},
  { title: 'Community', path: '/community'},
  { title: 'Latest News', path: '/latest_news'},
];

export interface SupportItem {
  id: number;
  title: string;
  description: string;
  category: string;
}

export const support: SupportItem[] = [
  // General Questions
  {
    id: 1,
    category: "General Questions",
    title: "What is ATPS?",
    description: "ATPS (Airline Transport Pilot School) is the most advanced aviation training platform, providing a complete learning experience for aspiring pilots. We offer a comprehensive Question Bank, Interactive Courses, ATC Simulator, AI Aviation Assistant, Aviation Blog, Real-Time Aviation News, and a Community Forum to support your journey towards an ATPL."
  },
  {
    id: 2,
    category: "General Questions",
    title: "Is ATPS compatible with my Examining Authority?",
    description: "Yes! ATPS provides EASA-compliant training content, ensuring relevance for students preparing for ATPL exams under European regulations. Always check with your local authority for specific requirements."
  },
  {
    id: 3,
    category: "General Questions",
    title: "What makes ATPS different from other ATPL study platforms?",
    description: "ATPS combines the most advanced AI technology, high-quality learning materials, and interactive tools to provide an efficient and engaging training experience. Our AI-powered assistant, real-time news updates, and ATC simulator make ATPS the most complete aviation learning platform available."
  },
  // Question Bank
  {
    id: 4,
    category: "Question Bank",
    title: "What is included in the ATPS Question Bank?",
    description: "The ATPS Question Bank consists of 25,000+ verified exam questions, covering all ATPL subjects with detailed explanations. Questions are regularly updated, ensuring you practice with the most relevant material."
  },
  {
    id: 5,
    category: "Question Bank",
    title: "How often are new questions added?",
    description: "New questions are added regularly, including the latest seen-in-exam questions to help students stay ahead with current exam trends."
  },
  {
    id: 6,
    category: "Question Bank",
    title: "Can I filter questions by my Examining Authority?",
    description: "Yes, ATPS allows filtering by examining authority, subject, difficulty level, and the latest updates."
  },
  // Courses
  {
    id: 7,
    category: "Courses",
    title: "What type of courses does ATPS offer?",
    description: "ATPS offers: Video Courses: Expert-led lessons, curated from top aviation instructors and YouTube creators. E-Book Manuals: Interactive study materials with highlighting, bookmarking, and notes. Aviation Dictionary: A complete aviation terminology reference with images and diagrams."
  },
  {
    id: 8,
    category: "Courses",
    title: "Can I access course materials offline?",
    description: "No, ATPS is a strictly web-based application, and courses are only accessible online."
  },
  // AI Aviation Assistant
  {
    id: 9,
    category: "AI Aviation Assistant",
    title: "What is the ATPS AI Aviation Assistant?",
    description: "The AI Assistant is a smart aviation chatbot that provides instant explanations, study guidance, and access to aviation terminology and images to help students master ATPL concepts efficiently."
  },
  {
    id: 10,
    category: "AI Aviation Assistant",
    title: "Can the AI Assistant answer any aviation-related question?",
    description: "Yes! The AI is trained on aviation-specific content and can provide answers on regulations, aerodynamics, navigation, and more."
  },
  // Technical & Accessibility
  {
    id: 11,
    category: "Technical & Accessibility",
    title: "What devices can I use to access ATPS?",
    description: "ATPS is accessible on desktop, tablet, and mobile devices, via web browser."
  },
  {
    id: 12,
    category: "Technical & Accessibility",
    title: "What should I do if I encounter technical issues?",
    description: "You can contact support@atps.com for assistance."
  },
  // Pricing & Payment
  {
    id: 13,
    category: "Pricing & Payment",
    title: "Does ATPS offer a free trial?",
    description: "Yes! We offer special promotions including 3-month free subscriptions. Check our pricing page for current offers and choose the plan that works best for you."
  },
  {
    id: 14,
    category: "Pricing & Payment",
    title: "What payment methods are accepted?",
    description: "ATPS accepts major credit/debit cards and secure online payment processors for your convenience."
  }
];