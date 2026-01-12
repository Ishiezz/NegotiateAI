// shared/types/product.types.ts
// Used by both frontend (JSDoc import) and backend (TypeScript import)

export type ProductCategory =
  | 'metals'
  | 'chemicals'
  | 'polymers'
  | 'textiles'
  | 'agricultural'
  | 'construction'
  | 'electronics'
  | 'other';

export type ProductUnit = 'kg' | 'ton' | 'litre' | 'piece' | 'meter' | 'sqft' | 'bag';

export interface PriceTier {
  minQty: number;
  maxQty?: number;
  pricePerUnit: number;
}

export interface ProductSpecifications {
  [key: string]: string;
}

// DTO = Data Transfer Object — shape of data crossing API boundary
export interface CreateProductDTO {
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  priceTiers?: PriceTier[];
  unit: ProductUnit;
  minOrderQty: number;
  stock: number;
  gstRate?: number;
  origin?: string;
  leadTime?: number;
  specifications?: ProductSpecifications;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  seller?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PriceCalculationResult {
  pricePerUnit: number;
  quantity: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}