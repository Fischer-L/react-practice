import { IEnumTypeResolver, IFieldResolverOptions } from '@graphql-tools/utils';
import { GraphQLFieldResolver, GraphQLScalarType } from 'graphql/type/definition';
import { DateTimeResolver } from 'graphql-scalars';
import { MenuItem, OrderStatus } from '@react-practice/types';
import { listTables } from '@react-practice/backend/db/tables';
import { listMenuItems } from '@react-practice/backend/db/menuItems';
import { createOrder, updateOrder, getOrder } from '@react-practice/backend/db/orders';


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
      return listMenuItems();
      // const items = [];
      // for (let i = 1; i < 11; i++) {
      //   items.push({
      //     id: i,
      //     name: 'menu_item_' + i,
      //     price: i * 100,
      //   });
      // }
      // return items;
    },

    listTables () {
      return listTables();
      // const items = [];
      // for (let i = 0; i < 5; i++) {
      //   items.push({
      //     id: i,
      //     orderId: null,
      //     OrderStatus: null,
      //   });
      // }
      // items[1] = {
      //   id: '1',
      //   orderId: '1',
      //   orderStatus: 'ORDERED',
      // };
      // return items;
    },

    getOrder (source, args) {
      console.log('getOrder: ', args.orderId);
      return getOrder(args.orderId);
    },
  },

  Mutation: {
    createOrder (source, args) {
      return createOrder(args.tableId, args.orderItems)
      // return {
      //   id: '1',
      //   tableId: 'tableId',
      //   orderItems: [{
      //     menuId: 'menuId',
      //     count: 2,
      //   }],
      // }
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
