import { gql } from "@apollo/client";
import { apolloClient } from "./apolloClient";

export interface UserType {
  id: number;
  email: string;
  fullName?: string;
  role: "ADMIN" | "PUBLISHER" | "VISITOR";
  dateOfBirth?: string;
}

const FETCH_USERS = gql`
  query {
    users {
      id
      email
      fullName
      role
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation UpdateUserRole($userId: Int!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`;

export const usersService = {
  async fetchAll(): Promise<UserType[]> {
    const { data } = await apolloClient.query<{ users: UserType[] }>({
      query: FETCH_USERS,
      fetchPolicy: "network-only",
    });
    return data.users;
  },
  async updateRole(
    userId: number,
    role: "VISITOR" | "PUBLISHER"
  ): Promise<void> {
    await apolloClient.mutate({
      mutation: UPDATE_ROLE,
      variables: { userId, role },
    });
  },
};
