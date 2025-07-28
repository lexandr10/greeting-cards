import React from "react";
import EditCardForm from "@/components/EditCardForm";

interface EditCardPageProps {
  params: { id: string };
}

export default function EditCardPage({ params }: EditCardPageProps) {
  const cardId = Number(params.id);
  return <EditCardForm cardId={cardId} />;
}
