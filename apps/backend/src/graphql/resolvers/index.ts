import { IEnumTypeResolver, IFieldResolverOptions } from '@graphql-tools/utils';
import { GraphQLFieldResolver, GraphQLScalarType } from 'graphql/type/definition';
import { DateTimeResolver } from 'graphql-scalars';
import { MenuItem } from '@react-practice/types';
import { listTable } from '../db/table';
import { listMenuItems } from '../db/menuItem';


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
      // const tables = [];
      // for (let i = 0; i < 5; i++) {
      //   tables.push({
      //     id: i,
      //     orderId: 'order-' + i,
      //     orderStatus: 'ORDERED',
      //   });
      // }
      // return tables;
    },
  },

  Mutation: {
    wink (source, args) {
      return 'Wink ' + args.name;
    },
  },
};

export default resolvers;
