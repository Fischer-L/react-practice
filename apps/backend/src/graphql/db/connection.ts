const { MongoClient } = require('mongodb');
const DB_URL = 'mongodb://admin:adminpw@localhost:27017/'

let mongoDB = null;
let mongoClient = null;
let connectPromise = null;

export async function closeMongoDB() {
  if (mongoClient) {
    const client = mongoClient;
    mongoDB = mongoClient = connectPromise = null;
    await client.close();
  }
}

export function isMongoConnected() {
  if (mongoClient) {
    if (mongoClient.isConnected()) {
      return true;
    }
    closeMongoDB().catch(e => console.error(e));
  }
  return false;
}

export async function connectMongoDB() {
  if (connectPromise) {
    await connectPromise;
  }
  if (mongoDB && isMongoConnected()) {
    return mongoDB;
  }

  try {
    connectPromise = MongoClient.connect(DB_URL, {
      useUnifiedTopology: true,
    });
    mongoClient = await connectPromise;
    mongoDB = mongoClient.db();
    console.log('Connection established to', DB_URL);
  } catch (e) {
    console.error(e);
  } finally {
    connectPromise = null;
  }
  return mongoDB;
}
