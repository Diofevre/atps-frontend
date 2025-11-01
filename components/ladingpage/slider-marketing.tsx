/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react';
import { 
  Brain, 
  BookOpen, 
  HelpCircle, 
  MonitorPlay,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';

const MarketingSlider = () => {
  const router = useRouter();
  const { t } = useI18n();
  
  const features = [
    {
      icon: HelpCircle,
      title: t.slider.questionsBank,
      description: t.slider.questionsBankDesc,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
      route: "/questions-bank"
    },
    {
      icon: BookOpen,
      title: t.slider.courses,
      description: t.slider.coursesDesc,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000",
      route: "/courses"
    },
    {
      icon: Brain,
      title: t.slider.ai,
      description: t.slider.aiDesc,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
      route: "/questions-bank"
    },
    {
      icon: MonitorPlay,
      title: t.slider.simulator,
      description: t.slider.simulatorDesc,
      image: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?auto=format&fit=crop&q=80&w=1000",
      route: "/atc-simulator"
    }
  ];
  
  return (
    <div className="min-h-screen bg-slate-900">
      <section className="relative py-28 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-[24px] bg-[#EECE84]/10 border border-[#EECE84]/20 text-[#EECE84] text-sm mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-[#EECE84]"></span>
              {t.slider.whyChooseUs}
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {t.slider.whyStudyTitle}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#EECE84] to-amber-400 mt-2">
                {t.slider.whyStudySubtitle}
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300 leading-relaxed">
              {t.slider.whyStudyDescription}
            </p>
          </motion.div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                    >
                      <Card className="relative overflow-hidden bg-white/5 border-[#EECE84]/10 backdrop-blur-xl group">
                        <motion.div 
                          className="absolute inset-0"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                        >
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
                        </motion.div>
                        <CardHeader className="relative">
                          <motion.div 
                            className="w-12 h-12 rounded-xl bg-[#EECE84]/10 flex items-center justify-center mb-4"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="w-6 h-6 text-[#EECE84]" />
                          </motion.div>
                          <CardTitle className="text-xl font-bold text-white">
                            {feature.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                          <p className="text-gray-300">
                            {feature.description}
                          </p>
                        </CardContent>
                        <CardFooter className="relative">
                          <Button 
                            onClick={() => router.push(feature.route)}
                            size="sm"
                            className="w-full group h-12 bg-gradient-to-r from-[#EECE84] to-amber-400 hover:from-[#EECE84]/90 hover:to-amber-400/90 text-black rounded-[24px] transition-all duration-300"
                          >
                            <span className="flex items-center justify-center">
                              {t.slider.tryItNow}
                            </span>
                            <span className="ml-2 h-5 w-5 mt-1 group-hover:translate-x-1 transition-transform">
                              ⟶
                            </span>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="bg-white/5 border-[#EECE84]/20 text-white hover:bg-white/10" />
              <CarouselNext className="bg-white/5 border-[#EECE84]/20 text-white hover:bg-white/10" />
            </div>
          </Carousel>
        </div>
      </section>
    </div>
  );
};

export default MarketingSlider;