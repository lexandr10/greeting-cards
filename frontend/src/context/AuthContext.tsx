import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
	useCallback,
} from "react";

import * as authService from "../lib/authService";
import { UserType, SignUpInput, SignUpResponse} from "@/types/auth";

interface AuthContextType {
  user: UserType | null;
  accessToken: string | null;
  signUp: (
    data: SignUpInput
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleSignUp = async (
    data: SignUpInput
  ) => {
    const resp: SignUpResponse = await authService.signUp(data);
		setAccessToken(resp.accessToken);
		localStorage.setItem("accessToken", resp.accessToken);
		setUser(resp.user);
	};
	
	const handlerSignIn = async (email: string, password: string) => {
		const token = await authService.signIn({ email, password })
		setAccessToken(token)
		localStorage.setItem("accessToken", token);
		const me = await authService.me()
		setUser(me)
	}

	const handleLogout = async () => {
		await authService.logout()
		setAccessToken(null)
		localStorage.removeItem("accessToken");
		setUser(null)
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
        } catch {
          setAccessToken(null);
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      }
    })();
  }, []);
	
	return (<AuthContext.Provider value={{ user, accessToken, signIn: handlerSignIn, signUp: handleSignUp, logout: handleLogout }}>
		{children}
	</AuthContext.Provider>)
};


export const useAuth = (): AuthContextType => {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx
}