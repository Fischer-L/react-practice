const {MongoClient} = require('mongodb');
const DB_URL = 'mongodb://admin:adminpw@localhost:27017/'

export const client = new MongoClient(DB_URL);


/*
let mongoDB = null;
let mongoClient = null;
let connectPromise = null;


async function closeMongoDB() {
  if (mongoClient) {
    const client = mongoClient;
    mongoDB = mongoClient = connectPromise = null;
    await client.close();
  }
}

function isMongoConnected() {
  if (mongoClient) {
    if (mongoClient.isConnected()) {
      return true;
    }
    closeMongoDB().catch(e => console.error(e));
  }
  return false;
}

async function connectMongoDB() {
  if (connectPromise) await connectPromise;
  if (mongoDB && isMongoConnected()) return mongoDB;

  try {
    connectPromise = Mongo.connect(DB_URL, {
        useUnifiedTopology: true,
      });
    mongoClient = await connectPromise;
    mongoDB = mongoClient.db();
    console.log('Connection established to', DB_URL);
  } catch (e) {
    console.error(e);
  }
  connectPromise = null;
  return mongoDB;
}
*/
/*
type Table {
  id: String!,
}

enum OrderStatus {
  ORDERED,
  PAYED,
}

type Order {
  id: String!,
  timestamp: Long!,
  tableId: String!,
  status: OrderStatus!,
}

type OrderItem {
  id: String!,
  orderId: String!,
  menuId: Int!,
  count: Int!,
  total: Int!,
}


*/