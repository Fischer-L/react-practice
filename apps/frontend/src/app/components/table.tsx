import React, { ReactElement } from "react";

export type TableRowContent = string | number | ReactElement;

export type TableRowContents = TableRowContent[];

export interface TableProps {
  heads: string[],
  rows: TableRowContents[],
}

export interface TableRowProp {
  row: TableRowContents
}

const TableRow = ({ row }: TableRowProp) => {
  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
      {row.map(content => (
        <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
          {content}
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
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              {text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => <TableRow row={row} />)}
      </tbody>
    </table>
  );
};

export default Table;
