import { Table, TableStatus } from '@react-practice/types';
import { connectMongoDB } from './connection';

const collectionName = 'table';

export async function listTable(): Promise<Table[]> {
  try {
    const db = await connectMongoDB();

    let results = await db('order').collection(collectionName).aggregate([
      {
        $lookup: {
          from: 'order',
          localField: '_id',
          foreignField: 'tableId',
          as: 'orderData',
          pipeline: [
            {
              $match: {
                orderStatus: 'ORDERED',
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$orderData',
          preserveNullAndEmptyArrays: true,
        }
      }
    ]).toArray();

    console.log('Databases:', results);
    return results.map(doc => {
      let table = { id: doc['_id'] };
      if (doc['orderData']) {
        table['orderId'] = doc['orderData']['_id'].toString();
        table['orderStatus'] = doc['orderData']['orderStatus'] || undefined;
      }
      return table;
    });

  } catch (e) {
    console.error(e);
  }
  return [];
}