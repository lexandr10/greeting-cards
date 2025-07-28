import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, fromPromise } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import * as authService from "./authService";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_PUBLIC_GRAPHQL_URL,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors?.some((e) => e.extensions?.code === "UNAUTHENTICATED")) {
    return fromPromise(
      authService
        .refreshToken()
        .then((newToken) => {
          localStorage.setItem("accessToken", newToken);
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${newToken}`,
            },
          }));
        })
        .catch((err) => {
          authService.logout();
          throw err;
        })
    ).flatMap(() => forward(operation));
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});


