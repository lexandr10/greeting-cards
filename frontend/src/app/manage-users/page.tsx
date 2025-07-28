"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usersService, UserType } from "@/lib/usersService";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";

export default function ManageUsersPage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || user?.role !== "ADMIN") {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const list = await usersService.fetchAll();
        setUsers(list);
      } catch (e: any) {
        setError(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, user, router]);

  const toggleRole = async (id: number, newRole: "VISITOR" | "PUBLISHER") => {
    try {
      await usersService.updateRole(id, newRole);
      setUsers((u) =>
        u.map((x) => (x.id === id ? { ...x, role: newRole } : x))
      );
    } catch (e: any) {
      alert(e.message || "Unable to update role");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-500">
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Full Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.fullName || "-"}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    toggleRole(
                      u.id,
                      u.role === "VISITOR" ? "PUBLISHER" : "VISITOR"
                    )
                  }
                >
                  {u.role === "VISITOR" ? "Make Publisher" : "Make Visitor"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
