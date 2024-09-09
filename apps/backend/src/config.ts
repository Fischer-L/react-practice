export default {
  MONGO_DB_URL: 'mongodb://admin:adminpw@localhost:27017/',
  MONGO_DB_NAME: 'pos_system',
  MONGO_DB_COLLECTION: {
    orders: 'orders',
    tables: 'tables',
    menuItems: 'menuItems',
  },
  RED_LOCK_TTL: 5000000000,
};
