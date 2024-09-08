import { Order, OrderStatus, OrderItem } from "@react-practice/types";
import { client } from "./connection";
import { rejects } from "assert";
import { ObjectId } from 'mongodb';

const collectionName = "order";

export async function createOrder(order: Order): Promise<Order> {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        order.time = Date.now()
        order.status = OrderStatus.ORDERED

        let result = await client.db('order').collection(collectionName).insertOne(order);
 
        order['id'] = result.insertedId.toString()
        console.log("output createorder :", order);
        return order
    } catch (e) {
        console.error(e);
        return e
    } finally {
        await client.close();
    }
}

export async function updateOrder(orderId: string, orderItem: OrderItem): Promise<Order> {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        console.log("Databases update :", orderId, orderItem);
        // Make the appropriate DB calls
        let result = await client.db('order').collection(collectionName)
          .findOneAndUpdate({'_id':new ObjectId(orderId)}, {'$set': {'orderItem': orderItem, 'time': Date.now()}}, {returnDocument: 'after'});
 
        console.log("Databases updateOrder :", result);
        return  {
          id: result['_id'].toString(),
          tableId: result['tableId'].toString(),
          orderItem: result['orderItem'],
          status: result['status'].toString(),
        }
    } catch (e) {
        console.error(e);
        return e
    } finally {
        await client.close();
    }
}