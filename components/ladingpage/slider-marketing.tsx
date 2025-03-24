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

const features = [
  {
    icon: HelpCircle,
    title: "Questions bank",
    description: `50,000+ verified real exam questions, updated daily. With "Last Seen in Exam" questions and a Question Quality Score, it helps you focus on key topics to ace your ATPL exams efficiently.`,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000"
  },
  {
    icon: BookOpen,
    title: "Courses",
    description: "Our courses provide expert-designed, structured lessons with detailed explanations to help you master aviation theory and excel in your ATPL exams.",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000"
  },
  {
    icon: Brain,
    title: "AI",
    description: "The ATPS AI provides instant explanations, personalized study guidance, and real-time support, helping you master aviation concepts and optimize your learning efficiently.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
  },
  {
    icon: MonitorPlay,
    title: "Simulator",
    description: "Enhance your training with the ATPS Simulator, featuring realistic scenarios that build practical skills and reinforce your aviation knowledge for real-world readiness.",
    image: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?auto=format&fit=crop&q=80&w=1000"
  }
];

const MarketingSlider = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <section className="relative py-28 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-[24px] bg-[#EECE84]/10 border border-[#EECE84]/20 text-[#EECE84] text-sm mb-6">
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-[#EECE84]"></span>
              Why Choose Us
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              WHY STUDY
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#EECE84] to-amber-400 mt-2">
                WITH ATPS?
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300 leading-relaxed">
              Vitae sapien pellentesque habitant morbi tristique senectus et netus et. Feugiat 
              nibh sed pulvinar proin gravida hendrerit lectus. Mi sit amet mauris commodo 
              quis imperdiet massa tincidunt nunc. Viverra aliquet eget sit amet tellus. Ornare 
              lectus sit amet est placerat in. Lectus magna fringilla urna porttitor rhoncus vitae.
            </p>
          </div>

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
                    <Card className="relative overflow-hidden bg-white/5 border-[#EECE84]/10 backdrop-blur-xl">
                      <div className="absolute inset-0">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
                      </div>
                      <CardHeader className="relative">
                        <div className="w-12 h-12 rounded-xl bg-[#EECE84]/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-[#EECE84]" />
                        </div>
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
                          size="sm"
                          className="w-full group h-12 bg-gradient-to-r from-[#EECE84] to-amber-400 hover:from-[#EECE84]/90 hover:to-amber-400/90 text-black rounded-[24px] transition-all duration-300"
                        >
                          <span className="flex items-center justify-center">
                            TRY IT NOW
                          </span>
                          <span className="ml-2 h-5 w-5 mt-1 group-hover:translate-x-1 transition-transform">
                            ⟶
                          </span>
                        </Button>
                      </CardFooter>
                    </Card>
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