import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import { OrderItem } from '@react-practice/types';
import Title from '@react-practice/web/components/Title';
import MenuOrder, { MenuOrderMap } from '@react-practice/web/components/MenuOrder';
import Loading from '@react-practice/web/components/Loading';
import useMenuOrderMap, { UpdateMenuOrderMap } from '@react-practice/web/hooks/useMenuOrderMap';
import createOrderGQL from '@react-practice/web/graphql/schema/createOrder.gql';

export default function NewOrderPage () {
  const router = useRouter();
  const tableId = router.query.tableId;

  const [ createOrder ] = useMutation(createOrderGQL, {
    onCompleted (data) {
      alert('Order created');
      const { id } = data.createOrder;
      router.push(`/table/${tableId}/order/${id}`);
    },
    onError () {
      alert('System error! Sorry for inconvenience. Please try again later');
      router.push('/');
    },
  });

  const hookVals = useMenuOrderMap();
  const menuOrderMap = hookVals[0] as MenuOrderMap;
  const updateMenuOrderMap = hookVals[1] as UpdateMenuOrderMap;
  function handleOrderUpdate (menuId: string, count: number) {
    updateMenuOrderMap(menuId, count);
  }

  const primaryButtonTitle = 'Create';
  function hanldePrimaryButtonClick () {
    const orderItems: OrderItem[] = [];
    Object.values(menuOrderMap).forEach(({ id, count }) => {
      if (count > 0) {
        orderItems.push({
          menuId: id,
          count,
        });
      }
    });

    if (orderItems.length) {
      createOrder({
        variables: {
          tableId,
          orderItems,
        },
      });
    } else {
      alert('Please add menu order item to create an order');
    }
  }

  if (!Object.values(menuOrderMap).length) {
    return <Loading />;
  }
  return (
    <>
      <Title title='Create Order' />
      <MenuOrder menuOrder={menuOrderMap} handleOrderUpdate={handleOrderUpdate} primaryButtonTitle={primaryButtonTitle} hanldePrimaryButtonClick={hanldePrimaryButtonClick}/>
    </>
  );
};
