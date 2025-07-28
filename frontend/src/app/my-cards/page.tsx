"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card as CardComponent } from "@/components/Card";
import { cardsService, CardType } from "@/lib/cardsService";

export default function MyCardsPage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cardsService.fetchCards(true);
      setCards(data);
    } catch (err: any) {
      setError(err.message || "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "ADMIN" && user?.role !== "PUBLISHER") {
      router.replace("/");
      return;
    }
    loadCards();
  }, [accessToken, user, router, loadCards]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Cards</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!error && cards.length === 0 && (
        <p>You haven’t created any cards yet.</p>
      )}

      {!error && cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <CardComponent key={card.id} card={card} onChange={loadCards} />
          ))}
        </div>
      )}
    </div>
  );
}
