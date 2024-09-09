
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { MenuItem } from '@react-practice/types';
import Table, { TableRowCell } from '@react-practice/web/components/Table';

export type MenuOrderItem = MenuItem & { count: number };

export type MenuOrderMap = {
  [id: string]: MenuOrderItem
}

export interface MenuOrderProps {
  menuOrder: MenuOrderMap
  handleOrderUpdate: Function
  primaryButtonTitle: String
  hanldePrimaryButtonClick: Function
  secondaryButtonTitle?: String
  hanldeSecondaryButtonClick?: Function
}

const MenuOrder = ({ menuOrder, handleOrderUpdate, primaryButtonTitle, hanldePrimaryButtonClick, secondaryButtonTitle, hanldeSecondaryButtonClick }: MenuOrderProps) => {
  function hanldePrimaryButton (e: React.MouseEvent<HTMLButtonElement>) {
    hanldePrimaryButtonClick();
  }
  function hanldeSecondaryButton (e: React.MouseEvent<HTMLButtonElement>) {
    if (hanldeSecondaryButtonClick) hanldeSecondaryButtonClick();
  }

  const heads = [ 'Name',  'Price', 'Quantity', 'Subtotal' ]

  let total = 0;
  const rows = Object.values(menuOrder).map(({ id, name, price, count }: MenuOrderItem) => {
    function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
      handleOrderUpdate(id, parseInt(e.target.value, 10));
    }

    const subtotal = price * count;
    total += subtotal;

    const cells: TableRowCell[] = [
      {
        id: `${id}-name-${name}`,
        content: name,
      }, {
        id: `${id}-price-${price}`,
        content: price,
      }, {
        id: `${id}-count-${count}`,
        content: <input type="number" defaultValue={count} min="0" onChange={handleChange} />
      }, {
        id: `${id}-subtotal-${subtotal}`,
        content: subtotal
      }
    ];

    return {
      id,
      cells,
    }
  });

  let secondaryButton = null;
  if (secondaryButtonTitle && hanldeSecondaryButtonClick) {
    secondaryButton = (
      <button
        className="middle none center rounded-lg bg-orange-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        onClick={hanldeSecondaryButton}
      >
        {secondaryButtonTitle}
      </button>
    );
  }
  return (
    <>
      <Table heads={heads} rows={rows} />
      <div className="w-full pr-10 mt-6 grid justify-items-end">
        <h3>Total: {total}</h3>
      </div>
      <div className="w-full mt-6 grid justify-items-end">
        <div className="flex">
          <button
            className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={hanldePrimaryButton}
          >
            {primaryButtonTitle}
          </button>
          {
            secondaryButton
          }
          <Link href="/">
            <button className="middle none center mr-4 rounded-lg bg-slate-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-slate-500/20 transition-all hover:shadow-lg hover:shadow-slate-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </>
  );

}

export default MenuOrder;
