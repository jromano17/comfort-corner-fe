import { CreateOrderRequest, Order } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("auth_token");
}

function getRequiredToken(): string {
  const token = getStoredToken();
  if (!token) throw new Error("Authentication required");
  return token;
}

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createOrder(
  data: CreateOrderRequest,
  token?: string
): Promise<Order> {
  const authToken = token || getRequiredToken();
  
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: authHeaders(authToken),
    body: JSON.stringify({
      ...data,
      createdAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create order");
  }

  return response.json();
}

export async function fetchOrders(token?: string): Promise<Order[]> {
  const authToken = token || getRequiredToken();

  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: authHeaders(authToken),
  });

  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

export async function fetchOrderById(
  orderId: number,
  token?: string
): Promise<Order> {
  const authToken = token || getRequiredToken();

  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    headers: authHeaders(authToken),
  });

  if (!response.ok) throw new Error("Failed to fetch order");
  return response.json();
}
