'use client'

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900">
      {/* Contact Form Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-[24px] bg-[#EECE84]/10 text-[#EECE84] text-sm">
                Contact Us
              </div>
              <h2 className="text-3xl font-bold text-white mt-6 mb-4">
                Let&apos;s Start Your
                <span className="block text-[#EECE84]">Aviation Journey</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Ready to take your aviation career to new heights? Get in touch with our team.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#EECE84]/10">
                    <item.icon className="w-5 h-5 text-[#EECE84]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">{item.label}</h3>
                    <p className="text-white mt-1">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2.5 rounded-lg bg-[#EECE84]/10 text-[#EECE84] hover:bg-[#EECE84]/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 rounded-2xl p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John" 
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-[#EECE84]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Doe" 
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-[#EECE84]" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="john@example.com" 
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage className="text-[#EECE84]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 (555) 000-0000" 
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage className="text-[#EECE84]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your message..." 
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage className="text-[#EECE84]" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-[#EECE84] hover:bg-[#EECE84]/90 text-black rounded-[24px] h-12"
                    disabled={isLoading}
                  >
                    <span className="flex items-center justify-center">
                      {isLoading ? 'Sending...' : 'Send Message'}
                      {isLoading ? null : <Send className="ml-2 h-4 w-4" />}
                    </span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-[24px] bg-white/5 backdrop-blur-xl border border-[#EECE84]/20">
                <span className="text-[#EECE84] font-semibold">ATPS Aviation</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Leading the future of aviation training with cutting-edge technology and expert instruction. Your success in the skies starts here.
              </p>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="text-[#EECE84] font-semibold mb-4 group">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-8 bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Products
                </span>
              </h3>
              <ul className="space-y-3">
                {products.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[#EECE84] font-semibold mb-4 group">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-8 bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Resources
                </span>
              </h3>
              <ul className="space-y-3">
                {resources.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[#EECE84] font-semibold mb-4 group">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-8 bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Company
                </span>
              </h3>
              <ul className="space-y-3">
                {company.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-[#EECE84] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-4 lg:col-span-1">
              <h3 className="text-[#EECE84] font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="p-2.5 rounded-lg bg-white/5 text-[#EECE84] hover:bg-[#EECE84]/10 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 relative">
          {/* Decorative gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EECE84]/50 to-transparent"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} ATPS Aviation. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#EECE84] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;