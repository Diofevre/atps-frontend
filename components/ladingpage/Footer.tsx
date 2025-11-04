'use client'

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Send, Zap } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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
import { useI18n } from '@/lib/i18n/context';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const Footer = () => {
  const { t } = useI18n();
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
      {/* CTA Section - Left aligned */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-left space-y-6 max-w-3xl"
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-[24px] bg-[#EECE84]/10 border border-[#EECE84]/20 text-[#EECE84] text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4 mr-2" />
            {t.footer.ctaBanner}
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {t.footer.ctaTitle}
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#EECE84] to-amber-400">
              {t.footer.ctaSubtitle}
            </span>
              </h2>
          <div className="flex gap-4 justify-start">
            <Link href="/signup">
                  <Button 
                size="lg"
                className="bg-gradient-to-r from-[#EECE84] to-amber-400 hover:from-[#EECE84]/90 hover:to-amber-400/90 text-slate-900 rounded-[24px] px-8 h-14 transition-all duration-300 group"
              >
                <span className="flex items-center font-semibold">
                  {t.footer.getStarted}
                  <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                    ⟶
                  </span>
                    </span>
                  </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="relative border-t border-white/5">
        {/* Giant ATPS background - Artistic Silhouette */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-[900px] font-black leading-none" style={{
              letterSpacing: '80px',
              color: 'rgba(255,255,255,0.5)',
              WebkitTextStroke: '3px rgba(238,206,132,0.4)',
              filter: 'blur(3px) drop-shadow(0 0 80px rgba(238,206,132,0.5)) drop-shadow(0 0 150px rgba(255,255,255,0.3))',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 900,
              textShadow: `
                0 0 120px rgba(255,255,255,0.5),
                0 0 250px rgba(238,206,132,0.4),
                0 0 500px rgba(255,255,255,0.3),
                inset 0 0 100px rgba(255,255,255,0.2)
              `,
            }}>
              ATPS
            </span>
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
                {t.footer.description}
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
              <h4 className="text-white font-semibold mb-6 text-lg">{t.footer.quickLinks}</h4>
              <ul className="space-y-4">
                {[
                  { name: "ATPL Question Bank", href: "/questions-bank" },
                  { name: "Flight Simulator", href: "/atc-simulator" },
                  { name: "Courses", href: "/courses" },
                  { name: "Progress Tracking", href: "/dashboard" }
                ].map((item, index) => (
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
              <h4 className="text-white font-semibold mb-6 text-lg">{t.footer.company}</h4>
              <ul className="space-y-4">
                {[
                  { name: "Partnerships", href: "/partnerships" },
                  { name: "Our Instructors", href: "#" },
                  { name: "Contact Us", href: "#" }
                ].map((item, index) => (
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
                {t.footer.allRightsReserved}
            </p>
            <div className="flex items-center gap-6">
                <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">{t.footer.privacyPolicy}</Link>
                <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">{t.footer.termsOfService}</Link>
                <Link href="/cookie-policy" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">{t.footer.cookiePolicy}</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
