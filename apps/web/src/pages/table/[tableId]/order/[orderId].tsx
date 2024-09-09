import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router'
import { OrderItem } from '@react-practice/types';
import Title from '@react-practice/web/components/Title';
import MenuOrder, { MenuOrderMap } from '@react-practice/web/components/MenuOrder';
import Loading from '@react-practice/web/components/Loading';
import useMenuOrderMap, { UpdateMenuOrderMap } from '@react-practice/web/hooks/useMenuOrderMap';
import updateOrderGQL from '@react-practice/web/graphql/schema/updateOrder.gql';

export default function OrderPage () {
  const router = useRouter();
  const tableId = router.query.tableId as string;
  const orderId = router.query.orderId as string;

  const [ updateOrder ] = useMutation(updateOrderGQL, {
    onCompleted (data) {
      alert('Order Updated');
      const { id } = data.createOrder;
      router.push(`/order/${id}/`);
    },
    onError () {
      alert('System error! Sorry for inconvenience. Please try again later');
      router.push('/');
    },
  });

  const hookVals = useMenuOrderMap(orderId);
  const menuOrderMap = hookVals[0] as MenuOrderMap;
  const updateMenuOrderMap = hookVals[1] as UpdateMenuOrderMap;
  function handleOrderUpdate (menuId: string, count: number) {
    updateMenuOrderMap(menuId, count);
  }

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
      },
    });
  }

  const secondaryButtonTitle = 'Check';
  function hanldeSecondaryButtonClick () {
    alert('TODO: Check a bill');
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
