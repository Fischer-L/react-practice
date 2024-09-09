import { MenuItem } from '@react-practice/types';
import { client } from './connection';

const collectionName = 'menuItem';

export async function listMenuItems(): Promise<MenuItem[]> {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    let cursor = client.db('order').collection(collectionName).find({});
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
  } finally {
    await client.close();
  }
  return [];
}