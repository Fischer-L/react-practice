interface MenuItem {
  id: string,
  name: string,
  price: number,
}

interface Table {
  id: string,
  orderId?: string,
  orderStatus: TableStatus,
}

enum TableStatus {
  AVALABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

interface Order {
  id: string,
  tableId: string,
  time: number,
  dishes: MenuItem[],
  status: OrderStatus,
}

enum OrderStatus {
  ORDERED = 'ORDERED',
  PAYED = 'PAYED',
}

export {
  MenuItem,
  Table,
  TableStatus,
  Order,
  OrderStatus,
};
