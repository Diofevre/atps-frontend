// Hook pour gérer les abonnements
'use client';

import { useState, useEffect } from 'react';

interface Subscription {
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'none';
  planType: 'free' | 'pro' | 'premium' | 'standard';
  hasSubscription: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiration: number | null;
  tier?: 'free' | 'basic' | 'premium' | 'pro';
  features?: string[];
  isActive?: boolean;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Remplacer par un vrai appel API
    // Pour l'instant, valeurs par défaut
    setIsLoading(false);
    setSubscription({
      status: 'none',
      planType: 'free',
      hasSubscription: false,
      isExpired: false,
      isExpiringSoon: false,
      daysUntilExpiration: null,
      tier: 'free',
      features: [],
      isActive: false,
    });
  }, []);

  const checkAccess = (feature: string): boolean => {
    // Par défaut, tout est accessible (à ajuster selon vos besoins)
    return true;
  };

  return {
    subscription,
    isLoading,
    checkAccess,
  };
}

