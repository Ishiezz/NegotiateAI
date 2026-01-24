import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  OrderStatus,
  PaymentStatus,
  PaymentTerms,
  OrderItem,
  StatusHistoryEntry,
} from '../../../shared/types/order.types';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentTerms: PaymentTerms;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  notes?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String, required: true },
  subtotal: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: (): string => `RM-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`,
    },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending','confirmed','processing','shipped','delivered','cancelled'] as OrderStatus[],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid','partial','paid'] as PaymentStatus[],
      default: 'unpaid',
    },
    paymentTerms: {
      type: String,
      enum: ['immediate','net-15','net-30','net-60'] as PaymentTerms[],
      default: 'immediate',
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    notes: { type: String },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ seller: 1, status: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);