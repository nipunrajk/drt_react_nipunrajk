import React, { useMemo, useEffect, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type Row,
} from '@tanstack/react-table'
import { FixedSizeList as List } from 'react-window'
import type { Satellite } from '../types'
import { useSatellites } from '../services'
import { useStore } from '../store/useStore'
import { Checkbox } from './ui/checkbox'

const ROW_HEIGHT = 52
const OVERSCAN_COUNT = 5
const MOBILE_BREAKPOINT = 768

const cleanOrbitCode = (code: string) => code?.replace(/[{}]/g, '') || code

const useTableColumns = (
  isMobile: boolean,
  setWarning: (show: boolean) => void
) => {
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
          const isMaxReached = selected.length >= 10

          const handleChange = (isChecked: boolean) => {
            if (isChecked && isMaxReached) {
              setWarning(true)
              setTimeout(() => setWarning(false), 3000)
              return
            }
            if (isChecked) {
              add(id)
            } else {
              remove(id)
            }
            setWarning(false)
          }

          return (
            <div className='flex items-center justify-center relative group'>
              <Checkbox
                checked={checked}
                onCheckedChange={handleChange}
                disabled={!checked && isMaxReached}
                className='data-[state=checked]:bg-[#64ffda] data-[state=checked]:border-[#64ffda] border-[#233554]'
              />
              {!checked && isMaxReached && (
                <div className='absolute bottom-full mb-2 hidden group-hover:block'>
                  <div className='bg-red-500 text-white text-xs rounded py-1 px-2 whitespace-nowrap'>
                    Maximum of 10 selections allowed
                  </div>
                  <div className='border-l-4 border-l-transparent border-t-4 border-t-red-500 border-r-4 border-r-transparent w-0 h-0 mx-auto' />
                </div>
              )}
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
    [selected, add, remove, setWarning]
  )
}

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

const LoadingState = () => (
  <div className='p-4 text-[#64ffda]'>Loading satellites…</div>
)
const ErrorState = () => (
  <div className='p-4 text-red-500'>Failed to load data.</div>
)
const EmptyState = () => (
  <div className='p-4 text-[#64ffda]'>No results found.</div>
)

interface SatelliteTableProps {
  searchQuery: string
  selectedCategories: string[]
  selectedOrbitCodes: string[]
  filteredSatellites: Satellite[]
}

const SatelliteTable: React.FC<SatelliteTableProps> = ({
  filteredSatellites,
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [tableHeight, setTableHeight] = useState(600)
  const [showWarning, setShowWarning] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])

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

  const { isLoading, isError } = useSatellites()

  const columns = useTableColumns(isMobile, setShowWarning)

  const table = useReactTable({
    data: filteredSatellites,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState />
  if (filteredSatellites.length === 0) return <EmptyState />

  const rows = table.getRowModel().rows

  return (
    <div className='space-y-2'>
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
    </div>
  )
}

export default SatelliteTable
