import React, { useMemo, useEffect, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type Row,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { FixedSizeList as List } from 'react-window'
import type { Satellite } from '../types'
import { useSatellites } from '../services'
import { useStore } from '../store/useStore'
import FilterPanel from './FilterPanel'

// Constants
const ROW_HEIGHT = 52
const HEADER_HEIGHT = 48
const OVERSCAN_COUNT = 5
const MOBILE_BREAKPOINT = 768 // px

// Helper function to clean orbit code for display
const cleanOrbitCode = (code: string) => code?.replace(/[{}]/g, '') || code

// Column Definitions
const useTableColumns = (isMobile: boolean) => {
  const selected = useStore((s) => s.selected)
  const add = useStore((s) => s.add)
  const remove = useStore((s) => s.remove)

  return useMemo<ColumnDef<Satellite>[]>(
    () => [
      {
        id: 'select',
        header: () => <div className='w-14' />,
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
                className='w-5 h-5 cursor-pointer accent-[#64ffda] bg-transparent border-[#233554] rounded-sm'
              />
            </div>
          )
        },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info: { getValue: () => any }) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'noradCatId',
        header: 'NORAD ID',
        cell: (info: { getValue: () => any }) => (
          <span className='font-mono'>{info.getValue()}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'orbitCode',
        header: 'Orbit Code',
        cell: (info: { getValue: () => any }) => (
          <span className='font-mono'>{cleanOrbitCode(info.getValue())}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'objectType',
        header: 'Object Type',
        cell: (info: { getValue: () => any }) => info.getValue(),
        enableSorting: false,
      },
      {
        accessorKey: 'countryCode',
        header: 'Country',
        cell: (info: { getValue: () => any }) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'launchDate',
        header: 'Launch Date',
        cell: (info) => {
          const value = info.getValue() as string
          const date = new Date(value)
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        },
        enableSorting: true,
      },
    ],
    [selected, add, remove]
  )
}

// Table Header Component
const TableHeader: React.FC<{ table: any }> = ({ table }) => (
  <div className='flex bg-[#020c1b] text-white border-b border-[#233554]'>
    {table.getHeaderGroups()[0].headers.map((header: any) => (
      <div
        key={header.id}
        className={`px-4 py-3 select-none ${
          header.id === 'select' ? 'w-14' : 'flex-1'
        } ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
        onClick={
          header.column.getCanSort()
            ? header.column.getToggleSortingHandler()
            : undefined
        }
      >
        <div className='flex items-center gap-2'>
          <span className='whitespace-nowrap overflow-hidden text-ellipsis font-medium'>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {header.column.getCanSort() && (
            <span className='text-[#64ffda] opacity-75'>
              {header.column.getIsSorted()
                ? header.column.getIsSorted() === 'asc'
                  ? '↑'
                  : '↓'
                : '↕'}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
)

// Table Row Component
const TableRow: React.FC<{ row: any; style: React.CSSProperties }> = ({
  row,
  style,
}) => (
  <div
    style={style}
    className='flex border-b border-[#233554]/50 hover:bg-[#112240] text-white/90'
  >
    {row.getVisibleCells().map((cell: any) => (
      <div
        key={cell.id}
        className={`px-4 py-3 ${
          cell.column.id === 'select' ? 'w-14' : 'flex-1'
        }`}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ))}
  </div>
)

// Loading and Error States
const LoadingState = () => (
  <div className='p-4 text-[#64ffda]'>Loading satellites…</div>
)
const ErrorState = () => (
  <div className='p-4 text-red-500'>Failed to load data.</div>
)
const EmptyState = () => (
  <div className='p-4 text-[#64ffda]'>No results found.</div>
)

// Main Component
interface SatelliteTableProps {
  searchQuery: string
  selectedCategory: string | null
  selectedOrbitCodes: string[]
}

const SatelliteTable: React.FC<SatelliteTableProps> = ({
  searchQuery,
  selectedCategory,
  selectedOrbitCodes,
}) => {
  // Responsive state
  const [isMobile, setIsMobile] = useState(false)
  const [tableHeight, setTableHeight] = useState(600)

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      const windowHeight = window.innerHeight
      const topOffset =
        document.getElementById('table-container')?.offsetTop || 0
      setTableHeight(windowHeight - topOffset - 40)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Data Fetching
  const { data: allSats = [], isLoading, isError } = useSatellites()

  // Filtered Data
  const satellites = useMemo(() => {
    let filtered = allSats

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((sat) => sat.objectType === selectedCategory)
    }

    // Apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (sat) =>
          sat.name.toLowerCase().includes(q) ||
          String(sat.noradCatId).includes(q)
      )
    }

    // Apply orbit code filters
    if (selectedOrbitCodes.length > 0) {
      filtered = filtered.filter((sat) =>
        selectedOrbitCodes.some((code) => sat.orbitCode === `{${code}}`)
      )
    }

    return filtered
  }, [allSats, searchQuery, selectedCategory, selectedOrbitCodes])

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
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Render States
  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState />
  if (satellites.length === 0) return <EmptyState />

  // Get Rows
  const rows = table.getRowModel().rows

  return (
    <div
      className='bg-[#020c1b] rounded-xl overflow-hidden border border-[#233554]/30'
      id='table-container'
    >
      <div className='w-full'>
        <TableHeader table={table} />
        <List
          height={tableHeight}
          itemCount={rows.length}
          itemSize={ROW_HEIGHT}
          width='100%'
          overscanCount={OVERSCAN_COUNT}
          className='scrollbar-thin scrollbar-thumb-[#233554] scrollbar-track-transparent'
        >
          {({ index, style }) => <TableRow row={rows[index]} style={style} />}
        </List>
      </div>
    </div>
  )
}

export default SatelliteTable
