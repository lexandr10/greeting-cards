import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import * as authService from "../lib/authService";
import { setTokenUpdateFunction } from "../lib/apolloClient";
import { UserType, SignUpInput, SignUpResponse} from "@/types/auth";

interface AuthContextType {
  user: UserType | null;
  accessToken: string | null;
  signUp: (
    data: SignUpInput
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const updateToken = (token: string) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  // Set the token update function in apolloClient
  useEffect(() => {
    setTokenUpdateFunction(updateToken);
  }, []);

  const handleSignUp = async (
    data: SignUpInput
  ) => {
    try {
      const resp: SignUpResponse = await authService.signUp(data);
      setAccessToken(resp.accessToken);
      localStorage.setItem("accessToken", resp.accessToken);
      setUser(resp.user);
    } catch (error) {
      console.error("SignUp error in context:", error);
      throw error;
    }
  };
	
  const handlerSignIn = async (email: string, password: string) => {
    try {
      const token = await authService.signIn({ email, password });
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
      const me = await authService.me();
      setUser(me);
    } catch (error) {
      console.error("SignIn error in context:", error);
      throw error;
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error in context:", error);
    } finally {
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      if (stored) {
        setAccessToken(stored);
        try {
          const me = await authService.me();
          setUser(me);
        } catch (error) {
          console.error("Initial auth check error:", error);
          setAccessToken(null);
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      }
    })();
  }, []);
	
  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      signIn: handlerSignIn, 
      signUp: handleSignUp, 
      logout: handleLogout,
      updateToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};