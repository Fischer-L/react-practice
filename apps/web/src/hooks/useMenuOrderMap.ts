import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { MenuItem } from '@react-practice/types';
import { MenuOrderMap } from '@react-practice/web/components/MenuOrder';
import listMenuItemsGQL from '@react-practice/web/graphql/schema/listMenuItems.gql';

export type UpdateMenuOrderMap = (menuId: string, count: number) => void;
export type UseMenuOrderMapVal = MenuOrderMap | UpdateMenuOrderMap;

function covertToMenuOrderMap (menuItems: MenuItem[]): MenuOrderMap {
  return menuItems.reduce((_menuOrder: MenuOrderMap, menuItem: MenuItem) => {
    const { id, name, price } = menuItem;
    _menuOrder[id] = {
      id,
      name,
      price,
      count: 0,
    }
    return _menuOrder;
  }, {});
}

export default function useMenuOrderMap (): UseMenuOrderMapVal[] {
  const { loading, error, data } = useQuery(listMenuItemsGQL, {
    fetchPolicy: 'network-only',
  });

  const [ menuOrderMap, setMenuOrderMap ] = useState(covertToMenuOrderMap(loading ? [] : data.listMenuItems));

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
    if (!loading) {
      setMenuOrderMap(covertToMenuOrderMap(data.listMenuItems));
    }
  }, [ loading ]);

  return [ menuOrderMap, updateMenuOrderMap ];
}
