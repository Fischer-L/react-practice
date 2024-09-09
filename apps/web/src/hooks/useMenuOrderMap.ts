import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { MenuItem, Order } from '@react-practice/types';
import { MenuOrderMap } from '@react-practice/web/components/MenuOrder';
import getOrderGQL from '@react-practice/web/graphql/schema/getOrder.gql';
import listMenuItemsGQL from '@react-practice/web/graphql/schema/listMenuItems.gql';

export type UpdateMenuOrderMap = (menuId: string, count: number) => void;
export type UseMenuOrderMapVal = MenuOrderMap | UpdateMenuOrderMap;

function covertToMenuOrderMap (menuItems: MenuItem[], order?: Order): MenuOrderMap {
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
  const { loading: menuItemsNotLoaded , error, data: listMenuItemsData } = useQuery(listMenuItemsGQL, {
    fetchPolicy: 'network-only',
  });
  const [ menuOrderMap, setMenuOrderMap ] = useState(covertToMenuOrderMap(menuItemsNotLoaded ? [] : listMenuItemsData.listMenuItems));

  let getOrderData = null;
  let orderNotLoaded = true;
  if (orderId) {
    const { loading , error, data } = useQuery(getOrderGQL, {
      fetchPolicy: 'network-only',
      variables: {
        orderId,
      }
    });
    getOrderData = data;
    orderNotLoaded = loading;
  }

  const updateMenuOrderMap = (menuId: string, count: number) => {
    setMenuOrderMap({
      ...menuOrderMap,
      [menuId]: {
        ...menuOrderMap[menuId],
        count,
      }
    })
  }

  useEffect(() => {
    if (menuItemsNotLoaded) {
      return;
    }
    const order = orderNotLoaded ? null : getOrderData.getOrder;
    setMenuOrderMap(covertToMenuOrderMap(listMenuItemsData.listMenuItems, order));
  }, [ menuItemsNotLoaded, orderNotLoaded ]);

  return [ menuOrderMap, updateMenuOrderMap ];
}
