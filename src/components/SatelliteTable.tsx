import React, { useMemo, useEffect, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type Row,
  type Cell,
} from '@tanstack/react-table'
import { FixedSizeList as List } from 'react-window'
import type { Satellite } from '../types'
import { useSatellites } from '../services'
import { useStore } from '../store/useStore'

// Constants
const ROW_HEIGHT = 48
const MAX_TABLE_HEIGHT = 600
const OVERSCAN_COUNT = 5
const MOBILE_BREAKPOINT = 768 // px

// Column Definitions
const useTableColumns = (isMobile: boolean) => {
  const selected = useStore((s) => s.selected)
  const add = useStore((s) => s.add)
  const remove = useStore((s) => s.remove)

  return useMemo<ColumnDef<Satellite>[]>(
    () =>
      [
        {
          id: 'select',
          header: () => <div className='w-12' />,
          cell: ({ row }: { row: Row<Satellite> }) => {
            const id = row.original.noradCatId
            const checked = selected.includes(id)
            return (
              <div className='flex items-center justify-center'>
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={() => (checked ? remove(id) : add(id))}
                  disabled={!checked && selected.length >= 10}
                  className='w-4 h-4 cursor-pointer'
                />
              </div>
            )
          },
          size: 48,
          minSize: 48,
          maxSize: 48,
        },
        {
          accessorKey: 'name',
          header: 'Name',
          cell: (info: { getValue: () => any }) => info.getValue(),
          enableSorting: true,
          size: isMobile ? 150 : 300,
          minSize: 150,
        },
        {
          accessorKey: 'noradCatId',
          header: 'NORAD ID',
          cell: (info: { getValue: () => any }) => info.getValue(),
          enableSorting: true,
          size: isMobile ? 100 : 120,
          minSize: 100,
        },
        !isMobile && {
          accessorKey: 'orbitCode',
          header: 'Orbit Code',
          size: 120,
          minSize: 100,
        },
        {
          accessorKey: 'objectType',
          header: 'Object Type',
          size: isMobile ? 120 : 150,
          minSize: 120,
        },
        !isMobile && {
          accessorKey: 'countryCode',
          header: 'Country',
          size: 100,
          minSize: 80,
        },
        {
          accessorKey: 'launchDate',
          header: 'Launch Date',
          cell: (info: { getValue: () => string }) =>
            new Date(info.getValue()).toLocaleDateString(),
          size: isMobile ? 120 : 150,
          minSize: 120,
          enableSorting: true,
        },
      ].filter(Boolean) as ColumnDef<Satellite>[],
    [selected, add, remove, isMobile]
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
const LoadingState = () => (
  <div className='p-4 text-gray-600'>Loading satellites…</div>
)
const ErrorState = () => (
  <div className='p-4 text-red-600'>Failed to load data.</div>
)
const EmptyState = () => (
  <div className='p-4 text-gray-600'>No results found.</div>
)

// Main Component
interface SatelliteTableProps {
  searchQuery: string
}

const SatelliteTable: React.FC<SatelliteTableProps> = ({ searchQuery }) => {
  // Responsive state
  const [isMobile, setIsMobile] = useState(false)

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    handleResize()

    // Add listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
  const columns = useTableColumns(isMobile)
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
    <div className='w-full border border-gray-200 rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <div className={`w-full ${isMobile ? 'min-w-[600px]' : ''}`}>
          <TableHeader table={table} />
          <div className='overflow-auto'>
            <List
              height={Math.min(rows.length * ROW_HEIGHT, MAX_TABLE_HEIGHT)}
              itemCount={rows.length}
              itemSize={ROW_HEIGHT}
              width='100%'
              overscanCount={OVERSCAN_COUNT}
            >
              {({ index, style }) => (
                <TableRow row={rows[index]} style={style} />
              )}
            </List>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SatelliteTable
