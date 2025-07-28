"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/InputAuth";
import { Button } from "@/components/Button";

export default function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");


	 const [emailError, setEmailError] = useState<string | null>(null);
   const [passwordError, setPasswordError] = useState<string | null>(null);
   const [generalError, setGeneralError] = useState<string | null>(null);
 
  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setEmailError(null);
    setPasswordError(null);
		setGeneralError(null);
		
		
    try {
      await signIn( email, password );
      router.push("/");
    } catch (err: any) {
      const gqlErrs = err.graphQLErrors?.[0]?.extensions?.response?.message;
      if (Array.isArray(gqlErrs)) {
        gqlErrs.forEach((msg: string) => {
          const lower = msg.toLowerCase();
          if (lower.includes("email")) {
            setEmailError(msg);
          } else if (lower.includes("password")) {
            setPasswordError(msg);
          } else {
            setGeneralError((prev) => (prev ? prev + "; " + msg : msg));
          }
        });
      } else {
        const message = err.message ?? "Unknown error";
        setGeneralError(message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {generalError && <p className="text-red-600 mb-2">{generalError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && (
          <p className="text-red-600 text-sm mt-1">{emailError}</p>
        )}
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && (
          <p className="text-red-600 text-sm mt-1">{passwordError}</p>
        )}
        <Button type="submit" variant="primary" className="w-full">
          Login
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
