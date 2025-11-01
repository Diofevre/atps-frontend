'use client'

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Send, Zap } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const products = [
  { name: "ATPL Question Bank", href: "/questions-bank" },
  { name: "Flight Simulator", href: "/atc-simulator" },
  { name: "Courses", href: "/courses" },
  { name: "Progress Tracking", href: "/dashboard" }
];

const resources = [
  { name: "Student Success Stories", href: "/community" },
  { name: "Aviation Blog", href: "/news" },
  { name: "Career Guidance", href: "#" },
  { name: "Training Calendar", href: "#" }
];

const company = [
  { name: "About ATPS", href: "/about-atps" },
  { name: "Our Instructors", href: "#" },
  { name: "Partnerships", href: "/about-atps" },
  { name: "Contact Us", href: "#" }
];

const Footer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/avis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: values.lastName,
          prenom: values.firstName,
          email: values.email,
          phone: values.phone,
          message: values.message,
          subject: "New Contact Form Submission"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Your message has been sent successfully.');
      
      form.reset();
    } catch (error) {
      toast('Failed to send message. Please try again.');
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <footer className="relative bg-slate-800/50 backdrop-blur-xl border-t border-white/5">
      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-[24px] bg-[#EECE84]/10 border border-[#EECE84]/20 text-[#EECE84] text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Start Your Aviation Journey
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to soar into
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#EECE84] to-amber-400">
              Knowledge with ATPS?
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#EECE84] to-amber-400 hover:from-[#EECE84]/90 hover:to-amber-400/90 text-slate-900 rounded-[24px] px-8 h-14 transition-all duration-300 group"
            >
              <span className="flex items-center font-semibold">
                Get Started
                <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                  ⟶
                </span>
              </span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-[24px] px-8 h-14 transition-all duration-300 group"
            >
              <span className="flex items-center font-semibold">
                Book a Demo
                <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                  ⟶
                </span>
              </span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="relative border-t border-white/5">
        {/* Giant ATPS background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-[400px] font-black text-white tracking-wider">ATPS</span>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section - Left */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="/atps-default.png"
                    alt="ATPS Logo"
                    fill
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <span className="text-3xl font-bold text-white">ATPS.</span>
              </div>
              <p className="text-gray-400 text-base max-w-md leading-relaxed">
                Master aviation effortlessly. Your complete ATPL training platform with AI-powered learning and comprehensive resources.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#EECE84] transition-colors border border-white/5 hover:border-[#EECE84]/30"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h4 className="text-white font-semibold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4">
                {products.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-gray-400 hover:text-[#EECE84] transition-colors text-sm flex items-center gap-3 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-4">
                {company.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-gray-400 hover:text-[#EECE84] transition-colors text-sm flex items-center gap-3 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-12 border-t border-white/5"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                © All rights reserved. ATPS Aviation. Powered by innovation.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">Terms of Service</a>
                <a href="#" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">Cookie Policy</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
