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
  hexCode: string;
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
  hexCode: string;
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
  finalPrice: number;
  stockQuantity: number;
}
export interface Address {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  variantId: number;
  quantity: number;
  priceAtPurchase: number;
}

export interface CreateOrderRequest {
  billingAddress: Address;
  shippingAddress: Address;
  items: OrderItem[];
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber : string;
  createdAt: string;
  totalPrice: number;
  currentStatus: string;
}
export interface PaginatedOrders {
  content: Order[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; 
}
export interface OrderDetail {
  id: number;
  userId: number;
  orderNumber : string;
  createdAt: string;
  billingAddress: Address;
  shippingAddress: Address;
  items: OrderItemResponse[];
  totalPrice: number;
  currentStatus: string;
  shipment: Shipment;
}
export interface Shipment{
    id : number;
    orderId : number;
    trackingNumber : string;
    status : ShipmentStatus;
    estimatedDeliveryDate : string;
    createDate : string;
}
export interface ShipmentFormData{
    orderId? : number;
    trackingNumber : string;
    status : string;
    estimatedDeliveryDate : Date | undefined;
}
export interface CreateShipment{
    orderId? : number;
    trackingNumber : string;
    status : string;
    estimatedDeliveryDate : string | null;
}
export enum ShipmentStatus {
    PREPARING = "PREPARING",
    SHIPPED = "SHIPPED",
    IN_TRANSIT = "IN_TRANSIT",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    PROCESSING = "PROCESSING",
    CANCELLED = "CANCELLED"
}
export interface OrderItemResponse {
  id: number;
  variantId: number;
  quantity: number;
  priceAtPurchase: number;
  name: string;
}
export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  CREATED = "CREATED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}
interface OrderStatusPickerProps {
  orderId: number;
  currentStatus: OrderStatus;
}
export interface CartItem {
  variant: ChairVariant;
  chairName: string;
  quantity: number;
}

export interface Income{
  id : number;
  orderId : number;
  recordedAt : string;
  incomeAmount : number;
  tax : number;
  cost : number;
  netIncome : number;
}

export interface CreateIncomeRecord{
  orderId : number;
  incomeAmount : number;
  tax : number;
  cost : number;
}