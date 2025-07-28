import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken === null) {
      router.push('/login');
    } else if (accessToken) {
      setIsLoading(false);
    }
  }, [accessToken, router]);
  
  if (isLoading || !accessToken) {
    return null;
  }
  
  return <>{children}</>;
};