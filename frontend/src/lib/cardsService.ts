import { gql } from "@apollo/client";
import { apolloClient } from "./apolloClient";
import { UserType } from "@/types/auth";

export interface CardType {
  id: number;
  description: string;
  imageUrl: string;
  status: "DRAFT" | "AWAITING_APPROVAL" | "APPROVED";
  category: string;
  language: string;
  author: UserType;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
}

const CARD_FIELDS = `
  id
  description
  imageUrl
  status
  category
  language
  createdAt
  author {
    id
    email
    fullName
    role
  }
  likesCount
  likedByMe
`;

const DELETE_CARD = gql`
  mutation DeleteCard($id: Int!) {
    deleteCard(id: $id)
  }
`;

const GET_CARDS = gql`
  query GetCards($onlyMine: Boolean!) {
    cards(onlyMine: $onlyMine) {
      ${CARD_FIELDS}
    }
  }
`;

const LIKE_CARD = gql`
  mutation LikeCard($cardId: Int!) {
    likeCard(cardId: $cardId)
  }
`;

const UNLIKE_CARD = gql`
  mutation UnlikeCard($cardId: Int!) {
    unlikeCard(cardId: $cardId)
  }
`;

const UPDATE_CARD = gql`
  mutation UpdateCard($id: Int!, $input: UpdateCardInput!) {
    updateCard(id: $id, input: $input) {
      ${CARD_FIELDS}
    }
  }
`;

const CREATE_CARD = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
      description
      imageUrl
      status
      category
      language
      createdAt
      author {
        id
        email
        fullName
        role
      }
      likesCount
      likedByMe
    }
  }
`;

const PENDING_CARDS = gql`
  query PendingCards {
    pendingCards {
      ${CARD_FIELDS}
    }
  }
`;

const APPROVE_CARD = gql`
  mutation ApproveCard($id: Int!) {
    approveCard(id: $id)
  }
`;

const GET_CARD = gql`
  query GetCard($id: Int!) {
    card(id: $id) {
      ${CARD_FIELDS}
    }
  }
`;

export const cardsService = {
  async fetchCards(onlyMine = false): Promise<CardType[]> {
    const { data } = await apolloClient.query<{ cards: CardType[] }>({
      query: GET_CARDS,
      variables: { onlyMine },
      fetchPolicy: "network-only",
    });
    return data.cards;
  },

  async fetchPending(): Promise<CardType[]> {
    const { data } = await apolloClient.query<{ pendingCards: CardType[] }>({
      query: PENDING_CARDS,
      fetchPolicy: "network-only",
    });
    return data.pendingCards;
  },

  async approve(cardId: number): Promise<boolean> {
    const { data } = await apolloClient.mutate<{ approveCard: boolean }>({
      mutation: APPROVE_CARD,
      variables: { id: cardId },
    });
    return data!.approveCard;
  },

  async fetchCardById(id: number): Promise<CardType> {
    const { data } = await apolloClient.query<{ card: CardType }>({
      query: GET_CARD,
      variables: { id },
      fetchPolicy: "network-only",
    });
    return data.card;
  },

  async update(
    id: number,
    input: {
      description?: string;
      imageUrl?: string;
      category?: string;
      language?: string;
      status?: "DRAFT" | "AWAITING_APPROVAL" | "APPROVED";
    }
  ): Promise<CardType> {
    const { data } = await apolloClient.mutate<{
      updateCard: CardType;
    }>({
      mutation: UPDATE_CARD,
      variables: { id, input },
    });
    return data!.updateCard;
  },
  async delete(cardId: number): Promise<boolean> {
    const { data } = await apolloClient.mutate<{ deleteCard: boolean }>({
      mutation: DELETE_CARD,
      variables: { id: cardId },
    });
    return data!.deleteCard;
  },

  async like(cardId: number): Promise<boolean> {
    const { data } = await apolloClient.mutate<{ likeCard: boolean }>({
      mutation: LIKE_CARD,
      variables: { cardId },
    });
    return data!.likeCard;
  },

  async unlike(cardId: number): Promise<boolean> {
    const { data } = await apolloClient.mutate<{ unlikeCard: boolean }>({
      mutation: UNLIKE_CARD,
      variables: { cardId },
    });
    return data!.unlikeCard;
  },

  async create(input: {
    description: string;
    imageUrl: string;
    category: string;
    language: string;
  }): Promise<CardType> {
    const { data } = await apolloClient.mutate<{
      createCard: CardType;
    }>({
      mutation: CREATE_CARD,
      variables: { input },
    });
    return data!.createCard;
  },
};
