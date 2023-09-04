import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_ENDOPOINT + "graphql",
  cache: new InMemoryCache(),
});

export const apolloServer = new ApolloClient({
  uri: process.env.API_ENDOPOINT + "graphql",
  cache: new InMemoryCache(),
});
