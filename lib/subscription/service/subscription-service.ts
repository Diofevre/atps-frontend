import { CheckoutSession, CreateCheckoutSessionRequest } from "../subscription";
import axios from 'axios';

export const subscriptionService = {
  async createCheckoutSession(request: CreateCheckoutSessionRequest, token: string): Promise<CheckoutSession> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  async upgradeSubscription(data: { newPlan: string; billingCycle: number }, token: string) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/upgrade`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async cancelSubscription(token: string) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async resumeSubscription(token: string) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/resume`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async renewSubscription(data: { plan: string }, token: string) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/renew`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};