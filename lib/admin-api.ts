import { fetchWithAuth } from "./auth-api";
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
  Order,
  OrderStatus,
  PaginatedOrders,
  OrderDetail,
  Income,
  CreateIncomeRecord,
  Shipment,
  CreateShipment,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function createCategory(
  data: CreateCategoryRequest): Promise<Category> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/categories`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to create category");
  }
  return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to delete category");
  }
}

// Suppliers
export async function fetchSuppliers(): Promise<Supplier[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/suppliers`, {});
  if (!response.ok) throw new Error("Failed to fetch suppliers");
  return response.json();
}

export async function createSupplier(
  data: CreateSupplierRequest): Promise<Supplier> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/suppliers`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to create supplier");
  }
  return response.json();
}

export async function deleteSupplier(id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/suppliers/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to delete supplier");
  }
}

// Chairs
export async function createChair(data: CreateChairRequest): Promise<Chair> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/chairs`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to create chair");}
  return response.json();
}

export async function uploadChairImages(
  chairId: number,
  files: File[]
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetchWithAuth(`${API_BASE_URL}/api/chairs/${chairId}/images`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to upload images");
  }
  return response.json();
}

export async function uploadChairImage(
  chairId: number,
  file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithAuth(`${API_BASE_URL}/api/chairs/${chairId}/gallery`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to upload image");
  }
  return response.text();
}

export async function deleteChair(id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/chairs/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to delete chair");
  }
}

// Materials
export async function fetchMaterials(): Promise<Material[]> {
  const response = await fetch(`${API_BASE_URL}/api/materials`);
  if (!response.ok) throw new Error("Failed to fetch materials");
  return response.json();
}

export async function createMaterial(
  data: CreateMaterialRequest): Promise<Material> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/materials`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to create material");
  }
  return response.json();
}

// Color Options
export async function fetchColorOptions(): Promise<ColorOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/color-options`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to fetch color options");
  }
  return response.json();
}

export async function createColorOption(
  data: CreateColorOptionRequest): Promise<ColorOption> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/color-options`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to create color option");
  }
  return response.json();
}

// Dimensions
export async function fetchDimensions(): Promise<Dimension[]> {
  const response = await fetch(`${API_BASE_URL}/api/dimensions`);
  if (!response.ok) throw new Error("Failed to fetch dimensions");
  return response.json();
}

export async function createDimension(
  data: CreateDimensionRequest): Promise<Dimension> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/dimensions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to create dimension");
  }
  return response.json();
}

// Chair Variants
export async function createChairVariant(
  data: CreateChairVariantRequest): Promise<ChairVariant> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/chair-variants`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to create chair variant");
  }
  return response.json();
}

export async function uploadVariantImage(
  variantId: number,
  file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/chair-variants/${variantId}/image`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!response.ok){
    const error = await response.json().catch(() => ({}));
     throw new Error(error.response.data.message || "Failed to upload variant image");
    }
  return response.text();
}

export async function deleteChairVariant(
  id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/chair-variants/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to delete chair variant");
  }
}


//all orders
export async function fetchOrders(): Promise<Order[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/orders`, {
    method: "GET",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to fetch orders");
  }

  const data = await response.json(); 
  return data.content;
}

export async function fetchIncomes(): Promise<Income[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/income`, {
    method: "GET",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to fetch incomes");}
  return response.json();
}


export async function fetchOrderss(
  page: number = 0, 
  size: number = 10): Promise<PaginatedOrders> {
  
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: "createdAt,desc" 
  });

  const response = await fetchWithAuth(`${API_BASE_URL}/api/orders?${params.toString()}`, {
    method: "GET",
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to fetch orders");}
  
  const data = await response.json();
  return data; 
}

export async function fetchOrderById(orderId: string): Promise<OrderDetail> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: "GET",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to fetch order with ID:" + orderId);}
  let s = await response.json();
  return s;
}



export async function changeOrderStatus(
  orderId: number, 
  newStatus: OrderStatus, 
  changedBy?: number): Promise<Order> {
  const params = new URLSearchParams({newStatus: newStatus,});
  if (changedBy) {
    params.append("changedBy", changedBy.toString());
  }
  const response = await fetchWithAuth(`${API_BASE_URL}/api/orders/${orderId}/status?${params.toString()}`, {
    method: "PATCH",
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.response.data.message || `Failed to update order to ${newStatus}`);
  }

  return response.json();
}
export async function createIncomeRecord(
  data: CreateIncomeRecord): Promise<Income> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/income/${data.orderId}`, {
    method: "POST",
    body: JSON.stringify(data)
  });
  
  console.log(response);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.response.data.message || `Failed to add an income record to order with ID ${data.orderId}`);
  }

  return response.json();
}

export async function updateShipmentStatus(
  shipmentId: number | undefined,
  status : string): Promise<Shipment> {
  const params = new URLSearchParams({status: status,});
  const response = await fetchWithAuth(`${API_BASE_URL}/api/shipments/${shipmentId}?${params.toString()}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to change shipment status");}
  return response.json();
}
export async function createShipment(
  data: CreateShipment): Promise<Shipment> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/shipments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log(data);
  console.log(response);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Failed to create shipment");}
  return response.json();
}