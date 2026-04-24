export interface Deal {
  id: string;
  material: string;
  quantity: string;
  targetPrice: string;
  deliveryDate: string;
  status: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface NegotiatedTerms {
  material: string;
  quantity: string;
  targetPrice: string;
  delivery: string;
}
