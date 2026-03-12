import { Chair, ChairVariant } from "./types";

// Uses Next.js rewrites to proxy to backend, avoiding CORS issues
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchChairs(): Promise<Chair[]> {
  console.log(`${API_BASE_URL}/api/chairs`);
  const response = await fetch(`${API_BASE_URL}/api/chairs`);
  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to fetch chairs");
  }
  return response.json();
}

export async function fetchChairById(id: number): Promise<Chair> {
  const response = await fetch(`${API_BASE_URL}/api/chairs/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chair");
  }
  return response.json();
}

export async function fetchChairVariants(chairId: number): Promise<ChairVariant[]> {
  const response = await fetch(`${API_BASE_URL}/api/chair-variants/chair/${chairId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chair variants");
  }
  return response.json();
}
