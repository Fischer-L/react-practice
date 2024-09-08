import React, { ReactElement, ReactNode } from "react";

export type TableRowCellContent = string | number | ReactNode;

export interface TableRowCell {
  id: string | number,
  content: TableRowCellContent
}

export interface TableRowProp {
  id: string | number,
  cells: TableRowCell[]
}

export interface TableProps {
  heads: string[],
  rows: TableRowProp[],
}

const TableRow = ({ cells }: TableRowProp) => {
  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
      {cells.map(cell => (
        <td key={cell.id} className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
          {cell.content}
        </td>
      ))}
    </tr>
  )
}

const Table = ({ heads, rows }: TableProps) => {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          {heads.map(text => (
            <th key={text} className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              {text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => <TableRow key={row.id} {...row} />)}
      </tbody>
    </table>
  );
};

export default Table;
