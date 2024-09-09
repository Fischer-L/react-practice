import { useMutation } from '@apollo/client';
import { useRouter, NextRouter } from 'next/router'
import { OrderItem, ApiErrorMessage } from '@react-practice/types';
import Title from '@react-practice/web/components/Title';
import MenuOrder from '@react-practice/web/components/MenuOrder';
import Loading from '@react-practice/web/components/Loading';
import useMenuOrderData, { MenuOrderData, UpdateMenuOrderMap } from '@react-practice/web/hooks/useMenuOrderMap';
import checkOrderGQL from '@react-practice/web/graphql/schema/checkOrder.gql';
import updateOrderGQL from '@react-practice/web/graphql/schema/updateOrder.gql';

function goToHome (router: NextRouter, msg?: string) {
  alert(msg || 'System error! Sorry for inconvenience. Please try again later');
  router.push('/');
}

export default function OrderPage () {
  const router = useRouter();
  const tableId = router.query.tableId as string;
  const orderId = router.query.orderId as string;

  const hookVals = useMenuOrderData(orderId);
  const menuOrderData = hookVals[0] as MenuOrderData;
  const menuOrderMap = menuOrderData.orderMap;
  const updateMenuOrderMap = hookVals[1] as UpdateMenuOrderMap;
  function handleOrderUpdate (menuId: string, count: number) {
    updateMenuOrderMap(menuId, count);
  }

  const [ updateOrder ] = useMutation(updateOrderGQL, {
    onCompleted () {
      goToHome(router, 'Order Updated');
    },
    onError (e) {
      let msg;
      if (e.message === ApiErrorMessage.ORDER_HAS_BEEN_EDITED) {
        msg = 'Cannot update! Order has been updated by others';
      }
      goToHome(router, msg);
    },
  });
  const primaryButtonTitle = 'Update';
  function hanldePrimaryButtonClick () {
    const orderItems: OrderItem[] = [];
    Object.values(menuOrderMap).forEach(({ id, count }) => {
      orderItems.push({
        menuId: id,
        count,
      });
    });
    updateOrder({
      variables: {
        orderId,
        orderItems,
        version: menuOrderData.version,
      },
    });
  }

  const [ checkOrder ] = useMutation(checkOrderGQL, {
    onCompleted (data) {
      if (data.checkOrder) {
        goToHome(router, 'Order Checked');
      } else {
        goToHome(router);
      }
    },
    onError () {
      goToHome(router);
    },
  });
  const secondaryButtonTitle = 'Check';
  function hanldeSecondaryButtonClick () {
    checkOrder({
      variables: {
        orderId
      }
    });
  }

  if (!Object.values(menuOrderMap).length) {
    return <Loading />;
  }
  return (
    <>
      <Title title={`Table: ${tableId} / Order: ${orderId}`} />
      <MenuOrder
        menuOrder={menuOrderMap}
        handleOrderUpdate={handleOrderUpdate}
        primaryButtonTitle={primaryButtonTitle}
        hanldePrimaryButtonClick={hanldePrimaryButtonClick}
        secondaryButtonTitle={secondaryButtonTitle}
        hanldeSecondaryButtonClick={hanldeSecondaryButtonClick}
      />
    </>
  );
};
