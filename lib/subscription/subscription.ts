export type CheckoutSession = {
  url: string;
};

export type CreateCheckoutSessionRequest = {
  plan: string;
  billingCycle: number;
};