import { fetchWithAuth } from "./auth-api";
import { CreateOrderRequest, Order, PaginatedOrders, Shipment } from "./types";
import { getApiErrorMessage } from "./utils";

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
    //const error = await response.json().catch(() => ({}));
    //throw new Error(Object.values(error.message).join(', ') || "Failed to create order");
    console.log(response);
    const error = await getApiErrorMessage(response);
    console.log(error);
    throw new Error(error);
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