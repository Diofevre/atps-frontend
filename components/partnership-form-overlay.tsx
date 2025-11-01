'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

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
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  studentsNumber: z.string().min(1, 'Number of students is required'),
  currentTraining: z.string().min(10, 'Please describe your current training setup'),
  integrationNeeds: z.string().min(10, 'Please describe your integration needs'),
  timeline: z.string().min(2, 'Timeline is required'),
  additionalInfo: z.string().optional(),
});

interface PartnershipFormOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnershipFormOverlay: React.FC<PartnershipFormOverlayProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      contactPerson: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      studentsNumber: '',
      currentTraining: '',
      integrationNeeds: '',
      timeline: '',
      additionalInfo: '',
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
          prenom: values.contactPerson,
          nom: values.schoolName,
          email: values.email,
          phone: values.phone,
          message: `Partnership Request from ${values.schoolName}

School: ${values.schoolName}
Contact Person: ${values.contactPerson}
Email: ${values.email}
Phone: ${values.phone}
Location: ${values.city}, ${values.country}
Number of Students: ${values.studentsNumber}

Current Training Setup:
${values.currentTraining}

Integration Needs:
${values.integrationNeeds}

Timeline: ${values.timeline}

Additional Information:
${values.additionalInfo || 'None'}`,
          subject: "Partnership Form Submission"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success(t.partnershipForm.submit);
      form.reset();
      onClose();
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white">{t.partnershipForm.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">{t.partnershipForm.subtitle}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* School Name */}
                      <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t.partnershipForm.schoolName}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Aviation Academy"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Contact Person */}
                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t.partnershipForm.contactPerson}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t.partnershipForm.email}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="contact@aviationacademy.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Phone */}
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t.partnershipForm.phone}</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Country */}
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t.partnershipForm.country}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="United States"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* City */}
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t.partnershipForm.city}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="New York"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Number of Students */}
                      <FormField
                        control={form.control}
                        name="studentsNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t.partnershipForm.studentsNumber}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="50-100"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Timeline */}
                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">{t.partnershipForm.timeline}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Within 3 months"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Current Training Setup */}
                    <FormField
                      control={form.control}
                      name="currentTraining"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t.partnershipForm.currentTraining}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t.partnershipForm.currentTrainingPlaceholder}
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Integration Needs */}
                    <FormField
                      control={form.control}
                      name="integrationNeeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t.partnershipForm.integrationNeeds}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t.partnershipForm.integrationPlaceholder}
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Additional Information */}
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t.partnershipForm.additionalInfo}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any other relevant information..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                        disabled={isLoading}
                      >
                        {t.partnershipForm.cancel}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-[#EECE84] to-amber-400 hover:from-[#EECE84]/90 hover:to-amber-400/90 text-slate-900"
                      >
                        {isLoading ? t.partnershipForm.submitting : t.partnershipForm.submit}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

