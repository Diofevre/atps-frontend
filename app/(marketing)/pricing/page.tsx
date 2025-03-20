'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { subscriptionService } from '@/lib/subscription/service/subscription-service';
import { useAuth } from '@clerk/nextjs';
import { BookOpen, Plane, Sparkles, X } from 'lucide-react';
import { features_pricing } from '@/lib/marketing_page/constant';

interface Subscription {
  duration: number;
  price: number;
  saving: number;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  subscriptions: Subscription[];
  highlight: boolean;
  color: string;
}

const PricingPage = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<{
    plan: Plan;
    subscription: Subscription;
  } | null>(null);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    const token = await getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      const session = await subscriptionService.createCheckoutSession({
        plan: selectedPlan.plan.id,
        billingCycle: selectedPlan.subscription.duration,
      }, token);

      router.push(`${session.url}`);
    } catch (error) {
      console.error('Subscription error:', error);
      router.push('/cancelled');
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handlePlanSelection = (plan: Plan, subscription: Subscription) => {
    setSelectedPlan({ plan, subscription });
    setShowConfirmModal(true);
  };

  const plans: Plan[] = [
    {
      id: "standard",
      name: "Standard Offer",
      description: "Unlimited access to our question bank from a single device—your go-to tool for exam preparation.",
      icon: BookOpen,
      subscriptions: [
        { duration: 12, price: 10, saving: 180 },
        { duration: 6, price: 15, saving: 60 },
        { duration: 3, price: 20, saving: 15 },
        { duration: 1, price: 25, saving: 0 }
      ],
      highlight: false,
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      id: "premium",
      name: "Premium Offer",
      description: "Full access to our question bank, detailed courses, AI support, and an integrated aviation dictionary for a comprehensive learning experience.",
      icon: Sparkles,
      subscriptions: [
        { duration: 12, price: 20, saving: 180 },
        { duration: 6, price: 25, saving: 60 },
        { duration: 3, price: 30, saving: 15 },
        { duration: 1, price: 35, saving: 0 }
      ],
      highlight: true,
      color: "from-[#EECE84]/20 to-amber-500/20"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-16 bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#EECE84]/10 border border-[#EECE84]/20 backdrop-blur-sm mb-6">
            <Plane className="h-4 w-4 text-[#EECE84] mr-2 transform -rotate-45" />
            <span className="text-[#EECE84] text-sm font-medium">Training Programs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your aviation journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={`relative group ${plan.highlight ? 'md:-mt-4' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute z-10 -top-1 left-1/2 -translate-x-1/2">
                  <div className="bg-[#EECE84] text-black px-6 py-2 rounded-full font-medium shadow-lg shadow-[#EECE84]/20 text-sm">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 ${
                plan.highlight ? 'ring-2 ring-[#EECE84] mt-4' : ''
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {React.createElement(plan.icon, { className: `w-6 h-6 ${plan.highlight ? 'text-[#EECE84]' : 'text-blue-400'}` })}
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                </div>
                
                <p className="text-gray-400 text-sm mb-8">{plan.description}</p>

                <div className="grid gap-4">
                  {plan.subscriptions.map((sub) => (
                    <motion.button
                      key={sub.duration}
                      onClick={() => handlePlanSelection(plan, sub)}
                      whileHover={{ scale: 1.02 }}
                      className="relative group w-full text-left"
                    >
                      <div className={`p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all ${
                        sub.duration === 12 ? 'ring-2 ring-[#EECE84]' : ''
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">€{sub.price}</span>
                            <span className="text-gray-400">/month</span>
                          </div>
                          {sub.saving > 0 && (
                            <div className="text-[#EECE84] text-sm font-medium">
                              Save €{sub.saving}
                            </div>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">
                          billed for {sub.duration} {sub.duration === 1 ? 'month' : 'months'}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features_pricing.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6, duration: 0.8 }}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
              >
                <div className="relative mb-4">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#EECE84]/20 to-amber-500/20 w-fit group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 rounded-xl bg-slate-900/40 backdrop-blur-sm" />
                    <Icon className="relative w-6 h-6 text-[#EECE84]" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-[#EECE84]/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full relative"
          >
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-4">Confirm Your Plan</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <selectedPlan.plan.icon className={`w-5 h-5 ${selectedPlan.plan.highlight ? 'text-[#EECE84]' : 'text-blue-400'}`} />
                  <h4 className="font-semibold text-white">{selectedPlan.plan.name}</h4>
                </div>
                <p className="text-sm text-gray-400">{selectedPlan.plan.description}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xl font-bold text-white">€{selectedPlan.subscription.price}/month</span>
                  {selectedPlan.subscription.saving > 0 && (
                    <span className="text-[#EECE84] text-sm">Save €{selectedPlan.subscription.saving}</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Billed for {selectedPlan.subscription.duration} {selectedPlan.subscription.duration === 1 ? 'month' : 'months'}
                </p>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-[#EECE84] hover:bg-[#EECE84]/90 text-black font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Confirm Subscription'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;