import { Order } from "@react-practice/types";
import { client } from "./connection";
import { rejects } from "assert";

const collectionName = "order";

async function createOrder(order: Order): Promise<Order | Error> {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        let result = client.db("order").collection(collectionName).insertOne(order);
 
        console.log("Databases createorder :", result);
        order.id = result.insertedId
        return order
    } catch (e) {
        console.error(e);
        return e
    } finally {
        await client.close();
    }
}
/*
async function updateOrder(order: Order): Promise<Order | Error> {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        order.time = new Date().getMilliseconds()
        order.status = 
 
        // Make the appropriate DB calls
        let result = client.db("order").collection(collectionName).findOneAndReplace({"_id": order.id}, order);
 
        console.log("Databases updateOrder :", result);
        return order
    } catch (e) {
        console.error(e);
        return e
    } finally {
        await client.close();
    }
}
    */