import { AuthResponse, LoginRequest, RegisterRequest, UserRole } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const TOKEN_KEY = "comfort_corner_token";
const USER_KEY = "comfort_corner_user";
const REFRESH_KEY = "comfort_corner_refresh_token";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Login failed");
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
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.response.data.message || "Registration failed");
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
    throw new Error(error.response.data.message || "Logout failed");
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

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = sessionStorage.getItem(REFRESH_KEY);
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }), 
    });

    if (!response.ok) throw new Error("Refresh token expired or invalid");

    const data = await response.json();
    sessionStorage.setItem(TOKEN_KEY, data.accessToken);
    if (data.refreshToken) {
      sessionStorage.setItem(REFRESH_KEY, data.refreshToken);
    }

    return data.accessToken;
  } catch (error) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    window.location.href = "/login"; 
    return null;
  }
}
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

function getRequiredToken(): string {
  const token = getStoredToken();
  if (!token) throw new Error("Authentication required");
  return token;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let accessToken = getRequiredToken();

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    console.log("Access token expired! Triggering silent refresh...");
    
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      
      response = await fetch(url, { ...options, headers });
    }
  }

  return response;
}