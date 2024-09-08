import { Table, TableStatus } from "@react-practice/types";
import { client } from "./connection";

const collectionName = "table";

async function startOrder(tableId: string): Promise<Table> {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // todo: add lock to table
        
        // Make the appropriate DB calls
        let result = client.db("order").collection(collectionName).findOneAndUpdate({_id: tableId}, {"$set": {status: TableStatus.UNAVAILABLE}}, {returnOriginal: true});
 
        console.log("Databases startTable order :", result);
        return result
    } catch (e) {
        console.error(e);
        return e
    } finally {
        await client.close();
    }
 }

export async function listTable(): Promise<Table[]> {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        let results = client.db("order").collection(collectionName).aggregate([
            {
                $lookup: {
                    from: 'order', 
                    localField: '_id', 
                    foreignField: 'tableId',
                    as: 'orderData',
                    pipeline: [
                        {
                            $match: {
                                orderStatus: 'ORDERED' 
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: '$orderData',  
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                  _id: 1,
                  orderId: '$orderData._id',
                  orderStatus: 'orderData.orderStatus'
                }
            }
        ]).toArray(); 
 
        console.log("Databases:", results);
        return results
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    return []
}