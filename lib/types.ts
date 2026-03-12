export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Chair {
  id: number;
  name: string;
  description: string;
  category: Category;
  basePrice: number;
  galleryImageUrls: string[];
}

export interface Material {
  id: number;
  name: string;
  description: string;
}

export interface ColorOption {
  id: number;
  name: string;
  hex: string;
}

export interface Dimension {
  id: number;
  name: string;
  width: number;
  height: number;
  depth: number;
  weightCapacity: number;
}

export interface ChairVariant {
  id: number;
  chairId: number;
  material: Material;
  colorOption: ColorOption;
  dimension: Dimension;
  finalPrice: number;
  image: string;
}

export const CATEGORY_NAMES = [
  "Dining Chairs",
  "Lounge/Accent",
  "Outdoor Chairs",
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

// Auth types
export interface User {
  id: number;
  email: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
