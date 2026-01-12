// shared/types/auth.types.ts

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  company?: string;
  gstNumber?: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: PublicUser;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  isVerified: boolean;
  creditLimit?: number;
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}