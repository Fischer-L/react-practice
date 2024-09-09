import { MenuItem } from '@react-practice/types';
import { connectMongoDB } from './connection';

const collectionName = 'menuItem';

export async function listMenuItems(): Promise<MenuItem[]> {
  try {
    const db = await connectMongoDB();

    let cursor = db('order').collection(collectionName).find({});
    let results = await cursor.toArray();

    console.log('Databases:', results);
    return results.map(doc => {
      return {
        id: doc['_id'].toString(),
        name: doc['name'].toString(),
        price: doc['price']
      }
    })
  } catch (e) {
    console.error(e);
  }
  return [];
}