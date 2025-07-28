"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cardsService, CardType } from "@/lib/cardsService";
import { Card as CardComponent } from "@/components/Card";
import { Button } from "@/components/Button";

export default function ApprovePage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pending = await cardsService.fetchPending();
      setCards(pending);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending cards");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!accessToken) return router.replace("/login");
    if (user?.role !== "ADMIN" && user?.role !== "PUBLISHER")
      return router.replace("/");
    loadPending();
  }, [accessToken, user, router, loadPending]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Content to Approve</h1>

      {cards.length === 0 ? (
        <p>No cards awaiting approval.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id}>
              <CardComponent onChange={loadPending} card={card} />
              {user?.role === "ADMIN" && (
                <Button
                  variant="primary"
                  className="mt-2 w-full"
                  onClick={async () => {
                    await cardsService.approve(card.id);
                    loadPending();
                  }}
                >
                  Approve
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
