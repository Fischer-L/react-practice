import { IEnumTypeResolver, IFieldResolverOptions } from '@graphql-tools/utils';
import { GraphQLFieldResolver, GraphQLScalarType } from 'graphql/type/definition';
import { DateTimeResolver } from 'graphql-scalars';
import { MenuItem, OrderStatus } from '@react-practice/types';
import { listTable } from '@react-practice/backend/db/tables';
import { listMenuItems } from '@react-practice/backend/db/menuItems';
import { createOrder, updateOrder } from '@react-practice/backend/db/orders';


interface FieldResolvers {
  [field: string]: GraphQLFieldResolver<any, any, any>;
}

interface Resolvers {
  Query: FieldResolvers;
  Mutation: FieldResolvers;
  [field: string]: FieldResolvers | GraphQLScalarType | IFieldResolverOptions | IEnumTypeResolver;
}

const resolvers: Resolvers = {
  Query: {
    listMenuItems() {
      // return listMenuItems();
      const items = [];
      for (let i = 1; i < 11; i++) {
        items.push({
          id: i,
          name: 'menu_item_' + i,
          price: i * 100,
        });
      }
      return items;
    },

    listTables () {
      // return listTable()
      const items = [];
      for (let i = 0; i < 5; i++) {
        items.push({
          id: i,
          orderId: null,
          OrderStatus: null,
        });
      }
      items[1] = {
        id: '1',
        orderId: '1',
        orderStatus: 'ORDERED',
      };
      return items;
    },

    getOrder (source, args) {
      console.log('getOrder: ', args.orderId);
      const order = {
        id: args.orderId,
        tableId: 1,
        orderItems: [{
          menuId: 1,
          count: 1,
        }, {
          menuId: 2,
          count: 2,
        }],
        status: 'ORDERED',
      };
      return order;
    },
  },

  Mutation: {
    createOrder (source, args) {
      console.log(args);
      // return createOrder(args.data)
      return {
        id: '1',
        tableId: 'tableId',
        orderItems: [{
          menuId: 'menuId',
          count: 2,
        }],
      }
    },

    updateOrder (source, args) {
      return updateOrder(args.orderId, args.orderItems)
    },

    checkOrder (source, args) {
      console.log('checkOrder: ', args.orderId);
      return false;
    }
  },
};

export default resolvers;
