import React, { useMemo } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { FixedSizeList as List } from 'react-window'
import type { Satellite } from '../types'
import { useSatellites } from '../services'
import { useStore } from '../store/useStore'

// Constants
const ROW_HEIGHT = 48
const MAX_TABLE_HEIGHT = 600

// Column Definitions
const useTableColumns = () => {
  const selected = useStore((s) => s.selected)
  const add = useStore((s) => s.add)
  const remove = useStore((s) => s.remove)

  return useMemo<ColumnDef<Satellite>[]>(
    () => [
      {
        id: 'select',
        header: () => <></>, // could show a “☐” or count badge
        cell: ({ row }) => {
          const id = row.original.noradCatId
          const checked = selected.includes(id)
          return (
            <input
              type='checkbox'
              checked={checked}
              onChange={() => (checked ? remove(id) : add(id))}
              disabled={!checked && selected.length >= 10}
            />
          )
        },
        size: 40,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'noradCatId',
        header: 'NORAD ID',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'orbitCode',
        header: 'Orbit Code',
      },
      {
        accessorKey: 'objectType',
        header: 'Object Type',
      },
      {
        accessorKey: 'countryCode',
        header: 'Country',
      },
      {
        accessorKey: 'launchDate',
        header: 'Launch Date',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
    ],
    [selected, add, remove]
  )
}

// Table Header Component
const TableHeader: React.FC<{ table: any }> = ({ table }) => (
  <div className='flex bg-gray-100 font-semibold'>
    {table.getHeaderGroups()[0].headers.map((header: any) => (
      <div
        key={header.id}
        className='flex-1 p-2 cursor-pointer select-none'
        onClick={header.column.getToggleSortingHandler()}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {{
          asc: ' 🔼',
          desc: ' 🔽',
        }[header.column.getIsSorted() as string] ?? null}
      </div>
    ))}
  </div>
)

// Table Row Component
const TableRow: React.FC<{ row: any; style: React.CSSProperties }> = ({
  row,
  style,
}) => (
  <div style={style} className='flex border-b last:border-0 hover:bg-gray-50'>
    {row.getVisibleCells().map((cell: any) => (
      <div key={cell.id} className='flex-1 p-2'>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ))}
  </div>
)

// Loading and Error States
const LoadingState = () => <div className='p-4'>Loading satellites…</div>
const ErrorState = () => (
  <div className='p-4 text-red-600'>Failed to load data.</div>
)
const EmptyState = () => <div className='p-4'>No results found.</div>

// Main Component
interface SatelliteTableProps {
  searchQuery: string
}

const SatelliteTable: React.FC<SatelliteTableProps> = ({ searchQuery }) => {
  // Data Fetching
  const { data: allSats = [], isLoading, isError } = useSatellites()

  // Filtered Data
  const satellites = useMemo(() => {
    if (!searchQuery) return allSats
    const q = searchQuery.toLowerCase()
    return allSats.filter(
      (sat) =>
        sat.name.toLowerCase().includes(q) || String(sat.noradCatId).includes(q)
    )
  }, [allSats, searchQuery])

  // Table Setup
  const columns = useTableColumns()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data: satellites,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Render States
  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState />
  if (satellites.length === 0) return <EmptyState />

  // Get Rows
  const rows = table.getRowModel().rows

  return (
    <div className='border rounded'>
      <TableHeader table={table} />

      <List
        height={Math.min(rows.length * ROW_HEIGHT, MAX_TABLE_HEIGHT)}
        itemCount={rows.length}
        itemSize={ROW_HEIGHT}
        width='100%'
      >
        {({ index, style }) => <TableRow row={rows[index]} style={style} />}
      </List>
    </div>
  )
}

export default SatelliteTable
