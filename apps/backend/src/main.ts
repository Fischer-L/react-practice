/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import createApolloServer from './graphql';
import graphConfig from './graphql/config';

const startServer = async () => {
  const app = express();

  app.use(compression())
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded({ extended: false }));

  const httpServer = await createApolloServer(app, graphConfig);

  app.get('/hello', (req, res, next) => {
    res.send('hellos');
  })

  const port = process.env.PORT || 4000;
  httpServer.listen({ port }, () => {
    console.log(`Say hello at http://localhost:${port}/hello`);
  })
};

startServer();
