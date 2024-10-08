import { useQuery } from '@apollo/client';
import React from "react";

import { Table as TableType, OrderStatus } from '@react-practice/types';

import To from '@react-practice/web/components/To';
import Title from '@react-practice/web/components/Title';
import Loading from '@react-practice/web/components/Loading';
import Table, { TableRowCell } from '@react-practice/web/components/Table';
import listTablesGQL from '@react-practice/web/graphql/schema/listTables.gql';

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
    return <p>Fail to fetch data. Plese run `npx nx run backend:serve` to start the dev server</p>;
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
      const href = `/table/${id}/order/${orderId}`;
      cells.push({
        id: href,
        content: <To href={href}>manage order</To>,
      });
    } else {
      const href = `/table/${id}/order/new`;
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
