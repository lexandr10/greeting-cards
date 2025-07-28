import React, { useState } from "react";
import Image from "next/image";
import { FiHeart, FiTrash2, FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { CardType, cardsService } from "@/lib/cardsService";
import { useAuth } from "@/context/AuthContext";


interface CardProps {
  card: CardType;
  onChange?: () => void;
}

export const Card: React.FC<CardProps> = ({ card, onChange }) => {
	const { user } = useAuth();
	const router = useRouter();
	const [busy, setBusy] = useState(false);

  const canEditOrDelete = user?.role === "ADMIN" || user?.id === card.author.id;
	const canCreateOrLike = user?.role === "ADMIN" || user?.role === "PUBLISHER";
	const [imgError, setImgError] = useState(false);

	 const isAuthor = user?.id === card.author.id;
   const isPublisher = user?.role === "PUBLISHER";
	const isAdmin = user?.role === "ADMIN";
	
	 const handlePublish = async () => {
     setBusy(true);
     try {
       await cardsService.update(card.id, {
         status: isAdmin ? "APPROVED" : "AWAITING_APPROVAL",
       });
       onChange?.();
     } finally {
       setBusy(false);
     }
	 };
	
	  const handleApprove = async () => {
      setBusy(true);
      try {
        await cardsService.approve(card.id);
        onChange?.();
      } catch (error) {
        console.error('Approve error:', error);
        alert('Failed to approve card');
      } finally {
        setBusy(false);
      }
		};
	
	
  const handleUnpublish = async () => {
    setBusy(true);
    try {
      await cardsService.update(card.id, { status: "AWAITING_APPROVAL" });
      onChange?.();
    } finally {
      setBusy(false);
    }
  };


  const handleLike = async () => {
    try {
      if (card.likedByMe) {
        await cardsService.unlike(card.id);
      } else {
        await cardsService.like(card.id);
      }
      onChange?.();
    } catch (err) {
      console.error(err);
      alert("Failed to update like status");
    }
  };

	const handleEdit = () => {
    router.push(`/edit-card/${card.id}`);
	};
	
	const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this card? This action cannot be undone."
      )
    ) {
      const ok = await cardsService.delete(card.id);
      if (ok) onChange?.();
      else alert("Failed to delete card");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="relative w-full h-48">
        <Image
          unoptimized
          src={imgError ? "/placeholder.jpg":card.imageUrl}
          alt={card.description}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="p-4">
        <span className="text-xs text-gray-500">
          {new Date(Number(card.createdAt)).toLocaleDateString()}
        </span>

        <p className="text-gray-800 font-medium mb-2">{card.description}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={handleLike}
            disabled={!canCreateOrLike}
            className={`flex items-center space-x-1 ${
              card.likedByMe ? "text-red-500" : "text-gray-400"
            }`}
          >
            <FiHeart />
            <span>{card.likesCount}</span>
          </button>
        </div>
        <div className="mt-3 flex space-x-2">
          {canCreateOrLike && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {card.category}
            </span>
          )}
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
            {card.language}
          </span>
          <span
            className={`
    px-2 py-1 rounded text-xs font-medium
    ${card.status === "DRAFT" ? "bg-gray-200 text-gray-800" : ""}
    ${
      card.status === "AWAITING_APPROVAL" ? "bg-yellow-100 text-yellow-800" : ""
    }
    ${card.status === "APPROVED" ? "bg-green-100 text-green-800" : ""}
  `}
          >
            {card.status.replace("_", " ")}
          </span>
        </div>
        <div className="mt-3 flex space-x-2">
          {card.status === "DRAFT" && (isPublisher || isAdmin) && (
            <button
              onClick={handlePublish}
              disabled={busy}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              {isAdmin ? "Publish as Approved" : "Publish"}
            </button>
          )}
          {card.status === "AWAITING_APPROVAL" && isAdmin && (
            <button
              onClick={handleApprove}
              disabled={busy}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Approve
            </button>
          )}
          {card.status === "APPROVED" && isAdmin && (
            <button
              onClick={handleUnpublish}
              disabled={busy}
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
            >
              Unpublish
            </button>
          )}
        </div>
        {canEditOrDelete && (
          <div className="mt-3 flex space-x-4">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800"
            >
              <FiEdit />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
