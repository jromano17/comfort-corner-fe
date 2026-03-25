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

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = sessionStorage.getItem("refreshToken");
    console.log("FIRST REFRESH TOKEN" + refreshToken);
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }), 
    });

    if (!response.ok) throw new Error("Refresh token expired or invalid");

    const data = await response.json();
    console.log("SEcond refresh" + data);
    sessionStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      sessionStorage.setItem("refreshToken", data.refreshToken);
    }

    return data.accessToken;
  } catch (error) {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    window.location.href = "/login"; 
    return null;
  }
}
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("comfort_corner_token");
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
  console.log("First try" + url + " " + options + " " + headers);
  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    console.log("Access token expired! Triggering silent refresh...");
    
    const newToken = await refreshAccessToken();
    console.log(newToken);
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      
      response = await fetch(url, { ...options, headers });
    }
  }

  return response;
}