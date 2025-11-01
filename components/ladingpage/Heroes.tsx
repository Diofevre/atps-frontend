/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { features, mainFeatures } from '@/lib/marketing_page/constant';
import { Users } from 'lucide-react';
import { useUser } from '@/lib/mock-clerk';
import { motion, useInView } from 'framer-motion';

const Heroes = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, amount: 0.2 });
  
  // Éviter l'erreur d'hydratation en attendant que Clerk soit chargé
  if (!isLoaded) {
    return <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800" />;
  }
  
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };
  
  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Hero Section with Parallax Effect */}
      <section className="relative min-h-screen pb-48">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Top blur gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900 to-transparent z-10" />
          
          <img
            src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=2560"
            alt="Aviation Hero"
            className="absolute inset-0 w-full h-full object-cover transform scale-110 motion-safe:animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/95 via-[#0F172A]/90 to-[#0F172A]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
        </div>

        {/* Hero Content */}
        <div className="relative pt-40 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 rounded-[24px] bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm"
              >
                <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-[#EECE84]"></span>
                Start Your Aviation Journey Today
              </motion.div>
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
                >
                  Soar into knowledge
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#EECE84] via-amber-500 to-amber-400 mt-2 animate-gradient">
                    with ATPS
                  </span>
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative"
                >
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#EECE84] to-transparent opacity-50" />
                  <p className="text-xl text-gray-300/90 max-w-2xl leading-relaxed pl-4">
                    ATPS is the most performant aviation training platform, designed to provide the most precise, efficient, and high-quality ATPL preparation available today.
                  </p>
                </motion.div>
                
                {/* Enhanced Feature List with Icons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
                >
                  {mainFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#EECE84]/30"
                      >
                        <motion.div 
                          className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-all duration-300`}
                          whileHover={{ rotate: 5 }}
                        >
                          <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                        </motion.div>
                        <div>
                          <h3 className="text-white font-semibold mb-1 group-hover:text-[#EECE84] transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Button 
                  onClick={() => router.push('/signup')}
                  size="lg" 
                  className="relative group bg-[#EECE84] hover:bg-[#EECE84]/90 text-slate-900 rounded-[24px] px-8 h-12 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center font-medium">
                    TRY FOR FREE
                    <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                      ⟶
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section ref={introRef} className="relative py-24 overflow-hidden bg-slate-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate={introInView ? "animate" : "initial"}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1559686043-aef1bbc98d19?auto=format&fit=crop&w=1200&q=80"
                  alt="ATPS Training"
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent" />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={introInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-[#EECE84]/10 shadow-xl max-w-sm"
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="p-3 rounded-xl bg-[#EECE84]/10"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="w-6 h-6 text-[#EECE84]" />
                  </motion.div>
                  <div>
                    <p className="text-white font-medium">Join Our Community</p>
                    <p className="text-sm text-gray-400 mt-1">Connect with fellow aviation enthusiasts and industry experts</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate={introInView ? "animate" : "initial"}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Join the ATPS Aviation Community  
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  The ATPS community brings together aspiring and professional pilots to exchange knowledge, discuss strategies, and stay informed on industry developments. Join a network designed to support your aviation journey.
                </p>
              </motion.div>

              <div className="grid gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div 
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ x: 8 }}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                    >
                      <motion.div 
                        className="p-3 rounded-xl bg-[#EECE84]/10 group-hover:bg-[#EECE84]/20 transition-colors duration-300"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-6 h-6 text-[#EECE84]" />
                      </motion.div>
                      <div>
                        <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div variants={fadeInUp}>
                <Button 
                  onClick={() => router.push('/community')}
                  size="lg"
                  className="group bg-white/10 hover:bg-white/20 text-white rounded-[24px] px-6 h-12 text-sm transition-all duration-300"
                >
                  <span className="flex items-center">
                    Join Our Community
                    <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                      ⟶
                    </span>
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Heroes;
