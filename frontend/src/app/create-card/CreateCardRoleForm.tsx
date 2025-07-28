'use client'

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CreateCardForm } from "@/components/CreateCardForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";


export default function CreateCardRoleForm() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;
  if (user.role !== "PUBLISHER" && user.role !== "ADMIN") {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6 text-center">
          <p className="text-red-500">
            You do not have permission to access this page.
          </p>
        </div>
      </ProtectedRoute>
    );
  }
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Create a new Card</h1>
        <CreateCardForm
          onSuccess={() => {
            router.push("/my-cards");
          }}
        />
      </div>
    </ProtectedRoute>
  );
}