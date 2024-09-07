import { gql, useQuery } from '@apollo/client';
import React, { ReactElement, ReactNode } from "react";
import Link from 'next/link';

import { Table as TableType, OrderStatus } from '@react-practice/types';

import To from '../components/To';
import Title from '../components/Title';
import Table, { TableRowContents } from '../components/Table';
import listTablesGQL from '../graphql/schema/listTables.gql';

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

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  const heads = [ 'Table id',  'Status', 'Action' ];

  const rows = data.listTables.map(({ id, orderStatus, orderId }: TableType) => {
    const row: TableRowContents = [ id ];
    const hasOrder = !!(orderId && orderStatus === OrderStatus.ORDERED);

    row.push(<AvailablityTag hasOrder={hasOrder}/>);
    if (hasOrder) {
      const href = `/order/${orderId}`;
      row.push(<To href={href}>view order</To>);
    } else {
      const href = `/table/${id}/new-order`;
      row.push(<To href={href}>create order</To>);
    }
    return row;
  });

  return (
    <>
      <Title title='Tables' />
      <Table heads={heads} rows={rows} />
    </>
  );
}

export default Index;
