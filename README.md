## Run 
- Recommanded Node version: v18.20.3

- Install dependencies: `$ yarn install`

- Start DB and Redis: `$ docker-compose up`

- Start the backend server: `$ npx nx run backend:serve`
  - The graphql playgroud is available at `http://localhost:4000/api/graphql`

- Start the web client: `$npx nx run web:dev`
  - Open `http://localhost:3000`

## Project Structure

### Monorepo
- This project utilize the [NX](https://nx.dev/) framework to manage monorepo for the backend and the frontend codebase

### Schema
- Please refer to the `schema/schema.graphql` for the graphql schema
- Please refer to the `types` folder for the data types used both on the backend and frontend

### Backend
- The backend server codebase is in the `apps/backend`
  - `main.tsx` is the entry point

- The tech stacks used:
  - Use [Express.js](https://expressjs.com/) for the http server
  - Use [Apollo Graphql server](https://github.com/apollographql/apollo-server) for the graphql server
  - Use [MongoDB](https://www.mongodb.com/) for storing data
  - Use [Redis](https://redis.io/docs/latest/) and [Redlock](https://www.npmjs.com/package/redlock) for the distributed lock.

- Multiple/Concurrent data handling
  - Prevent the concuurent data updates with the redis distributed lock
  - Implement the `version` mechanism in orders(table bills) to prevent the data corruption from multiple data updates

### Frontend
- The backend server codebase is in the `apps/web`
  
- The tech stacks used:
  - Use [Next.js](https://nextjs.org/) for the React setup and routing
  - Use [Apollo Graphql client](https://www.npmjs.com/package/@apollo/client) for the graphql client
  - Use [Tailwind](https://tailwindcss.com/) for styling

