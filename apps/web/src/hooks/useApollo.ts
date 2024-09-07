import { useMemo } from 'react';
import { ApolloClient } from '@apollo/client';
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '../graphql';

export default function useApollo (pageProps?): ApolloClient<unknown> {
  const state = pageProps?.[APOLLO_STATE_PROP_NAME]
  return useMemo(() => initializeApollo(state), [state])
}
