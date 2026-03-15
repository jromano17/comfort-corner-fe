"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, LoginRequest, RegisterRequest } from "./types";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "./auth-api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "comfort_corner_token";
const USER_KEY = "comfort_corner_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from storage
  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    const storedUser = sessionStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await apiLogin(data);
    console.log("auth context login:");
    console.log(response);
    setToken(response.accessToken);   
    setUser(response.user);
    sessionStorage.setItem(TOKEN_KEY, response.accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
    router.push("/admin");
  }, [router]);

  const register = useCallback(async (data: RegisterRequest) => {
    console.log(data)
    const response = await apiRegister(data);
    setToken(response.accessToken);
    setUser(response.user);
    sessionStorage.setItem(TOKEN_KEY, response.accessToken);
    //sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
    router.push("/");
  }, [router]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await apiLogout(token);
      }
    } catch {
      // Continue with logout even if API call fails
    } finally {
      setToken(null);
      setUser(null);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      router.push("/");
    }
  }, [token, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin: !!user && user.role === "ROLE_ADMIN",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  
  /*
    console.log("auth context");
    console.log(user);
    console.log(token);
    console.log(isLoading);*/
  const context = useContext(AuthContext);
  console.log(context)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
