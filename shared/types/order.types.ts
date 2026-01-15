// shared/types/order.types.ts

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export type PaymentTerms = 'immediate' | 'net-15' | 'net-30' | 'net-60';

export interface OrderItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateOrderDTO {
  items: OrderItemDTO[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  paymentTerms?: PaymentTerms;
  notes?: string;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  note?: string;
}

export interface OrderItem {
  product: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  subtotal: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}