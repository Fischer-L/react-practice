import { Order, OrderStatus, OrderItem } from '@react-practice/types';
import { connectMongoDB } from './connection';
import { rejects } from 'assert';
import { ObjectId } from 'mongodb';

const collectionName = 'order';

export async function createOrder(order: Order): Promise<Order> {
  try {
    const db = await connectMongoDB();

    order.time = Date.now()
    order.status = OrderStatus.ORDERED

    let result = await db('order').collection(collectionName).insertOne(order);

    order['id'] = result.insertedId.toString()
    console.log('output createorder :', order);
    return order
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function updateOrder(orderId: string, orderItems: OrderItem): Promise<Order> {
  try {
    const db = await connectMongoDB();

    let result = await db('order').collection(collectionName)
      .findOneAndUpdate({'_id':new ObjectId(orderId)}, {'$set': {'orderItems': orderItems, 'time': Date.now()}}, {returnDocument: 'after'});


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