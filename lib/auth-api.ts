import { AuthResponse, LoginRequest, RegisterRequest, UserRole } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  console.log("auth api11");
  console.log(data);
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log("auth api");
  console.log(response);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  const rawData = await response.json();
  const transformedResponse: AuthResponse = {
    refreshToken: rawData.refreshToken,
    accessToken: rawData.accessToken, 
    user: {
      username: rawData.username,
      role: rawData.role as UserRole, 
    }
  };

  return transformedResponse;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  data.role = "ROLE_ADMIN";
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(response)
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Registration failed");
  }

  const rawData = await response.json();
  const transformedResponse: AuthResponse = {
    refreshToken: rawData.refreshToken,
    accessToken: rawData.accessToken, 
    user: {
      username: rawData.username,
      role: rawData.role as UserRole, 
    }
  };

  return transformedResponse;
}

export async function logout(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Logout failed");
  }
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
}
