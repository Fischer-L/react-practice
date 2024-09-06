/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import http from 'http';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import createApolloServer from '@/graphql';
import graphConfig from '@/graphql/config';

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(compression())
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded({ extended: false }));

  const server = createApolloServer(httpServer, graphConfig);

  await server.start();

  app.use(
    '/api/graphql',
    cors<cors.CorsRequest>({
      origin: [ /localhost(:\d+)?$/i ],
      credentials: true,
    }),
  );

  app.get('/hello', (req, res, next) => {
    res.send('hello');
  })

  const port = process.env.PORT || 3000;
  httpServer.listen({ port }, () => {
    console.log(`Say hello at http://localhost:${port}/hello`);
  })
};

startServer();
