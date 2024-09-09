import { MenuItem } from '@react-practice/types';
import config from '@react-practice/backend/config'
import { connectMongoDB } from '@react-practice/backend/db/connection';

const { MONGO_DB_COLLECTION } = config;

export default async function populateTestData (): Promise<boolean> {
  try {
    const db = await connectMongoDB();

    const tables = db.collection(MONGO_DB_COLLECTION.tables);
    for (let i = 1; i <= 5; i++) {
      const tableId = `table_${i}`;
      tables.updateOne(
        { "_id": tableId },
        { $setOnInsert: { "_id": tableId } },
        { upsert: true }
      );
    }

    const menuItems = db.collection(MONGO_DB_COLLECTION.menuItems);
    MENU_ITEMS.forEach(item => {
      const { id, name, price } = item;
      menuItems.updateOne(
        { "_id": id },
        { $setOnInsert: { "_id": id, name, price } },
        { upsert: true }
      );
    });

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'menu_item_1',
    name: 'Neapolitan Pizza',
    price: 100,
  },
  {
    id: 'menu_item_2',
    name: 'California Pizza',
    price: 200,
  },
  {
    id: 'menu_item_3',
    name: 'Chicago Pizza',
    price: 300,
  },
  {
    id: 'menu_item_4',
    name: 'Angel Hair Pasta',
    price: 400,
  },
  {
    id: 'menu_item_5',
    name: 'Bow Tie Pasta',
    price: 500,
  },
  {
    id: 'menu_item_6',
    name: 'Bucatini Pasta',
    price: 600,
  },
  {
    id: 'menu_item_7',
    name: 'Ditalini Pasta',
    price: 700,
  },
  {
    id: 'menu_item_8',
    name: 'Mushroom Burger',
    price: 800,
  },
  {
    id: 'menu_item_9',
    name: 'Elk Burger',
    price: 900,
  },
  {
    id: 'menu_item_10',
    name: 'Salmon Burger',
    price: 1000,
  },
];