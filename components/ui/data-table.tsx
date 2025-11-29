// =====================================
// FILE: components/ui/data-table.tsx
// =====================================
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  enableSearch?: boolean;
  enableColumnSelection?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  enableSearch = false,
  enableColumnSelection = false,
}: TableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center gap-4'>
        {enableSearch && searchKey && (
          <Input
            placeholder={`Search ${searchKey}...`}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='max-w-sm bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring'
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='ml-auto'
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--card-foreground)',
                borderColor: 'var(--border)',
              }}
            >
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            style={{
              backgroundColor: 'var(--popover)',
              color: 'var(--popover-foreground)',
              borderColor: 'var(--border)',
            }}
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    style={{
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent-foreground)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'inherit';
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className='rounded-lg border shadow-sm overflow-hidden'
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        color: 'var(--muted-foreground)',
                        fontWeight: 500,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: row.getIsSelected()
                      ? 'var(--accent)'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!row.getIsSelected()) {
                      e.currentTarget.style.backgroundColor = 'var(--muted)';
                      e.currentTarget.style.opacity = '0.5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!row.getIsSelected()) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        color: 'var(--foreground)',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                  style={{
                    color: 'var(--muted-foreground)',
                  }}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2'>
        {enableColumnSelection && (
          <div
            className='flex-1 text-sm'
            style={{
              color: 'var(--muted-foreground)',
            }}
          >
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--card-foreground)',
              borderColor: 'var(--border)',
              opacity: !table.getCanPreviousPage() ? 0.5 : 1,
              cursor: !table.getCanPreviousPage() ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--card-foreground)',
              borderColor: 'var(--border)',
              opacity: !table.getCanNextPage() ? 0.5 : 1,
              cursor: !table.getCanNextPage() ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
