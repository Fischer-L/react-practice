import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { MenuItem, Order } from '@react-practice/types';
import { MenuOrderMap } from '@react-practice/web/components/MenuOrder';
import getOrderGQL from '@react-practice/web/graphql/schema/getOrder.gql';
import listMenuItemsGQL from '@react-practice/web/graphql/schema/listMenuItems.gql';

export type UpdateMenuOrderMap = (menuId: string, count: number) => void;
export type UseMenuOrderMapVal = MenuOrderMap | UpdateMenuOrderMap;

function covertToMenuOrderMap (menuItems: MenuItem[], order?: Order | null): MenuOrderMap {
  let orderItemCount: Record<string, number> = {};
  if (order?.orderItems.length) {
    order?.orderItems.forEach(({ menuId, count }) => {
      orderItemCount[menuId] = count;
    });
  }

  return menuItems.reduce((_menuOrder: MenuOrderMap, menuItem: MenuItem) => {
    const { id, name, price } = menuItem;
    _menuOrder[id] = {
      id,
      name,
      price,
      count: orderItemCount[id] || 0,
    }
    return _menuOrder;
  }, {});
}

export default function useMenuOrderMap (orderId?: string): UseMenuOrderMapVal[] {
  const { loading: menuItemsNotLoaded, data } = useQuery(listMenuItemsGQL, {
    fetchPolicy: 'network-only',
  });
  const listMenuItemsData = menuItemsNotLoaded ? [] : data.listMenuItems;

  const [ menuOrderMap, setMenuOrderMap ] = useState(covertToMenuOrderMap(listMenuItemsData));
  const updateMenuOrderMap = (menuId: string, count: number) => {
    setMenuOrderMap({
      ...menuOrderMap,
      [menuId]: {
        ...menuOrderMap[menuId],
        count,
      }
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
    setMenuOrderMap(covertToMenuOrderMap(listMenuItemsData, orderData));
  }, [ listMenuItemsData, orderNotLoaded ]);

  return [ menuOrderMap, updateMenuOrderMap ];
}
