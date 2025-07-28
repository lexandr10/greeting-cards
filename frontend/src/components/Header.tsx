"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold hover:text-blue-200">
          ChirpApp
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:underline">
            All Cards
          </Link>

          {user ? (
            <>
              {(user.role === "PUBLISHER" || user.role === "ADMIN") && (
                <>
                  <Link href="/my-cards" className="hover:underline">
                    My Cards
                  </Link>
                  <Link href="/create-card" className="hover:underline">
                    Create Card
                  </Link>
                </>
              )}

              {user.role === "ADMIN" && (
                <>
                  <Link href="/approve" className="hover:underline">
                    To Approve
                  </Link>
                  <Link href="/manage-users" className="hover:underline">
                    Manage Users
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
