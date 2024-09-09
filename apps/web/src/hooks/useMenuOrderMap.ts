import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { MenuItem, Order } from '@react-practice/types';
import { MenuOrderMap } from '@react-practice/web/components/MenuOrder';
import getOrderGQL from '@react-practice/web/graphql/schema/getOrder.gql';
import listMenuItemsGQL from '@react-practice/web/graphql/schema/listMenuItems.gql';

export type UpdateMenuOrderMap = (menuId: string, count: number) => void;

export interface MenuOrderData {
  orderId?: string | null,
  version?: number | null,
  orderMap: MenuOrderMap
}

export type UseMenuOrderDataVal = MenuOrderData | UpdateMenuOrderMap;

function covertToMenuOrderData (menuItems: MenuItem[], order?: Order | null): MenuOrderData {
  let orderItemCount: Record<string, number> = {};
  if (order?.orderItems.length) {
    order?.orderItems.forEach(({ menuId, count }) => {
      orderItemCount[menuId] = count;
    });
  }

  const orderMap = menuItems.reduce((_menuOrder: MenuOrderMap, menuItem: MenuItem) => {
    const { id, name, price } = menuItem;
    _menuOrder[id] = {
      id,
      name,
      price,
      count: orderItemCount[id] || 0,
    }
    return _menuOrder;
  }, {});

  return {
    orderId: order?.id ?? null,
    version: order?.version ?? null,
    orderMap,
  }
}

export default function useMenuOrderData (orderId?: string): UseMenuOrderDataVal[] {
  const { loading: menuItemsNotLoaded, data } = useQuery(listMenuItemsGQL, {
    fetchPolicy: 'network-only',
  });
  const listMenuItemsData = menuItemsNotLoaded ? [] : data.listMenuItems;

  const [ menuOrderData, setMenuOrder ] = useState(covertToMenuOrderData(listMenuItemsData));
  const updateMenuOrderMap = (menuId: string, count: number) => {
    const menuOrderMap = {
      ...menuOrderData.orderMap,
      [menuId]: {
        ...menuOrderData.orderMap[menuId],
        count,
      }
    }
    setMenuOrder({
      ...menuOrderData,
      orderMap: menuOrderMap,
    })
  }

  const [ orderData, setOrderData ] = useState(null);
  const [ orderNotLoaded, setOrderNotLoaded ] = useState(true);
  const [ getOrder] = useLazyQuery(getOrderGQL, {
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (orderId) {
      getOrder({
        variables: {
          orderId,
        },
      }).then(({ data, loading }) => {
        setOrderData(data.getOrder);
        setOrderNotLoaded(loading);
      });
    }
  }, [ orderId ]);

  useEffect(() => {
    if (menuItemsNotLoaded) {
      return;
    }
    setMenuOrder(covertToMenuOrderData(listMenuItemsData, orderData));
  }, [ listMenuItemsData, orderNotLoaded ]);

  return [ menuOrderData, updateMenuOrderMap ];
}
