/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import createApolloServer from '@react-practice/backend/graphql';
import populateTestData from '@react-practice/backend/db/populateTestData';

const startServer = async () => {
  console.log('Populating test data...');
  if (populateTestData()) {
    console.log('Done: Populate test data');
  } else {
    console.error('Fail: Populate test data. Please check if have the DB up and run.');
  }

  const app = express();

  app.use(compression())
     .use(cookieParser())
     .use(express.json())
     .use(express.urlencoded({ extended: false }));

  const port = process.env.PORT || 4000;
  const httpServer = await createApolloServer(app);
  httpServer.listen({ port }, () => {
    console.log(`Start at http://localhost:${port}/api/graphql`);
  });
};

startServer();
