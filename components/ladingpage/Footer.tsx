'use client'

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion, useScroll, useTransform } from 'framer-motion';

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

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "contact@myatps.com"
  }
];

const products = [
  { name: "ATPL Question Bank", href: "#" },
  { name: "Flight Simulator", href: "#" },
  { name: "Study Materials", href: "#" },
  { name: "Progress Tracking", href: "#" }
];

const resources = [
  { name: "Student Success Stories", href: "#" },
  { name: "Aviation Blog", href: "#" },
  { name: "Career Guidance", href: "#" },
  { name: "Training Calendar", href: "#" }
];

const company = [
  { name: "About ATPS", href: "#" },
  { name: "Our Instructors", href: "#" },
  { name: "Partnerships", href: "#" },
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
          subject: "New Contact Form Submission" // Hardcoded subject
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
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/5">
      {/* Subtle watermark background text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-[200px] font-bold text-white">ATPS</span>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section - Left */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EECE84] to-amber-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-black">A</span>
              </div>
              <span className="text-2xl font-bold text-white">ATPS.</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
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
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#EECE84] transition-colors border border-white/5 hover:border-[#EECE84]/30"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links - Middle */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {products.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Right */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {company.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © All rights reserved. ATPS Aviation. Powered by innovation.
            </p>
            <a href="#" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;