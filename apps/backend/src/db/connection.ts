const { MongoClient } = require('mongodb');
import config from '@react-practice/backend/config'
const { MONGO_DB_URL, MONGO_DB_NAME } = config;

let mongoDB = null;
let mongoClient = null;
let connectPromise = null;

export async function closeMongoDB() {
  if (mongoClient) {
    try {
      const client = mongoClient;
      mongoDB = mongoClient = connectPromise = null;
      await client.close();
    } catch (e) {
      console.log(e);
    }
  }
}

export async function connectMongoDB() {
  if (connectPromise) {
    await connectPromise;
  }

  if (mongoDB) {
    return mongoDB;
  }

  try {
    connectPromise = MongoClient.connect(MONGO_DB_URL);
    mongoClient = await connectPromise;
    mongoDB = mongoClient.db(MONGO_DB_NAME);
    console.log('Connection established to', MONGO_DB_URL);
  } catch (e) {
    console.error(e);
  } finally {
    connectPromise = null;
  }
  return mongoDB;
}
