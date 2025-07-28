"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cardsService, CardType } from "@/lib/cardsService";
import { Card } from "./Card";
import { Button } from "./Button";
import { useAuth } from "@/context/AuthContext";

export const CardList: React.FC = () => {
	const { user } = useAuth();
	
  const router = useRouter();
  const [cards, setCards] = useState<CardType[]>([]);
  const [onlyMine, setOnlyMine] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const arr = await cardsService.fetchCards(onlyMine);
    setCards(arr);
    setLoading(false);
  }, [onlyMine]);

  useEffect(() => {
    load();
  }, [load]);

  const canCreate = user?.role === "ADMIN" || user?.role === "PUBLISHER";

  return (
    <div>
      <div className="flex justify-between mb-4">
        {canCreate && (
          <Button
            onClick={() => router.push('/create-card')}
          >
            Create Card
          </Button>
        )}
        {canCreate && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => setOnlyMine(e.target.checked)}
            />
            <span>My Cards</span>
          </label>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : cards.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <Card key={c.id} card={c} onChange={load} />
          ))}
        </div>
      ) : (
        <p>No cards to display.</p>
      )}
    </div>
  );
};