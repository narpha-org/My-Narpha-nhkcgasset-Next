import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  DefaultOptions,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  },
  mutate: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const linkClient = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_ENDOPOINT + "graphql",
  // you can disable result caching here if you want to
  // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
  fetchOptions: { cache: "no-store" },
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, linkClient]),
  defaultOptions: defaultOptions,
});
