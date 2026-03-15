export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactEmail: string;
  country: string;
}

export interface Chair {
  id: number;
  name: string;
  description: string;
  category: Category;
  supplier: Supplier;
  basePrice: number;
  gallery: string[];
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
  price: number;
  stockQuantity: number;
  image: string;
}

export const CATEGORY_NAMES = [
  "Dining Chairs",
  "Lounge/Accent",
  "Outdoor Chairs",
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

// Auth types
export type UserRole = "ROLE_USER" | "ROLE_ADMIN";

export interface User {
 // id: number;
 // email: string;
  username: string;
  role: UserRole;
}
export interface UserRegistry {
  id: number;
  email: string;
  username: string;
  role: UserRole;
}
export interface AuthResponse {
  accessToken: string;
  user: User;
  refreshToken: string
}


export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  role: string;
}

// Admin request types
export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactEmail: string;
  country: string;
}

export interface CreateChairRequest {
  name: string;
  description: string;
  categoryId: number;
  supplierId: number;
  basePrice: number;
}

export interface CreateMaterialRequest {
  name: string;
  description: string;
}

export interface CreateColorOptionRequest {
  name: string;
  hex: string;
}

export interface CreateDimensionRequest {
  name: string;
  width: number;
  height: number;
  depth: number;
  weightCapacity: number;
}

export interface CreateChairVariantRequest {
  chairId: number;
  materialId: number;
  colorOptionId: number;
  dimensionId: number;
  price: number;
  stockQuantity: number;
}
