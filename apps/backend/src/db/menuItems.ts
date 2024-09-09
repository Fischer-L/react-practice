import { MenuItem } from '@react-practice/types';
import { connectMongoDB } from './connection';
import config from '@react-practice/backend/config'

const collectionName = config.MONGO_DB_COLLECTION.menuItems;

export async function listMenuItems(): Promise<MenuItem[]> {
  try {
    const db = await connectMongoDB();

    let cursor = db.collection(collectionName).find({});
    let results = await cursor.toArray();

    return results.map(doc => {
      return {
        id: doc['_id'].toString(),
        name: doc['name'].toString(),
        price: doc['price']
      }
    })
  } catch (e) {
    console.error(e);
    throw e;
  }
}