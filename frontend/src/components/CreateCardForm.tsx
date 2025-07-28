"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cardsService } from "@/lib/cardsService";
import { Input } from "@/components/InputAuth";
import { Button } from "@/components/Button";
import { Category, Language } from "@/types/enums";

const categories: Category[] = Object.values(Category) as Category[];
const languages: Language[] = Object.values(Language) as Language[];

export interface CreateCardFormProps {
  onSuccess?: () => void;
}

export const  CreateCardForm: React.FC<CreateCardFormProps> = () =>{
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<Category>(Category.BIRTHDAY);
  const [language, setLanguage] = useState<Language>(Language.EN);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
			await cardsService.create({ description, imageUrl, category, language });
			router.push("/my-cards");
			
    } catch (err: any) {
      setError(err.message || "Failed to create card");
    } finally {
      setSubmitting(false);
    }
  };

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
        {submitting ? "Creating…" : "Create Card"}
      </Button>
    </form>
  );
}
