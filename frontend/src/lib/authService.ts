import { gql } from "@apollo/client";
import { apolloClient } from "./apolloClient";
import { SignUpResponse, AccessTokenResponse, UserType } from "@/types/auth";


const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignupInput!) {
    signUp(input: $input) {
      accessToken
      user {
        id
        email
        fullName
        role
      }
    }
  }
`;

const SIGNIN_MUTATION = gql`
  mutation SignIn($input: SigninInput!) {
    signIn(input: $input) {
      accessToken
    }
  }
`;

const REFRESH_MUTATION = gql`
  mutation {
    refresh {
      accessToken
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      fullName
      role
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

export async function signUp(input: { email: string, password: string, fullName?: string, dateOfBirth?: string }): Promise<SignUpResponse> {
	const { data } = await apolloClient.mutate<{ signUp: SignUpResponse }>({
		mutation: SIGNUP_MUTATION,
		variables: {input}
	})
	return data!.signUp
}

export async function me(): Promise<UserType> {
  const { data } = await apolloClient.query<{ me: UserType }>({
    query: ME_QUERY,
    fetchPolicy: "network-only",
  });
  return data.me;
}

export async function signIn(input:{email: string, password: string}): Promise<string> {
	const { data } = await apolloClient.mutate < {signIn: AccessTokenResponse}> ({
		mutation: SIGNIN_MUTATION,
		variables: {input}
	})
	return data!.signIn.accessToken
}

export async function refreshToken(): Promise<string> {
	const { data } = await apolloClient.mutate<{ refresh: AccessTokenResponse }>({
		mutation: REFRESH_MUTATION
	})

	return data!.refresh.accessToken
	
}

export async function logout(): Promise<boolean> {
	const { data } = await apolloClient.mutate<{ logout: boolean }>({
		mutation: LOGOUT_MUTATION
	})

	return data!.logout
	
}

