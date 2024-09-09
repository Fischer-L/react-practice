import { Table, OrderStatus } from '@react-practice/types';
import { connectMongoDB } from '@react-practice/backend/db/connection';
import config from '@react-practice/backend/config'

const tablesCollectionName = config.MONGO_DB_COLLECTION.tables;
const orderCollectionName = config.MONGO_DB_COLLECTION.orders;

export async function listTable(): Promise<Table[]> {
  try {
    const db = await connectMongoDB();

    let results = await db.collection(tablesCollectionName).aggregate([
      {
        $lookup: {
          from: orderCollectionName,
          localField: '_id',
          foreignField: 'tableId',
          as: 'orderData',
          pipeline: [
            {
              $match: {
                orderStatus: OrderStatus.ORDERED,
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
    ])
    .toArray();

    console.log('Databases:', results);

    return results.map(doc => {
      const table = { id: doc['_id'] };
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