import type { Chat } from "./flow-viewer";

export interface RazorpayPaymentPayload {
  payment: {
    entity: {
      id: string;
      entity: string;
      amount: number;
      currency: string;
      status: string;
      order_id: string;
      invoice_id: string | null;
      international: boolean;
      method: string;
      amount_refunded: number;
      refund_status: string | null;
      captured: boolean;
      description: string;
      card_id: string | null;
      bank: string | null;
      wallet: string | null;
      vpa: string | null;
      email: string;
      contact: string;
      notes: {
        id: string;
        paymentType: string;
      };
      fee: number;
      tax: number;
      error_code: string | null;
      error_description: string | null;
      error_source: string | null;
      error_step: string | null;
      error_reason: string | null;
      acquirer_data: {
        rrn: string;
        upi_transaction_id: string;
      };
      created_at: number;
      reward: any;
      upi: {
        vpa: string;
      };
    };
  };
  order: {
    entity: {
      id: string;
      entity: string;
      amount: number;
      amount_paid: number;
      amount_due: number;
      currency: string;
      receipt: string;
      offer_id: string | null;
      status: string;
      attempts: number;
      notes: {
        id: string;
        paymentType: string;
      };
      created_at: number;
    };
  };
}

export interface Payment {
  _id: string;
  user: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: string;
  amount: number;
  source: string;
  payload: RazorpayPaymentPayload;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Subscription {
  _id: string;
  user: string; // or User if populated
  type: "solo" | "enterprise" | "ppc" | "free";
  status: "active" | "inactive";
  startDate: string; // ISO date string
  endDate?: string; // ISO date string or undefined
  activeChatCredits: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
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
  pro?: boolean | undefined;
  passwordHash?: string;
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
