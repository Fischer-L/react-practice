import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import { OrderItem, ApiErrorMessage } from '@react-practice/types';
import Title from '@react-practice/web/components/Title';
import MenuOrder, { MenuOrderMap } from '@react-practice/web/components/MenuOrder';
import Loading from '@react-practice/web/components/Loading';
import useMenuOrderData, { MenuOrderData, UpdateMenuOrderMap } from '@react-practice/web/hooks/useMenuOrderMap';
import createOrderGQL from '@react-practice/web/graphql/schema/createOrder.gql';

export default function NewOrderPage () {
  const router = useRouter();
  const tableId = router.query.tableId;

  const hookVals = useMenuOrderData();
  const menuOrderData = hookVals[0] as MenuOrderData;
  const menuOrderMap = menuOrderData.orderMap;
  const updateMenuOrderMap = hookVals[1] as UpdateMenuOrderMap;
  function handleOrderUpdate (menuId: string, count: number) {
    updateMenuOrderMap(menuId, count);
  }

  const [ createOrder ] = useMutation(createOrderGQL, {
    onCompleted (data) {
      alert('Order created');
      router.push('/');
    },
    onError (e) {
      let msg = 'System error! Sorry for inconvenience. Please try again later';
      if (e.message === ApiErrorMessage.ORDER_HAS_BEEN_EDITED) {
        msg = 'Order is created already!';
      }
      alert(msg);
      router.push('/');
    },
  });
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
