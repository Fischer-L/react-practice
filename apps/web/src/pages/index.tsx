import { useQuery } from '@apollo/client';
import React from "react";

import { Table as TableType, OrderStatus } from '@react-practice/types';

import To from '@react-practice/web/components/To';
import Title from '@react-practice/web/components/Title';
import Loading from '@react-practice/web/components/Loading';
import Table, { TableRowCell } from '@react-practice/web/components/Table';
import listTablesGQL from '@react-practice/web/graphql/schema/listTables.gql';

import styles from './index.module.scss';

interface AvailablityTagProp {
  hasOrder: boolean
}
const AvailablityTag = ({ hasOrder }: AvailablityTagProp) => {
  const text = hasOrder ? 'unavailable' : 'available';

  const classNames = [ 'rounded', 'py-1', 'px-3', 'text-xs', 'font-bold' ];
  classNames.push(hasOrder ? 'bg-red-400' : 'bg-green-400');

  return <span className={classNames.join(' ')}>{ text }</span>;
}

export function Index() {
  const { loading, error, data } = useQuery(listTablesGQL, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const heads = [ 'Table id',  'Status', 'Action' ];

  const rows = data.listTables.map(({ id, orderStatus, orderId }: TableType) => {
    const cells: TableRowCell[] = [{
      id,
      content: id,
    }];

    const hasOrder = !!(orderId && orderStatus === OrderStatus.ORDERED);

    cells.push({
      id: String(hasOrder),
      content: <AvailablityTag hasOrder={hasOrder}/>,
    });

    if (hasOrder) {
      const href = `/order/${orderId}`;
      cells.push({
        id: href,
        content: <To href={href}>view order</To>,
      });
    } else {
      const href = `/table/${id}/new-order`;
      cells.push({
        id: href,
        content: <To href={href}>create order</To>,
      });
    }
    return {
      id,
      cells,
    }
  });

  return (
    <>
      <Title title='Tables' />
      <Table heads={heads} rows={rows} />
    </>
  );
}

export default Index;
