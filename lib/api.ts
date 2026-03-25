import { Chair, ChairVariant } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchChairs(): Promise<Chair[]> {
  const response = await fetch(`${API_BASE_URL}/api/chairs`);
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
