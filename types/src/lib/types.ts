interface MenuItem {
  id: string,
  name: string,
  price: number,
}

interface Table {
  id: string,
  orderId?: string,
  orderStatus?: OrderStatus,
}

enum TableStatus {
  AVALABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

interface Order {
  id?: string,
  tableId: string,
  time?: number,
  orderItems: OrderItem[],
  status?: OrderStatus,
}

enum OrderStatus {
  ORDERED = 'ORDERED',
  PAYED = 'PAYED',
}

interface OrderItem {
  menuId: string,
  count: number,
}

enum ApiErrorMessage {
  ORDER_UNDER_EDTING = 'ORDER_UNDER_EDTING'
}

export {
  MenuItem,
  Table,
  TableStatus,
  Order,
  OrderStatus,
  OrderItem,
  ApiErrorMessage,
};
