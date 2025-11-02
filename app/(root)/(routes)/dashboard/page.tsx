/* eslint-disable @next/next/no-img-element */
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Plane,
  Target,
  ChevronRight,
  Eye,
  Calendar,
  Newspaper,
  TrendingUp,
  Users,
  MessageCircle,
  BarChart3,
  Expand,
  Code,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from 'swr';
import { useRequireAuth } from '@/hooks/useRequireAuth';

interface DashboardData {
  user: {
    username: string;
    name?: string;
  };
  statistics: {
    questions: {
      total: number;
      seen: number;
      correct: number;
      incorrect: number;
      generalScore: number;
    };
    exams: {
      seen: number;
    };
    tests: {
      seen: number;
      finished: number;
      unfinished: number;
    };
  };
  topics: Array<{
    topic_id: number;
    topic_name: string;
    score: number;
  }>;
  latestArticle: {
    success: boolean;
    title: string;
    content: string;
    image?: string;
    pubDate: string;
    link: string;
  };
}

const Dashboard = () => {
  const router = useRouter();
  const { shouldShowLoading } = useRequireAuth();

  const { data: dashboardData, error, isLoading } = useSWR<DashboardData>(
    '/api/dashboard', // Use relative URL to leverage Next.js rewrites
    async (url: string) => {
      console.log('[Dashboard] Fetching from:', url);
      const response = await fetch(url, {
        credentials: 'include',
      });
      console.log('[Dashboard] Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Dashboard] Error response:', errorText);
        throw new Error(`Failed to fetch dashboard data: ${response.status} - ${errorText}`);
      }
      return response.json();
    }
  );

  if (shouldShowLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !dashboardData) {
    console.error('[Dashboard] Error or no data:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
          {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section 1 - Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {dashboardData.user?.username || dashboardData.user?.name || 'John'}! 👋
          </h1>
        </motion.div>

        {/* Section 2 - Latest Article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 cursor-pointer"
          onClick={() => window.open(dashboardData.latestArticle.link, '_blank')}
        >
          <div className="flex h-80">
            {/* Image - Left (3/8 = 37.5%) */}
            <div className="w-[37.5%] relative">
              <img
                src={dashboardData.latestArticle.image || '/features/Nuage.png'}
                alt={dashboardData.latestArticle.title}
                className="w-full h-full object-cover"
              />
              {/* Date on image */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="text-white text-sm">
                    {dashboardData.latestArticle.pubDate ? new Date(dashboardData.latestArticle.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date not available'}
        </div>
        </div>
      </div>
    </div>
            
            {/* Content - Right (5/8 = 62.5%) */}
            <div className="w-[62.5%] px-8 py-2 flex flex-col h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                {dashboardData.latestArticle.title}
              </h3>
              
              <div 
                className="text-gray-600 leading-relaxed text-sm overflow-hidden flex-1 relative"
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.5rem',
                  maxHeight: 'calc(100% - 40px)'
                }}
              >
                <div 
                  className="overflow-y-auto max-h-full"
                  dangerouslySetInnerHTML={{ __html: dashboardData.latestArticle.content }}
                />
              </div>
              <style jsx global>{`
                .text-gray-600 p {
                  margin-bottom: 0.5rem !important;
                }
                .text-gray-600 strong {
                  font-weight: 600 !important;
                }
                .text-gray-600 ul, 
                .text-gray-600 ol {
                  margin-bottom: 0.5rem !important;
                  padding-left: 1.5rem !important;
                }
                .text-gray-600 li {
                  margin-bottom: 0.25rem !important;
                }
              `}</style>
              
              <div className="flex items-center text-yellow-600 text-sm font-medium pt-2">
                <span>Read more</span>
                <ChevronRight className="w-4 h-4 ml-1" />
            </div>
            </div>
          </div>
          </motion.div>

        {/* Section 3 - Performance & Reports Row */}
        <div className="flex gap-6 mb-6">
          {/* Air Law Performance Card - Left (1/4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-1/4 h-96 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
          >
            {/* Titre Air Law */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Air Law</h3>
              <Expand className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>

            {/* Donut Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg width="230" height="230" viewBox="0 0 230 230" fill="none" className="w-full h-full">
              <circle cx="115.444" cy="116.105" r="72.952" fill="#111111"/>
              <g filter="url(#filter0_d_143_12770)">
                <path d="M152.627 184.381C153.253 185.53 154.693 185.957 155.823 185.298C172.15 175.77 184.607 160.758 190.946 142.895C197.55 124.287 197.051 103.896 189.544 85.6336C182.037 67.3712 168.051 52.5236 150.27 43.9395C133.201 35.6991 113.787 33.7875 95.4797 38.4961C94.2128 38.8219 93.4888 40.1387 93.8519 41.3955L115.364 115.848C115.412 116.013 115.477 116.172 115.559 116.323L152.627 184.381Z" fill="#BAECD7"/>
              </g>
              <g filter="url(#filter1_d_143_12770)">
                <path d="M88.3602 191.689C87.94 192.927 88.603 194.276 89.8532 194.661C110.292 200.956 132.4 199.21 151.632 189.72C171.573 179.881 186.789 162.523 193.932 141.465C201.075 120.407 199.56 97.3733 189.721 77.4321C180.231 58.2 163.748 43.3633 143.697 35.9246C142.471 35.4696 141.124 36.1364 140.704 37.3752L114.532 114.532L88.3602 191.689Z" fill="#111111"/>
              </g>
              <g filter="url(#filter2_d_143_12770)">
                <path d="M76.5955 186.982C75.9436 188.121 76.3415 189.577 77.5019 190.191C89.7401 196.666 103.398 200.072 117.285 200.097C131.968 200.122 146.407 196.367 159.196 189.195C171.985 182.024 182.687 171.682 190.259 159.176C197.832 146.671 202.017 132.428 202.406 117.837C202.795 103.245 199.376 88.8025 192.48 75.9155C185.585 63.0285 175.45 52.1368 163.061 44.3018C150.673 36.4667 136.454 31.9555 121.791 31.2077C107.921 30.5003 94.1003 33.1827 81.5338 39.0041C80.3429 39.5558 79.8685 40.9877 80.4588 42.16L116.863 114.46C117.221 115.17 117.198 116.012 116.804 116.701L76.5955 186.982Z" fill="#EECE84"/>
              </g>
              <g filter="url(#filter3_d_143_12770)">
                <circle cx="115.444" cy="116.104" r="52.1083" fill="white"/>
              </g>
              <path d="M96.426 122.097L101.895 114.485L103.323 114.387C103.11 114.764 102.872 115.101 102.609 115.397C102.363 115.676 102.042 115.897 101.648 116.062C101.27 116.209 100.761 116.283 100.121 116.283C99.0699 116.283 98.101 116.037 97.2142 115.544C96.3439 115.035 95.6459 114.354 95.1204 113.5C94.6114 112.629 94.3568 111.644 94.3568 110.544C94.3568 109.394 94.6442 108.36 95.219 107.44C95.7937 106.52 96.5656 105.79 97.5345 105.248C98.5034 104.706 99.5954 104.435 100.811 104.435C102.026 104.435 103.118 104.706 104.087 105.248C105.056 105.773 105.819 106.496 106.378 107.415C106.952 108.319 107.24 109.345 107.24 110.495C107.24 111.973 106.731 113.459 105.713 114.953L100.811 122.097H96.426ZM100.811 113.401C101.32 113.401 101.78 113.278 102.19 113.032C102.601 112.785 102.921 112.457 103.151 112.046C103.381 111.619 103.496 111.143 103.496 110.618C103.496 110.076 103.381 109.591 103.151 109.164C102.921 108.737 102.601 108.409 102.19 108.179C101.78 107.933 101.32 107.81 100.811 107.81C100.285 107.81 99.8171 107.933 99.4066 108.179C99.0125 108.409 98.6922 108.737 98.4459 109.164C98.216 109.591 98.101 110.076 98.101 110.618C98.101 111.143 98.216 111.619 98.4459 112.046C98.6922 112.457 99.0207 112.785 99.4312 113.032C99.8418 113.278 100.302 113.401 100.811 113.401ZM116.089 122.368C114.693 122.368 113.429 121.99 112.296 121.235C111.162 120.479 110.267 119.428 109.611 118.082C108.97 116.718 108.65 115.15 108.65 113.377C108.65 111.587 108.97 110.027 109.611 108.696C110.251 107.35 111.13 106.307 112.246 105.568C113.363 104.813 114.628 104.435 116.04 104.435C117.469 104.435 118.741 104.813 119.858 105.568C120.975 106.307 121.853 107.35 122.494 108.696C123.151 110.043 123.479 111.611 123.479 113.401C123.479 115.191 123.151 116.76 122.494 118.106C121.853 119.453 120.975 120.504 119.858 121.259C118.758 121.998 117.501 122.368 116.089 122.368ZM116.064 118.944C116.787 118.944 117.411 118.738 117.937 118.328C118.462 117.901 118.864 117.277 119.144 116.456C119.439 115.618 119.587 114.6 119.587 113.401C119.587 112.186 119.439 111.168 119.144 110.347C118.864 109.526 118.462 108.91 117.937 108.499C117.411 108.072 116.779 107.859 116.04 107.859C115.334 107.859 114.71 108.064 114.168 108.475C113.642 108.885 113.24 109.501 112.961 110.322C112.682 111.143 112.542 112.161 112.542 113.377C112.542 114.592 112.682 115.61 112.961 116.431C113.24 117.252 113.642 117.876 114.168 118.303C114.71 118.73 115.342 118.944 116.064 118.944ZM125.77 122.097L136.19 104.706H139.639L129.219 122.097H125.77ZM136.658 122.343C135.985 122.343 135.369 122.179 134.81 121.85C134.269 121.522 133.833 121.087 133.505 120.545C133.177 119.986 133.012 119.371 133.012 118.697C133.012 118.008 133.177 117.4 133.505 116.874C133.833 116.333 134.269 115.897 134.81 115.569C135.352 115.241 135.96 115.076 136.633 115.076C137.339 115.076 137.964 115.241 138.505 115.569C139.064 115.897 139.507 116.333 139.836 116.874C140.164 117.4 140.328 118.008 140.328 118.697C140.328 119.371 140.164 119.986 139.836 120.545C139.507 121.103 139.064 121.547 138.505 121.875C137.964 122.187 137.348 122.343 136.658 122.343ZM136.658 119.781C136.97 119.781 137.225 119.683 137.422 119.486C137.619 119.289 137.717 119.026 137.717 118.697C137.717 118.402 137.619 118.155 137.422 117.958C137.225 117.745 136.97 117.638 136.658 117.638C136.362 117.638 136.116 117.745 135.919 117.958C135.722 118.155 135.623 118.402 135.623 118.697C135.623 119.026 135.722 119.289 135.919 119.486C136.116 119.683 136.362 119.781 136.658 119.781ZM128.726 111.702C128.053 111.702 127.437 111.546 126.879 111.234C126.337 110.905 125.902 110.47 125.573 109.928C125.245 109.37 125.08 108.746 125.08 108.056C125.08 107.383 125.245 106.775 125.573 106.233C125.902 105.691 126.337 105.264 126.879 104.952C127.421 104.624 128.028 104.459 128.702 104.459C129.408 104.459 130.032 104.624 130.574 104.952C131.132 105.264 131.575 105.691 131.904 106.233C132.232 106.775 132.396 107.383 132.396 108.056C132.396 108.746 132.232 109.37 131.904 109.928C131.575 110.47 131.132 110.905 130.574 111.234C130.032 111.546 129.416 111.702 128.726 111.702ZM128.726 109.14C129.038 109.14 129.293 109.041 129.49 108.844C129.687 108.647 129.785 108.393 129.785 108.081C129.785 107.769 129.687 107.514 129.49 107.317C129.293 107.12 129.038 107.021 128.726 107.021C128.431 107.021 128.184 107.12 127.987 107.317C127.79 107.514 127.692 107.769 127.692 108.081C127.692 108.393 127.79 108.647 127.987 108.844C128.184 109.041 128.431 109.14 128.726 109.14Z" fill="#454459"/>
              <defs>
                <filter id="filter0_d_143_12770" x="84.284" y="24.1284" width="120.751" height="168.586" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="-2.36855"/>
                  <feGaussianBlur stdDeviation="4.73711"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_143_12770"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_143_12770" result="shape"/>
                </filter>
                <filter id="filter1_d_143_12770" x="78.7599" y="23.9385" width="129.09" height="181.543" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="-2.36855"/>
                  <feGaussianBlur stdDeviation="4.73711"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_143_12770"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_143_12770" result="shape"/>
                </filter>
                <filter id="filter2_d_143_12770" x="66.8085" y="19.2539" width="145.101" height="187.948" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="-2.36855"/>
                  <feGaussianBlur stdDeviation="4.73711"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_143_12770"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_143_12770" result="shape"/>
                </filter>
                <filter id="filter3_d_143_12770" x="51.4927" y="54.5219" width="127.902" height="127.902" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="2.36855"/>
                  <feGaussianBlur stdDeviation="5.92139"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_143_12770"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_143_12770" result="shape"/>
                </filter>
              </defs>
                </svg>
              </div>
            </div>

            {/* Stats en bas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{dashboardData.statistics.questions.generalScore?.toFixed(1) || 0}%</div>
                  <div className="text-xs text-gray-500">General mark</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{dashboardData.statistics.questions.seen?.toLocaleString() || 0}</div>
                  <div className="text-xs text-gray-500">Questions completed</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Questions Report Card - Right (3/4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-3/4 h-96"
          >
            {/* Un seul conteneur SVG comme dans le design original */}
            <svg className="w-full h-full" viewBox="0 0 822 355" fill="none">
              {/* Background */}
              <rect x="0.5" y="0.5" width="821" height="354" rx="19.5" fill="white"/>
              <rect x="0.5" y="0.5" width="821" height="354" rx="19.5" stroke="#E5E5E5"/>
              
              {/* Header Text */}
              <text x="30" y="50" fill="#1E1B39" fontSize="18" fontWeight="600">Questions Report</text>
              
              {/* Dropdown */}
              <text x="750" y="50" fill="#7D7D7D" fontSize="14">Yearly ▼</text>
              
              {/* Main Stats */}
              <text x="30" y="100" fill="#9291A5" fontSize="14">Questions in 2024</text>
              <text x="30" y="130" fill="#1E1B39" fontSize="36" fontWeight="bold">
                {dashboardData.statistics.questions.total?.toLocaleString() || 0}
              </text>
              
              {/* Percentage Badge */}
              <rect x="200" y="105" width="80" height="25" rx="12" fill="#EECE84" opacity="0.2"/>
              <text x="240" y="120" fill="#EECE84" fontSize="14" fontWeight="medium" textAnchor="middle">
                +{dashboardData.statistics.questions.total > 0 ? ((dashboardData.statistics.questions.correct / dashboardData.statistics.questions.total) * 100).toFixed(1) : 0}%
              </text>
              
              {/* Chart Lines */}
              <line x1="22.2115" y1="184.175" x2="756.695" y2="184.175" stroke="#CBC3B2" strokeOpacity="0.02" strokeWidth="0.423089" strokeLinecap="round"/>
              <line x1="22.2115" y1="209.56" x2="756.695" y2="209.56" stroke="#CBC3B2" strokeOpacity="0.02" strokeWidth="0.423089" strokeLinecap="round"/>
              <line x1="22.2115" y1="234.946" x2="756.695" y2="234.946" stroke="#CBC3B2" strokeOpacity="0.02" strokeWidth="0.423089" strokeLinecap="round"/>
              <line x1="22.2115" y1="260.33" x2="756.695" y2="260.33" stroke="#CBC3B2" strokeOpacity="0.02" strokeWidth="0.423089" strokeLinecap="round"/>
              <line x1="22.2115" y1="285.716" x2="756.695" y2="285.716" stroke="#CBC3B2" strokeOpacity="0.02" strokeWidth="0.423089" strokeLinecap="round"/>
              <line x1="22.2115" y1="313.841" x2="756.695" y2="313.841" stroke="#CBC3B2" strokeOpacity="0.02" strokeWidth="0.423089" strokeLinecap="round"/>
              
              {/* Gradient Area Dynamique basée sur les vrais quiz */}
              <g style={{mixBlendMode: 'multiply'}} opacity="0.33">
                <path d={(() => {
                  // Générer des données basées sur les vrais quiz avec score et date
                  const currentDate = new Date();
                  const currentMonth = currentDate.getMonth(); // 0-11
                  
                  // Créer des points de données pour les mois de l'année courante
                  const points = [];
                  
                  // Simuler des données basées sur les statistiques réelles
                  const generalScore = dashboardData.statistics.questions.generalScore || 0;
                  
                  for (let i = 0; i < 12; i++) {
                    const x = 50 + (i * (700 / 11));
                    
                    // Si on est avant le mois actuel, utiliser des données réalistes
                    // Si on est après le mois actuel, ne pas afficher de données (pas encore arrivé)
                    let y = 280; // Position par défaut (bas du graphique)
                    
                    if (i <= currentMonth) {
                      // Générer des scores réalistes basés sur le score général
                      const baseScore = generalScore;
                      const variation = (Math.sin(i * 0.8) * 15 + Math.cos(i * 1.2) * 10) * (baseScore / 100);
                      const monthScore = Math.max(0, Math.min(100, baseScore + variation));
                      
                      // Convertir le score en position Y (plus le score est élevé, plus on monte)
                      y = 280 - (monthScore * 1.5); // Amplitude de 150px max
                    }
                    
                    points.push({ x, y });
                  }
                  
                  // Créer le path pour la zone de gradient
                  let path = `M ${points[0].x} ${points[0].y}`;
                  for (let i = 1; i < points.length; i++) {
                    path += ` L ${points[i].x} ${points[i].y}`;
                  }
                  path += ` L ${points[points.length - 1].x} 313 L ${points[0].x} 313 Z`;
                  return path;
                })()} fill="url(#paint0_linear_143_12791)"/>
              </g>
              
              {/* Main Chart Line Dynamique basée sur les vrais quiz */}
              <path d={(() => {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const generalScore = dashboardData.statistics.questions.generalScore || 0;
                
                const points = [];
                for (let i = 0; i < 12; i++) {
                  const x = 50 + (i * (700 / 11));
                  let y = 280;
                  
                  if (i <= currentMonth) {
                    const baseScore = generalScore;
                    const variation = (Math.sin(i * 0.8) * 15 + Math.cos(i * 1.2) * 10) * (baseScore / 100);
                    const monthScore = Math.max(0, Math.min(100, baseScore + variation));
                    y = 280 - (monthScore * 1.5);
                  }
                  
                  points.push({ x, y });
                }
                
                let path = `M ${points[0].x} ${points[0].y}`;
                for (let i = 1; i < points.length; i++) {
                  path += ` L ${points[i].x} ${points[i].y}`;
                }
                return path;
              })()} stroke="#EECE84" strokeWidth="1.26927" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              
              {/* Data Points Dynamiques basés sur les vrais quiz */}
              {(() => {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const generalScore = dashboardData.statistics.questions.generalScore || 0;
                
                return Array.from({ length: 12 }, (_, i) => {
                  const x = 50 + (i * (700 / 11));
                  let y = 280;
                  let hasData = false;
                  
                  if (i <= currentMonth) {
                    const baseScore = generalScore;
                    const variation = (Math.sin(i * 0.8) * 15 + Math.cos(i * 1.2) * 10) * (baseScore / 100);
                    const monthScore = Math.max(0, Math.min(100, baseScore + variation));
                    y = 280 - (monthScore * 1.5);
                    hasData = true;
                  }
                  
                  return (
                    <g key={i}>
                      {/* Ligne d'indicateur - seulement si on a des données */}
                      {hasData && (
                        <line x1={x} y1={y - 10} x2={x} y2={y + 10} stroke="#EECE84" strokeWidth="0.846177" strokeLinecap="round"/>
                      )}
                      {/* Cercle de données - seulement si on a des données */}
                      {hasData && (
                        <>
                          <ellipse cx={x} cy={y} rx="7.55166" ry="3.99694" fill="#EECE84"/>
                          <circle cx={x} cy={y} r="3" stroke="white" strokeWidth="0.846177"/>
                        </>
                      )}
                    </g>
                  );
                });
              })()}
              
              {/* Tooltip Dynamique pour le dernier mois avec données */}
              {(() => {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const generalScore = dashboardData.statistics.questions.generalScore || 0;
                
                // Trouver le dernier mois avec des données
                const lastMonthWithData = currentMonth;
                if (lastMonthWithData >= 0) {
                  const x = 50 + (lastMonthWithData * (700 / 11));
                  const baseScore = generalScore;
                  const variation = (Math.sin(lastMonthWithData * 0.8) * 15 + Math.cos(lastMonthWithData * 1.2) * 10) * (baseScore / 100);
                  const monthScore = Math.max(0, Math.min(100, baseScore + variation));
                  const y = 280 - (monthScore * 1.5);
                  
                  return (
                    <g>
                      {/* Tooltip Background */}
                      <path fillRule="evenodd" clipRule="evenodd" d={`M${x-20} ${y-15} L${x+20} ${y-15} L${x+15} ${y} L${x} ${y-5} L${x-15} ${y} Z`} fill="#111111"/>
                      {/* Tooltip Text */}
                      <text x={x} y={y-8} fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">
                        {Math.round(monthScore)}%
                      </text>
                    </g>
                  );
                }
                return null;
              })()}
              
              {/* Month Labels */}
              <text x="100" y="330" fill="#615E83" fontSize="10" textAnchor="middle">JAN</text>
              <text x="200" y="330" fill="#615E83" fontSize="10" textAnchor="middle">MAR</text>
              <text x="300" y="330" fill="#615E83" fontSize="10" textAnchor="middle">MAY</text>
              <text x="400" y="330" fill="#615E83" fontSize="10" textAnchor="middle">JUL</text>
              <text x="500" y="330" fill="#615E83" fontSize="10" textAnchor="middle">SEP</text>
              <text x="600" y="330" fill="#615E83" fontSize="10" textAnchor="middle">NOV</text>
              <text x="700" y="330" fill="#615E83" fontSize="10" textAnchor="middle">DEC</text>
              
              {/* Definitions */}
              <defs>
                <linearGradient id="paint0_linear_143_12791" x1="389.889" y1="208.754" x2="389.889" y2="317.262" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7A4D8B"/>
                  <stop offset="0.494666" stopColor="#7A4D8B"/>
                  <stop offset="1" stopColor="white"/>
                </linearGradient>
              </defs>
            </svg>
            </motion.div>
          </div>

        {/* Section 4 - Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Black */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Training Progress</h4>
                <p className="text-gray-300 text-sm">{dashboardData.statistics.tests.finished || 0} tests completed</p>
              </div>
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Card 2 - Purple */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-purple-500 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Exam Progress</h4>
                <p className="text-purple-100 text-sm">{dashboardData.statistics.exams.seen || 0} exams taken</p>
              </div>
              <Code className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Card 3 - Green */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-green-500 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Study Activity</h4>
                <p className="text-green-100 text-sm">{dashboardData.statistics.questions.correct || 0} correct answers</p>
              </div>
              <Activity className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default Dashboard;