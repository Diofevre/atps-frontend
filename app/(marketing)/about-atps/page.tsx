/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useRef } from 'react';
import { Shield, GraduationCap, Target, Award, Users, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    icon: GraduationCap,
    title: "Comprehensive Training Content",
    description: "Access to 25,000+ verified exam questions covering all ATPL subjects, ensuring your students are thoroughly prepared for their exams."
  },
  {
    icon: Target,
    title: "Real-Time Progress Tracking",
    description: "Monitor student performance, identify knowledge gaps, and adjust teaching strategies with detailed analytics and insights."
  },
  {
    icon: Award,
    title: "Industry-Validated Questions",
    description: "Questions tagged with 'Last Seen in Exam' dates and quality scores help students focus on what matters most for success."
  },
  {
    icon: Users,
    title: "Collaborative Learning Environment",
    description: "Foster peer-to-peer learning with community features, study groups, and expert moderation from aviation professionals."
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Advanced reporting tools that track student progress, exam readiness, and provide actionable insights for curriculum improvement."
  },
  {
    icon: Zap,
    title: "AI-Powered Assistance",
    description: "24/7 AI support provides instant explanations, personalized study guidance, and helps students master complex aviation concepts."
  }
];

const features = [
  "Customizable curriculum integration",
  "White-label solution for schools",
  "Bulk student management",
  "Instructor dashboard and analytics",
  "Automated progress reports",
  "Integration with existing LMS systems",
  "Mobile-first responsive design",
  "Multi-language support"
];

const testimonials = [
  {
    name: "Aviation Training Institute",
    role: "Chief Training Officer",
    quote: "ATPS has revolutionized our ATPL preparation program. Our students' exam pass rates have increased significantly since adopting the platform."
  },
  {
    name: "European Flight Academy",
    role: "Academic Director",
    quote: "The comprehensive question bank and AI-powered features provide our students with an unmatched learning experience."
  },
  {
    name: "Pacific Aviation School",
    role: "Head of Operations",
    quote: "Partnering with ATPS has streamlined our curriculum delivery and given our instructors powerful tools to track student progress."
  }
];

const AboutATPS = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=2560"
            alt="Aviation Training"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[24px] bg-[#EECE84]/10 border border-[#EECE84]/20 text-[#EECE84] text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="font-medium">Trusted by Leading Aviation Schools</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Empowering Aviation Schools
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#EECE84]/40 via-[#EECE84]/50 to-[#EECE84]/60">
                Through Innovation
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              ATPS partners with aviation training institutions worldwide to provide cutting-edge ATPL preparation tools, comprehensive learning resources, and advanced analytics that elevate student success rates.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#EECE84] to-amber-400 hover:from-[#EECE84]/90 hover:to-amber-400/90 text-slate-900 rounded-[24px] px-8 h-14 transition-all duration-300 group"
              >
                <span className="flex items-center font-semibold">
                  Schedule a Demo
                  <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                    ⟶
                  </span>
                </span>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-[24px] px-8 h-14 transition-all duration-300"
              >
                Contact Partnership Team
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "25K+", label: "Exam Questions", icon: Target },
              { value: "50+", label: "Partner Schools", icon: GraduationCap },
              { value: "98%", label: "Satisfaction Rate", icon: Award },
              { value: "24/7", label: "AI Support", icon: Zap }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#EECE84]/30 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EECE84]/10 text-[#EECE84] mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div ref={benefitsRef} className="relative bg-slate-900 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[24px] bg-[#EECE84]/10 border border-[#EECE84]/20 text-[#EECE84] text-sm mb-6">
              <Shield className="w-4 h-4" />
              Why Partner with ATPS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Benefits for Aviation Schools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your ATPL training program with comprehensive resources and cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#EECE84]/30 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#EECE84]/10 text-[#EECE84] mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="relative bg-slate-800/50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={featuresInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Platform Features
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Everything you need to deliver exceptional ATPL training and track student success
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={featuresInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#EECE84] flex-shrink-0" />
                    <span className="text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={featuresInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80"
                  alt="ATPS Platform"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent" />
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={featuresInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-[#EECE84]/20 shadow-xl max-w-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#EECE84]/10">
                    <Users className="w-6 h-6 text-[#EECE84]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Join Leading Schools</p>
                    <p className="text-sm text-gray-400 mt-1">50+ institutions worldwide trust ATPS</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="relative bg-slate-900 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Leading Aviation Schools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what our partners have to say about their experience with ATPS
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#EECE84]/30 transition-all"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#EECE84]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-[#EECE84]/10 via-slate-900 to-slate-900 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#EECE84] to-amber-400">
                ATPL Training Program?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join 50+ leading aviation schools worldwide and provide your students with the most comprehensive ATPL preparation platform available.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#EECE84] to-amber-400 hover:from-[#EECE84]/90 hover:to-amber-400/90 text-slate-900 rounded-[24px] px-10 h-16 text-lg transition-all duration-300 group"
              >
                <span className="flex items-center font-semibold">
                  Schedule a Partnership Call
                  <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                    ⟶
                  </span>
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutATPS;
