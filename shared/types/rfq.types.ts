// shared/types/rfq.types.ts

export type RFQStatus = 'open' | 'closed' | 'awarded';

export interface CreateRFQDTO {
  title: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  targetPrice?: number;
  deliveryDate: Date | string;
}

export interface SubmitQuoteDTO {
  pricePerUnit: number;
  leadTime?: number;
  notes?: string;
}

export interface RFQQuote {
  seller: string;
  pricePerUnit: number;
  totalPrice: number;
  leadTime?: number;
  notes?: string;
  submittedAt: Date;
  isAwarded: boolean;
}