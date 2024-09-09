import { Order, OrderStatus, OrderItem } from '@react-practice/types';
import { connectMongoDB } from './connection';
import config from '@react-practice/backend/config'
import { ObjectId } from 'mongodb';

const collectionName = config.MONGO_DB_COLLECTION.orders;

export async function createOrder(tableId: string, orderItems: OrderItem[]): Promise<Order> {
  try {
    const db = await connectMongoDB();

    const exisingCount = await db.collection(collectionName).countDocuments({
      'tableId': tableId,
      'status': OrderStatus.ORDERED,
    });
    if (exisingCount > 0) {
      return null;
    }

    const order: Order = {
      tableId,
      orderItems,
      time: Date.now(),
      status: OrderStatus.ORDERED,
    };
    const result = await db.collection(collectionName).insertOne(order);
    order['id'] = result.insertedId.toString()
    return order
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateOrder(orderId: string, orderItems: OrderItem[]): Promise<Order> {
  try {
    const db = await connectMongoDB();

    const result = await db.collection(collectionName)
                           .findOneAndUpdate(
                              { '_id': new ObjectId(orderId) }, 
                              { '$set': {'orderItems': orderItems, 'time': Date.now() } }, 
                              { returnDocument: 'after' },
                            );

    return  {
      id: result['_id'].toString(),
      tableId: result['tableId'].toString(),
      orderItems: result['orderItems'],
      status: result['status'].toString(),
    }
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function checkOrder(orderId: string): Promise<boolean> {
  try {
    const db = await connectMongoDB();
    await db.collection(collectionName)
            .findOneAndUpdate(
              { '_id': new ObjectId(orderId) }, 
              { '$set': { 'status': OrderStatus.PAYED, 'time': Date.now() } }
            );
    return true
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getOrder(orderId: string): Promise<Order> {
  try {
    const db = await connectMongoDB();
    const result = await db.collection(collectionName).findOne({ '_id': new ObjectId(orderId) });
    return  {
      id: result['_id'].toString(),
      tableId: result['tableId'].toString(),
      orderItems: result['orderItems'],
      status: result['status'].toString(),
    }
  } catch (e) {
    console.error(e);
    return e;
  }
}
