import type { Chat } from "./flow-viewer";

export interface Payment {
  _id: string;
  user: string;
  provider: "cashfree";
  providerOrderId: string;
  providerPaymentId?: string;
  status: "created" | "paid" | "failed" | "pending";
  amount: number;
  currency: string;
  product: "prepareAI" | "resumeAI" | "linkedin" | "premium";
  quantity: number;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  user: string;
  type: "premium" | "free";
  status: "active" | "inactive" | "cancelled";
  startDate?: string;
  endDate?: string;
  cancelAtPeriodEnd?: boolean;
  cancelledAt?: string;
  chatCredits?: {
    prepareAI: number;
    resumeAI: number;
    linkedin: number;
  };
  provider?: "cashfree" | "manual";
  createdAt: string;
  updatedAt: string;
}

export interface Pathways {
  _id: string;
  user: number;
  chats: [Chat];
}

export interface User {
  id: string;
  name: string;
  email: string;
  pro?: boolean;
  emailVerified?: boolean;
  passwordHash?: string;
  avatar?: string;
  googleId?: string;
  authProvider?: "local" | "google";
  payments?: Payment[];
  createdAt?: string;
  updatedAt?: string;
  pathways?: Pathways;
  age?: number;
  nationality?: string;
  role?: string;
  sex?: string;
  subscriptionRef?: Subscription;
}
