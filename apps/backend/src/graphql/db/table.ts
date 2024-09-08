import { Table, TableStatus } from "@react-practice/types";
import { client } from "./connection";

const collectionName = "table";

export async function listTable(): Promise<Table[]> {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        let results = await client.db("order").collection(collectionName).aggregate([
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
            }
        ]).toArray(); 
 
        console.log("Databases:", results);
        return results.map(doc => {
          let table = { id: doc['_id'] };
          if (doc['orderData']) {
            table['orderId'] = doc['orderData']['_id'].toString();
            table['orderStatus'] = doc['orderData']['orderStatus'] || undefined;
          }
          return table;
        })
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    return []
}