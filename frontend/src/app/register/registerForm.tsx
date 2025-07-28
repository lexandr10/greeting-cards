"use client";


import {  useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/InputAuth";
import { Button } from "@/components/Button";

export default function RegisterForm() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
	
	const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [dateOfBirthError, setDateOfBirthError] = useState<string | null>(null);
	const [generalError, setGeneralError] = useState<string | null>(null);
	


   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();

     setEmailError(null);
     setPasswordError(null);
     setFullNameError(null);
     setDateOfBirthError(null);
     setGeneralError(null);


     try {
       await signUp({ email, password, fullName, dateOfBirth });
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
           } else if (lower.includes("fullname")) {
             setFullNameError(msg);
           } else if (lower.includes("dateofbirth")) {
             setDateOfBirthError(msg);
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
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
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
          label="Пароль"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && (
          <p className="text-red-600 text-sm mt-1">{passwordError}</p>
        )}
        <Input
          id="fullName"
          name="fullName"
          label="Fullname (optional)"
          type="text"
          placeholder="Your Fullname"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        {fullNameError && (
          <p className="text-red-600 text-sm mt-1">{fullNameError}</p>
        )}
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          label="Date of birth (optional)"
          type="date"
          placeholder=""
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        {dateOfBirthError && (
          <p className="text-red-600 text-sm mt-1">{dateOfBirthError}</p>
        )}
        <Button type="submit" variant="primary" className="w-full">
          Register
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
