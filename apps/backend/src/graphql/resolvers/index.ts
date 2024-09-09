import { IEnumTypeResolver, IFieldResolverOptions } from '@graphql-tools/utils';
import { GraphQLFieldResolver, GraphQLScalarType } from 'graphql/type/definition';
import { DateTimeResolver } from 'graphql-scalars';
import { ApiErrorMessage } from '@react-practice/types';
import { listTables } from '@react-practice/backend/db/tables';
import { listMenuItems } from '@react-practice/backend/db/menuItems';
import { createOrder, updateOrder, checkOrder, getOrder } from '@react-practice/backend/db/orders';
import { acquireLock, releaseLock } from '@react-practice/backend/lock/tableLock';

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
    },

    listTables () {
      return listTables();
    },

    getOrder (source, args) {
      return getOrder(args.orderId);
    },
  },

  Mutation: {
    async createOrder (source, args) {
      const lock = await acquireLock(args.tableId);
      if (lock) {
        try {
          return createOrder(args.tableId, args.orderItems);
        } finally {
          releaseLock(lock);
        }
      } else {
        throw Error(ApiErrorMessage.ORDER_HAS_BEEN_EDITED);
      }
    },

    async updateOrder (source, args) {
      const lock = await acquireLock(args.orderId);
      if (lock) {
        try {
          return updateOrder(args.orderId, args.orderItems, args.version);
        } finally {
          releaseLock(lock);
        }
      } else {
        throw Error(ApiErrorMessage.ORDER_HAS_BEEN_EDITED);
      }
    },

    async checkOrder (source, args) {
      const lock = await acquireLock(args.orderId);
      if (lock) {
        try {
          return checkOrder(args.orderId);
        } finally {
          releaseLock(lock);
        }
      } else {
        throw Error(ApiErrorMessage.ORDER_HAS_BEEN_EDITED);
      }
    }
  },
};

export default resolvers;
