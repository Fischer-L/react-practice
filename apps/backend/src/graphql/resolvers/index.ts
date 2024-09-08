import { IEnumTypeResolver, IFieldResolverOptions } from '@graphql-tools/utils';
import { GraphQLFieldResolver, GraphQLScalarType } from 'graphql/type/definition';
import { DateTimeResolver } from 'graphql-scalars';
import { MenuItem } from '@react-practice/types';
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
      return listMenuItems();
    },

    listTables () {
      return listTable()
    },
  },

  Mutation: {
    createOrder(source, args) {
      return createOrder(args.data)
    },

    updateOrder(source, args) {
      return updateOrder(args.data.orderId, args.data.orderItem)
    },
  },
};

export default resolvers;
