import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";

const DisplayTable = ({ data, columns }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(data.length / pageSize);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  return (
    <div className="p-4 shadow-md rounded-lg">
      <table className="w-full border-collapse border text-center border-gray-300">
        <thead className="bg-primary-200 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th className="border border-gray-300 whitespace-nowrap">SI. No</th> {/* SI No Column */}
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 py-2 whitespace-nowrap">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 whitespace-nowrap">{pageIndex * pageSize + index + 1}</td> {/* SI No */}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 py-2 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        {/* Rows Per Page Dropdown */}
        <select
          className="border border-gray-300 px-2 py-1 rounded"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[ 10, 20,30].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0}
          >
            ⏮ First
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
          >
            ◀ Prev
          </button>

          {/* Page Number Input */}
          <input
            type="number"
            className="border border-gray-300 px-2 py-1 w-16 text-center"
            value={pageIndex + 1}
            onChange={(e) => {
              let newPage = Number(e.target.value) - 1;
              if (newPage >= 0 && newPage < totalPages) {
                setPageIndex(newPage);
              }
            }}
          />

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={pageIndex >= totalPages - 1}
          >
            Next ▶
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPageIndex(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            ⏭ Last
          </button>
        </div>

        {/* Showing X of Y */}
        <span className="text-sm">
          Page {pageIndex + 1} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default DisplayTable;
