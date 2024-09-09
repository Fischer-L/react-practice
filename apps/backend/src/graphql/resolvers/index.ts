import { IEnumTypeResolver, IFieldResolverOptions } from '@graphql-tools/utils';
import { GraphQLFieldResolver, GraphQLScalarType } from 'graphql/type/definition';
import { DateTimeResolver } from 'graphql-scalars';
import { MenuItem, OrderStatus } from '@react-practice/types';
import { listTable } from '../db/table';
import { listMenuItems } from '../db/menuItem';
import { createOrder, updateOrder } from '../db/order';


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
    hello (source, args) {
      return 'Hello ' + args.name;
    },

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
      return items;
    },

    getOrder (source, args) {
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
        status: 'ORDERED'
      };
    },
  },

  Mutation: {
    createOrder(source, args) {
      console.log(args);
      // return createOrder(args.data)
      return {
        id: 'id',
        tableId: 'tableId',
        orderItems: [{
          menuId: 'menuId',
          count: 2,
        }],
      }
    },

    updateOrder(source, args) {
      return updateOrder(args.orderId, args.orderItems)
    },
  },
};

export default resolvers;
