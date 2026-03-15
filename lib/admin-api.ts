import {
  Category,
  Supplier,
  Chair,
  Material,
  ColorOption,
  Dimension,
  ChairVariant,
  CreateCategoryRequest,
  CreateSupplierRequest,
  CreateChairRequest,
  CreateMaterialRequest,
  CreateColorOptionRequest,
  CreateDimensionRequest,
  CreateChairVariantRequest,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function createCategory(
  data: CreateCategoryRequest,
  token: string
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
}

// Suppliers
export async function fetchSuppliers(token: string): Promise<Supplier[]> {
  const response = await fetch(`${API_BASE_URL}/api/suppliers`, {
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch suppliers");
  return response.json();
}

export async function createSupplier(
  data: CreateSupplierRequest,
  token: string
): Promise<Supplier> {
  const response = await fetch(`${API_BASE_URL}/api/suppliers`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create supplier");
  return response.json();
}

// Chairs
export async function createChair(
  data: CreateChairRequest,
  token: string
): Promise<Chair> {
  const response = await fetch(`${API_BASE_URL}/api/chairs`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create chair");
  return response.json();
}

export async function uploadChairImages(
  chairId: number,
  files: File[],
  token: string
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(`${API_BASE_URL}/api/chairs/${chairId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload images");
  return response.json();
}

export async function deleteChair(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/chairs/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to delete chair");
}

// Materials
export async function fetchMaterials(): Promise<Material[]> {
  const response = await fetch(`${API_BASE_URL}/api/materials`);
  if (!response.ok) throw new Error("Failed to fetch materials");
  return response.json();
}

export async function createMaterial(
  data: CreateMaterialRequest,
  token: string
): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/api/materials`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create material");
  return response.json();
}

// Color Options
export async function fetchColorOptions(): Promise<ColorOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/color-options`);
  if (!response.ok) throw new Error("Failed to fetch color options");
  return response.json();
}

export async function createColorOption(
  data: CreateColorOptionRequest,
  token: string
): Promise<ColorOption> {
  const response = await fetch(`${API_BASE_URL}/api/color-options`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create color option");
  return response.json();
}

// Dimensions
export async function fetchDimensions(): Promise<Dimension[]> {
  const response = await fetch(`${API_BASE_URL}/api/dimensions`);
  if (!response.ok) throw new Error("Failed to fetch dimensions");
  return response.json();
}

export async function createDimension(
  data: CreateDimensionRequest,
  token: string
): Promise<Dimension> {
  const response = await fetch(`${API_BASE_URL}/api/dimensions`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create dimension");
  return response.json();
}

// Chair Variants
export async function createChairVariant(
  data: CreateChairVariantRequest,
  token: string
): Promise<ChairVariant> {
  const response = await fetch(`${API_BASE_URL}/api/chair-variants`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create chair variant");
  return response.json();
}

export async function uploadVariantImage(
  variantId: number,
  file: File,
  token: string
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${API_BASE_URL}/api/chair-variants/${variantId}/image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );
  if (!response.ok) throw new Error("Failed to upload variant image");
  return response.json();
}

export async function deleteChairVariant(
  id: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/chair-variants/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to delete chair variant");
}
