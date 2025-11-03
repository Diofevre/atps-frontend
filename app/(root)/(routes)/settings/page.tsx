'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/mock-clerk';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, BookOpen, CheckCircle2, CreditCard, Sparkles, X } from 'lucide-react';
import { subscriptionService } from '@/lib/subscription/service/subscription-service';
import { Skeleton } from '@/components/ui/skeleton';
import useSWR from 'swr';

interface UserSubscription {
  id: string;
  subscription_status: string;
  subscription_plan: string;
  billing_cycle: number;
  price_per_month: number;
  trial_start_date: string;
  trial_end_date: string;
  suspended: boolean;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionLabel: string;
  type: 'warning' | 'info' | 'success';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel,
  type
}) => {
  const iconMap = {
    warning: AlertTriangle,
    info: CheckCircle2,
    success: CheckCircle2
  };

  const Icon = iconMap[type];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border border-border shadow-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Icon className={`w-8 h-8 ${type === 'warning' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground mt-4">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              type === 'warning'
                ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
            } transition-colors`}
          >
            {actionLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SubscriptionSkeleton = () => {
  return (
    <div className="min-h-screen pt-4 pb-16 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2 bg-muted" />
          <Skeleton className="h-5 w-96 bg-muted" />
        </div>

        {/* Current Subscription Status Skeleton */}
        <div className="bg-card rounded-2xl border border-border shadow-md p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full bg-muted" />
              <div>
                <Skeleton className="h-6 w-48 mb-2 bg-muted" />
                <Skeleton className="h-4 w-36 bg-muted" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 bg-muted" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted rounded-xl p-4 border border-border">
                <Skeleton className="h-4 w-20 mb-2 bg-card" />
                <Skeleton className="h-6 w-32 bg-card" />
              </div>
            ))}
          </div>
        </div>

        {/* Plans Section Skeleton */}
        <div className="grid gap-8">
          <div className="text-start">
            <Skeleton className="h-8 w-48 mb-2 bg-muted" />
            <Skeleton className="h-5 w-96 bg-muted" />
          </div>

          {/* Billing Cycle Selector Skeleton */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <Skeleton className="h-6 w-48 mb-4 bg-muted" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg bg-muted" />
              ))}
            </div>
          </div>

          {/* Plans Grid Skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border shadow-md p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="h-6 w-6 bg-muted" />
                  <Skeleton className="h-8 w-32 bg-muted" />
                </div>

                <div className="mb-6">
                  <Skeleton className="h-10 w-32 mb-2 bg-muted" />
                  <Skeleton className="h-4 w-24 bg-muted" />
                </div>

                <Skeleton className="h-4 w-full mb-6 bg-muted" />

                <div className="space-y-4 mb-8">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 bg-muted" />
                      <Skeleton className="h-4 w-48 bg-muted" />
                    </div>
                  ))}
                </div>

                <Skeleton className="h-12 w-full rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const plans = [
  {
    id: "standard",
    name: "Standard",
    description: "Perfect for individual pilots preparing for their exams.",
    features: [
      "Full question bank access",
      "Progress tracking",
      "Basic performance analytics",
      "Single device access"
    ],
    icon: BookOpen,
    price: {
      monthly: 25,
      quarterly: 20,
      biannual: 15,
      annual: 10
    },
    highlight: false,
    color: "from-blue-50 to-blue-100"
  },
  {
    id: "premium",
    name: "Premium",
    description: "Comprehensive solution for serious aviation professionals.",
    features: [
      "Everything in Standard",
      "Multi-device access",
      "AI-powered study assistant",
      "Detailed performance analytics",
      "Priority support"
    ],
    icon: Sparkles,
    price: {
      monthly: 35,
      quarterly: 30,
      biannual: 25,
      annual: 20
    },
    highlight: true,
    color: "from-blue-100 to-blue-200"
  }
];

const billingCycles = [
  { id: 12, label: 'Annual', discount: 60 },
  { id: 6, label: 'Bi-annual', discount: 40 },
  { id: 3, label: 'Quarterly', discount: 20 },
  { id: 1, label: 'Monthly', discount: 0 }
];

const SubscriptionPage = () => {
  const { shouldShowLoading } = useRequireAuth();
  const { getToken } = useAuth();
  const router = useRouter();
  const [selectedCycle, setSelectedCycle] = useState<number>(12);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    type: 'warning' | 'info' | 'success';
    onConfirm: () => void;
  } | null>(null);

  const fetcher = async (url: string) => {
    const token = await getToken();
    if (!token) {
      router.push('/login');
      throw new Error('No token available');
    }
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch subscription data');
    }
    return response.json();
  };

  const { data: userSubscription, error, mutate } = useSWR<UserSubscription>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`,
    fetcher,
    {
      onSuccess: (data) => {
        setSelectedCycle(data.billing_cycle);
      }
    }
  );

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePlanChange = async (planId: string, cycle: number) => {
    if (!userSubscription) return;

    const isUpgrade = plans.findIndex(p => p.id === planId) > 
      plans.findIndex(p => p.id === userSubscription.subscription_plan);

    const isDowngrade = plans.findIndex(p => p.id === planId) < 
      plans.findIndex(p => p.id === userSubscription.subscription_plan);

    if (isUpgrade) {
      setDialog({
        isOpen: true,
        title: 'Upgrade Subscription',
        description: `You're about to upgrade to the ${planId} plan. You'll be charged the difference immediately. Continue?`,
        actionLabel: 'Upgrade Now',
        type: 'success',
        onConfirm: () => handleSubscriptionAction('upgrade', planId, cycle)
      });
    } else if (isDowngrade) {
      setDialog({
        isOpen: true,
        title: 'Downgrade Subscription',
        description: 'Your new plan will take effect at the end of your current billing period. Continue?',
        actionLabel: 'Downgrade',
        type: 'warning',
        onConfirm: () => handleSubscriptionAction('downgrade', planId, cycle)
      });
    } else if (cycle !== userSubscription.billing_cycle) {
      setDialog({
        isOpen: true,
        title: 'Change Billing Cycle',
        description: 'This will take effect on your next billing date. Continue?',
        actionLabel: 'Change Cycle',
        type: 'info',
        onConfirm: () => handleSubscriptionAction('cycle', planId, cycle)
      });
    }
  };

  const handleSubscriptionAction = async (
    action: 'upgrade' | 'downgrade' | 'cycle' | 'cancel' | 'resume',
    planId?: string,
    cycle?: number
  ) => {
    setDialog(null);
    setIsLoading(true);
    
    try {
      const token = await getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      let response;
      
      switch (action) {
        case 'upgrade':
        case 'downgrade':
          response = await subscriptionService.upgradeSubscription(
            { newPlan: planId!, billingCycle: cycle! },
            token
          );
          break;
        case 'cancel':
          response = await subscriptionService.cancelSubscription(token);
          break;
        case 'resume':
          response = await subscriptionService.resumeSubscription(token);
          break;
      }

      showNotification('success', response.message);
      mutate();
    } catch (error) {
      console.error('Action error:', error);
      showNotification('error', 'Failed to process your request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDialog({
      isOpen: true,
      title: 'Cancel Subscription',
      description: 'Your subscription will remain active until the end of the current billing period. Are you sure you want to cancel?',
      actionLabel: 'Cancel Subscription',
      type: 'warning',
      onConfirm: () => handleSubscriptionAction('cancel')
    });
  };

  const handleResume = () => {
    setDialog({
      isOpen: true,
      title: 'Resume Subscription',
      description: 'Your subscription will be reactivated immediately. Continue?',
      actionLabel: 'Resume Now',
      type: 'success',
      onConfirm: () => handleSubscriptionAction('resume')
    });
  };

  if (shouldShowLoading || (!userSubscription && !error)) {
    return <SubscriptionSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card p-8 rounded-xl shadow-xl border border-border">
          <h2 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">Error</h2>
          <p className="text-text-secondary">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!userSubscription) {
    return <SubscriptionSkeleton />;
  }

  return (
    <div className="min-h-screen pt-4 pb-16 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Subscription Management</h1>
          <p className="text-text-secondary">
            Manage your subscription settings and choose the perfect plan for your aviation journey
          </p>
        </div>
        {/* Current Subscription Status */}
        <div className="bg-card rounded-2xl border border-border shadow-md p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#EECE84]/10 border border-[#EECE84] flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-xl text-card-foreground">Current Subscription</h2>
                <p className="text-text-secondary text-sm">Manage your subscription settings</p>
              </div>
            </div>
            {userSubscription.subscription_status === 'active' ? (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="px-4 py-2 bg-[#EECE84]/10 text-[#EECE84] border border-[#EECE84] text-sm rounded-lg hover:bg-[#EECE84]/20 transition-colors"
              >
                Resume Subscription
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-muted rounded-xl p-4 border border-border">
              <h3 className="text-sm text-muted-foreground mb-1">Plan</h3>
              <p className="text-xl text-card-foreground capitalize">{userSubscription.subscription_plan}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 border border-border">
              <h3 className="text-sm text-muted-foreground mb-1">Status</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  userSubscription.subscription_status === 'active' 
                    ? 'bg-green-500 dark:bg-green-400' 
                    : 'bg-red-500 dark:bg-red-400'
                }`} />
                <p className="text-xl text-card-foreground capitalize">
                  {userSubscription.subscription_status}
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-4 border border-border">
              <h3 className="text-sm text-muted-foreground mb-1">Billing Cycle</h3>
              <p className="text-xl text-card-foreground">
                {billingCycles.find(c => c.id === userSubscription.billing_cycle)?.label}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-4 border border-border">
              <h3 className="text-sm text-muted-foreground mb-1">Price</h3>
              <p className="text-xl text-card-foreground">€{userSubscription.price_per_month}/month</p>
            </div>
          </div>

          {userSubscription.trial_end_date && new Date(userSubscription.trial_end_date) > new Date() && (
            <div className="mt-6 bg-[#EECE84]/10 border border-[#EECE84] rounded-lg p-4">
              <p className="text-[#EECE84]">
                Trial period ends on {new Date(userSubscription.trial_end_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Plans Comparison */}
        <div className="grid gap-8">
          <div className="text-start">
            <h2 className="text-2xl font-bold text-foreground mb-1">Available Plans</h2>
            <p className="text-text-secondary">
              Choose the perfect plan for your needs. All plans include access to our comprehensive question bank.
            </p>
          </div>

          {/* Billing Cycle Selector */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Select Billing Cycle</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {billingCycles.map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => setSelectedCycle(cycle.id)}
                  className={`p-4 rounded-lg border ${
                    selectedCycle === cycle.id
                      ? 'border-[#EECE84] bg-[#EECE84]/10'
                      : 'border-border bg-card hover:bg-muted'
                  } transition-all`}
                >
                  <h4 className="text-card-foreground font-medium">{cycle.label}</h4>
                  {cycle.discount > 0 && (
                    <p className="text-sm text-[#EECE84]">Save {cycle.discount}%</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative ${plan.highlight ? 'md:-mt-4' : ''}`}
              >
                <div className={`h-full bg-card rounded-2xl border ${
                  plan.highlight ? 'border-[#EECE84] shadow-lg' : 'border-border shadow-md'
                } p-8`}>
                  <div className="flex items-center gap-3 mb-6">
                    <plan.icon className={`w-6 h-6 ${
                      plan.highlight ? 'text-[#EECE84]' : 'text-[#EECE84]/80'
                    }`} />
                    <h3 className="text-2xl font-bold text-card-foreground">{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-card-foreground">
                        €{plan.price[selectedCycle === 12 ? 'annual' : 
                          selectedCycle === 6 ? 'biannual' : 
                          selectedCycle === 3 ? 'quarterly' : 'monthly']}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Billed {selectedCycle === 1 ? 'monthly' : 
                        selectedCycle === 3 ? 'quarterly' :
                        selectedCycle === 6 ? 'bi-annually' : 'annually'}
                    </p>
                  </div>

                  <p className="text-text-secondary mb-6">{plan.description}</p>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                        <span className="text-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePlanChange(plan.id, selectedCycle)}
                    disabled={isLoading || (plan.id === userSubscription.subscription_plan && selectedCycle === userSubscription.billing_cycle)}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                      plan.id === userSubscription.subscription_plan && selectedCycle === userSubscription.billing_cycle
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : plan.highlight
                        ? 'bg-[#EECE84]/80 text-black hover:bg-[#EECE84]'
                        : 'bg-[#EECE84]/10 text-[#EECE84] hover:bg-[#EECE84]/20 border border-[#EECE84]'
                    }`}
                  >
                    {plan.id === userSubscription.subscription_plan && selectedCycle === userSubscription.billing_cycle
                      ? 'Current Plan'
                      : 'Select Plan'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {dialog && (
        <ConfirmationDialog
          isOpen={dialog.isOpen}
          onClose={() => setDialog(null)}
          onConfirm={dialog.onConfirm}
          title={dialog.title}
          description={dialog.description}
          actionLabel={dialog.actionLabel}
          type={dialog.type}
        />
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 max-w-md p-4 rounded-xl shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
              : 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto hover:text-foreground"
              title='Close'
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;