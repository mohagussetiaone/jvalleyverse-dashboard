import React, { useState } from "react";
import { useReactTable, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues } from "@tanstack/react-table";
import "jspdf-autotable";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const TableContainer = ({ datas, columns, globalFilter, setGlobalFilter, style }) => {
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data: datas,
    columns,
    state: {
      globalFilter,
      sorting, // ketika di klik tablenya / sorting manual
      columnFilters, // untuk memfilter tiap kolum tapi belom di terapkan
      columnVisibility,
    },
    //  - SET STATE
    enableRowSelection: true,
    // onRowSelectionChange: setRowSelection, // baru
    onSortingChange: setSorting, // sorting manual
    OnGlobalFilterChange: setGlobalFilter, // lama
    onColumnFiltersChange: setColumnFilters, // baru
    onColumnVisibilityChange: setColumnVisibility, // baru
    //  -  OPSI LAMA
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //  - OPSI BARU
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <>
      <div className="flex justify-between m-4"></div>
      <div>
        <div className="title flex flex-col md:flex-row gap-2 justify-between my-4">
          <div className="text-black dark:text-gray-200">
            Showing <strong>{table.getState().pagination.pageSize * table.getState().pagination.pageIndex + 1}</strong> to{" "}
            <strong>{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, datas.length)}</strong> of <strong>{datas.length}</strong> data
          </div>
          <div className="flex gap-2 justify-end md:justify-normal text-black">
            <h3 className="dark:text-gray-200">Items per page</h3>
            <select
              name="show"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="p-1 dark:bg-boxDark dark:text-gray-200 bg-transparent border border-gray-400 rounded-md"
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize} className="dark:text-gray-100 text-sm">
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="!border-px !border-gray-400 text-start dark:bg-boxDarkSecondary">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan} onClick={header.column.getToggleSortingHandler()} className="border-gray-200 py-3 px-2 text-start">
                        <div className={`items-center justify-center text-xs ${header.column.id == "action" ? "" : style}  text-gray-200 dark:text-gray-200`}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: "",
                            desc: "",
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 dark:text-gray-200">
                    Data Not Found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id} className="text-start border-b-[1px] border-gray-300 dark:border-navy-700 text-black dark:text-gray-200">
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id} className="min-w-0 font-normal border-white/0 p-2 text-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex justify-end px-4 py-2 border-t text-black">
          <div className="flex items-center mt-4 gap-2">
            <button
              onClick={() => {
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              className="border border-gray-300 disabled:opacity-30"
            >
              <MdNavigateBefore className="w-8 h-8 dark:text-gray-100" />
            </button>
            <button
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              className="border border-gray-300 disabled:opacity-30"
            >
              <MdNavigateNext className="w-8 h-8 dark:text-gray-100" />
            </button>
            <span className="flex items-center gap-1">
              <h3 className="dark:text-gray-100">Page</h3>
              <div className="flex gap-1 flex-row">
                <strong className="dark:text-gray-100">{table.getState().pagination.pageIndex + 1}</strong>
                <strong className="dark:text-gray-100">of </strong>
                <strong className="dark:text-gray-100">{table.getPageCount()}</strong>
              </div>
            </span>
            <div className="hidden md:block dark:text-gray-200">|</div>
            <span className="flex items-center gap-1 dark:text-gray-100">
              <span className="hidden md:inline-block">Go</span>
              To
              <input
                name="page"
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16 bg-transparent"
                min={1}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableContainer;
