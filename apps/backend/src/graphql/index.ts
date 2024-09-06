import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Express, json, Request } from 'express';
import { Server } from 'http';
import { readFileSync } from 'fs';

import resolvers from '@/graphql/resolvers';
import { GraphConfig } from '@/graphql/config';

const SCHEMA_PATH = './schema/schema.graphql';

const createApolloServer = (httpServer: Server, graphConfig: GraphConfig) => {
  const { enablePlayground } = graphConfig;

  const typeDefs = readFileSync(SCHEMA_PATH, { encoding: 'utf8' });
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  return new ApolloServer({
    schema,
    introspection: enablePlayground,
    plugins: [
      enablePlayground
        ? ApolloServerPluginLandingPageLocalDefault({ includeCookies: true })
        : ApolloServerPluginLandingPageDisabled(),
      ApolloServerPluginCacheControl(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    persistedQueries: {
      cache: new InMemoryLRUCache({
        maxSize: 1000000,
      }),
      ttl: 60 * 60 * 24 * 30,
    },
    documentStore: new InMemoryLRUCache({
      maxSize: 1000000
    }),
  });
};

export default createApolloServer;
