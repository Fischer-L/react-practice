import getConfig from 'next/config';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { onError } from '@apollo/client/link/error';
import { sha256 } from 'crypto-hash';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
// import typeDefs from './schema/schema.graphql';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<unknown>;

function createApolloClient (): ApolloClient<unknown> {
  // Log any GraphQL errors or network error that occurred
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  })

  const { publicRuntimeConfig } = getConfig();
  const { GRAPH_API_URI, ENABLE_APOLLO_DEBUG_TOOLS } = publicRuntimeConfig;

  const apolloLink = ApolloLink.from([
    createPersistedQueryLink({ sha256 }),
    errorLink,
    new HttpLink({ uri: GRAPH_API_URI, credentials: 'include' }),
  ]);

  return new ApolloClient({
    link: apolloLink,
    cache: new InMemoryCache(),
    // typeDefs,
    ssrMode: typeof window === 'undefined',
    ssrForceFetchDelay: 100,
    connectToDevTools: ENABLE_APOLLO_DEBUG_TOOLS,
  });
}

export function initializeApollo (initialState = null): ApolloClient<unknown> {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract() as Partial<unknown>;

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        )
      ]
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }
  return _apolloClient;
}

// export function addApolloState (client, pageProps) {
//   if (pageProps?.props) {
//     pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
//   }

//   return pageProps
// }
