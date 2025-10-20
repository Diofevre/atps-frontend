'use client';

import React from 'react';
import { Lock, Crown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { useAdmin } from '@/hooks/useAdmin';

interface AccessGuardProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

const AccessGuard: React.FC<AccessGuardProps> = ({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}) => {
  const { checkAccess, subscription, isLoading } = useSubscription();
  const { adminStatus } = useAdmin();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const hasAccess = checkAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const getFeatureName = (feature: string) => {
    switch (feature) {
      case 'questions':
        return 'Questions & Tests';
      case 'tests':
        return 'Practice Tests';
      case 'study':
        return 'Study Mode';
      case 'premium_content':
        return 'Premium Content';
      case 'advanced_features':
        return 'Advanced Features';
      case 'basic_features':
        return 'Basic Features';
      default:
        return 'This Feature';
    }
  };

  const getRequiredPlan = (feature: string) => {
    switch (feature) {
      case 'questions':
      case 'tests':
      case 'study':
        return 'Pro';
      case 'premium_content':
      case 'advanced_features':
        return 'Premium';
      case 'basic_features':
        return 'Pro';
      default:
        return 'Pro';
    }
  };

  return (
    <Card className="w-full border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
          <Lock className="w-5 h-5" />
          {getFeatureName(feature)} Locked
        </CardTitle>
        <CardDescription className="text-orange-700">
          This feature requires a {getRequiredPlan(feature)} subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">
            Your current plan: <strong>{subscription?.planType.toUpperCase()}</strong>
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-orange-800">Upgrade to {getRequiredPlan(feature)} to unlock:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            {feature === 'questions' && (
              <>
                <li>• Unlimited practice questions</li>
                <li>• Detailed explanations</li>
                <li>• Progress tracking</li>
              </>
            )}
            {feature === 'tests' && (
              <>
                <li>• Full-length practice tests</li>
                <li>• Test analytics</li>
                <li>• Performance insights</li>
              </>
            )}
            {feature === 'premium_content' && (
              <>
                <li>• Exclusive premium content</li>
                <li>• Advanced study materials</li>
                <li>• Priority support</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => window.location.href = '/pricing'}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/pricing'}
          >
            View Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessGuard;
