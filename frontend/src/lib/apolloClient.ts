import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, fromPromise } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

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

let updateTokenFunction: ((token: string) => void) | null = null;

export const setTokenUpdateFunction = (fn: (token: string) => void) => {
  updateTokenFunction = fn;
};

const refreshTokenRequest = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_PUBLIC_GRAPHQL_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      query: 'mutation { refresh { accessToken } }'
    })
  });

  if (!response.ok) {
    throw new Error('Refresh failed');
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error('Refresh failed');
  }

  return result.data.refresh.accessToken;
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (operation.operationName === "refresh") {
    return;
  }

  if (graphQLErrors?.some((e) => e.extensions?.code === "UNAUTHENTICATED")) {
    return fromPromise(
      refreshTokenRequest()
        .then((newToken) => {
          localStorage.setItem("accessToken", newToken);
          if (updateTokenFunction) {
            updateTokenFunction(newToken);
          }
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${newToken}`,
            },
          }));
        })
        .catch((err) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }
          throw err;
        })
    ).flatMap(() => forward(operation));
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});


