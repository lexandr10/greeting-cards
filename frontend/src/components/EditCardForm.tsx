"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cardsService, CardType } from "@/lib/cardsService";
import { Input } from "@/components/InputAuth";
import { Button } from "@/components/Button";
import { Category, Language } from "@/types/enums";

interface EditCardFormProps {
  cardId: number;
}

export default function EditCardForm({ cardId }: EditCardFormProps) {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<Category>(Category.BIRTHDAY);
  const [language, setLanguage] = useState<Language>(Language.EN);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const card: CardType = await cardsService.fetchCardById(cardId);
        setDescription(card.description);
        setImageUrl(card.imageUrl);
        setCategory(card.category as Category);
        setLanguage(card.language as Language);
      } catch (err: any) {
        setError(err.message || "Failed to load card");
      } finally {
        setLoading(false);
      }
    })();
  }, [cardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await cardsService.update(cardId, {
        description,
        imageUrl,
        category,
        language,
      });
      router.push("/my-cards"); 
    } catch (err: any) {
      setError(err.message || "Failed to update card");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center p-4">Loading…</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 space-y-4 bg-white shadow rounded"
    >
      {error && <p className="text-red-600">{error}</p>}
      <Input
        id="description"
        name="description"
        label="Description"
        placeholder="Enter card description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        id="imageUrl"
        name="imageUrl"
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />
      <div>
        <label htmlFor="category" className="block font-medium mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="mt-1 block w-full p-2 border rounded"
        >
          {Object.values(Category).map((c) => (
            <option key={c} value={c}>
              {c.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="language" className="block font-medium mb-1">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="mt-1 block w-full p-2 border rounded"
        >
          {Object.values(Language).map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Updating…" : "Update Card"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={() => router.back()}
      >
        Cancel
      </Button>
    </form>
  );
}
