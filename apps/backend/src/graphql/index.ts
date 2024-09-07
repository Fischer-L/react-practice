import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Express, json, Request } from 'express';
import http from 'http';
import { Server } from 'http';
import { readFileSync } from 'fs';
import cors from 'cors';

import resolvers from './resolvers';
import { GraphConfig } from './config';

const SCHEMA_PATH = './schema/schema.graphql';

const createApolloServer = async (app: Express, graphConfig: GraphConfig): Promise<Server> => {
  const { enablePlayground } = graphConfig;

  const httpServer = http.createServer(app);

  const typeDefs = readFileSync(SCHEMA_PATH, { encoding: 'utf8' });
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }),
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


  await apolloServer.start();

  app.use(
    '/api/graphql',
    cors<cors.CorsRequest>({
      origin: [ /localhost(:\d+)?$/i ],
      credentials: true,
    }),
    expressMiddleware(apolloServer),
  );

  return httpServer;
};

export default createApolloServer;
