import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
const client = new ApolloClient({
  uri: 'https://test-subgraph.intodevs.com/subgraphs/name/incentive_star',
  cache: new InMemoryCache(),
});

export default function ApolloClientProvider({ children }:any){
  return <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
}