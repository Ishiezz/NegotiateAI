import mongoose, { Document, Schema } from 'mongoose';
import {
  ProductCategory,
  ProductUnit,
  PriceTier,
  ProductSpecifications,
} from '../../../shared/types/product.types';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: ProductCategory;
  seller: mongoose.Types.ObjectId;
  basePrice: number;
  priceTiers: PriceTier[];
  unit: ProductUnit;
  minOrderQty: number;
  stock: number;
  images: string[];
  specifications: ProductSpecifications;
  origin?: string;
  leadTime: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  gstRate: number;
  createdAt: Date;
  updatedAt: Date;
  // Instance method
  getPriceForQty(qty: number): number;
}

const priceTierSchema = new Schema<PriceTier>({
  minQty: { type: Number, required: true },
  maxQty: { type: Number },
  pricePerUnit: { type: Number, required: true },
});

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: ['metals','chemicals','polymers','textiles','agricultural','construction','electronics','other'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative'],
    },
    priceTiers: [priceTierSchema],
    unit: {
      type: String,
      required: true,
      enum: ['kg','ton','litre','piece','meter','sqft','bag'],
    },
    minOrderQty: {
      type: Number,
      required: true,
      min: [1, 'Minimum order quantity must be at least 1'],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
    },
    images: [{ type: String }],
    specifications: { type: Map, of: String },
    origin: { type: String, trim: true },
    leadTime: { type: Number, default: 7 },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    gstRate: { type: Number, default: 18 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, seller: 1, isActive: 1 });

// Typed instance method: returns correct price for given quantity using tier logic
productSchema.methods.getPriceForQty = function (this: IProduct, qty: number): number {
  if (!this.priceTiers || this.priceTiers.length === 0) return this.basePrice;

  const matchingTier = this.priceTiers
    .filter((t) => qty >= t.minQty && (!t.maxQty || qty <= t.maxQty))
    .sort((a, b) => b.minQty - a.minQty)[0];

  return matchingTier ? matchingTier.pricePerUnit : this.basePrice;
};

export const Product = mongoose.model<IProduct>('Product', productSchema);