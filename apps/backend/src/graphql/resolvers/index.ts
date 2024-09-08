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
      return updateOrder(args.data.orderId, args.data.orderItems)
    },
  },
};

export default resolvers;
