'use client';

import React from 'react';
import { Crown, Calendar, AlertTriangle, CheckCircle, X, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { useAdmin } from '@/hooks/useAdmin';

const SubscriptionStatus: React.FC = () => {
  const { subscription, isLoading } = useSubscription();
  const { adminStatus } = useAdmin();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Unable to load subscription status</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    if (adminStatus?.isAdmin) {
      return <Crown className="w-4 h-4 text-purple-600" />;
    }
    
    switch (subscription.status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'expired':
        return <X className="w-4 h-4 text-red-600" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-gray-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = () => {
    if (adminStatus?.isAdmin) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    
    switch (subscription.status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getPlanBadge = () => {
    if (adminStatus?.isAdmin) {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          <Crown className="w-3 h-3 mr-1" />
          ADMIN
        </Badge>
      );
    }
    
    const planColors: Record<string, string> = {
      free: 'bg-gray-100 text-gray-800 border-gray-200',
      pro: 'bg-blue-100 text-blue-800 border-blue-200',
      premium: 'bg-purple-100 text-purple-800 border-purple-200',
      standard: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    
    return (
      <Badge className={planColors[subscription.planType]}>
        <Crown className="w-3 h-3 mr-1" />
        {subscription.planType.toUpperCase()}
      </Badge>
    );
  };

  const getExpirationText = () => {
    if (adminStatus?.isAdmin) {
      return "Admin - No expiration";
    }
    
    if (!subscription.hasSubscription) {
      return "No active subscription";
    }
    
    if (subscription.daysUntilExpiration === null) {
      return "No expiration date";
    }
    
    if (subscription.daysUntilExpiration <= 0) {
      return "Expired";
    }
    
    if (subscription.daysUntilExpiration <= 7) {
      return `Expires in ${subscription.daysUntilExpiration} day${subscription.daysUntilExpiration === 1 ? '' : 's'}`;
    }
    
    return `Expires in ${subscription.daysUntilExpiration} days`;
  };

  const getExpirationColor = () => {
    if (adminStatus?.isAdmin) {
      return "text-purple-600";
    }
    
    if (!subscription.hasSubscription || subscription.isExpired) {
      return "text-red-600";
    }
    
    if (subscription.isExpiringSoon) {
      return "text-orange-600";
    }
    
    return "text-green-600";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getStatusIcon()}
          Subscription Status
        </CardTitle>
        <CardDescription>
          Your current subscription and access level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Plan</span>
          {getPlanBadge()}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <Badge className={getStatusColor()}>
            {subscription.status.toUpperCase()}
          </Badge>
        </div>

        {/* Expiration */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Expiration</span>
          <span className={`text-sm ${getExpirationColor()}`}>
            {getExpirationText()}
          </span>
        </div>

        {/* Access Level */}
        <div className="pt-2 border-t">
          <div className="text-sm font-medium text-gray-700 mb-2">Access Level</div>
          <div className="space-y-1">
            {adminStatus?.isAdmin ? (
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Crown className="w-3 h-3" />
                Full admin access to all features
              </div>
            ) : (
              <>
                <div className={`flex items-center gap-2 text-sm ${subscription.planType !== 'free' ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  Questions & Tests
                </div>
                <div className={`flex items-center gap-2 text-sm ${subscription.planType === 'pro' || subscription.planType === 'premium' ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  Advanced Features
                </div>
                <div className={`flex items-center gap-2 text-sm ${subscription.planType === 'premium' ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  Premium Content
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        {!adminStatus?.isAdmin && subscription.planType === 'free' && (
          <div className="pt-3 border-t">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => window.location.href = '/pricing'}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        )}

        {!adminStatus?.isAdmin && subscription.isExpiringSoon && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 text-orange-600 text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              Your subscription expires soon
            </div>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/pricing'}
            >
              Renew Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
