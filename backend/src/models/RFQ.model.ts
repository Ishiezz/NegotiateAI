export interface RFQDocument {
  buyerId: string;
  category: string;
  quantity: number;
}

export const RFQModelPurpose = "Request-for-quote storage with quote sub-doc support.";
