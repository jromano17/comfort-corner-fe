import { fetchWithAuth } from "./auth-api";
import { CreateOrderRequest, Order, PaginatedOrders, Shipment } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function createOrder(
  data: CreateOrderRequest): Promise<Order> {
  
  const response = await fetchWithAuth(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    body: JSON.stringify({
      ...data,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create order");
  }

  return response.json();
}
export async function fetchOrderById(
  orderId: number): Promise<Order> {

  const response = await fetchWithAuth(`${API_BASE_URL}/api/orders/${orderId}`, {});

  if (!response.ok) throw new Error("Failed to fetch order");
  return response.json();
}

export async function fetchUserOrders(
  page: number = 0, 
  size: number = 10): Promise<PaginatedOrders> {
  
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: "createdAt,desc" 
  });

  const response = await fetchWithAuth(`${API_BASE_URL}/api/orders/my-orders?${params.toString()}`, {
    method: "GET",
  });
  
  if (!response.ok) throw new Error("Failed to fetch orders");
  
  const data = await response.json();
  return data; 
}