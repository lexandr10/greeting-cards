import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { accessToken } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if(!accessToken) router.push('/login')
	}, [accessToken, router])
	
	if (!accessToken) return null
	return <>{ children}</>
}