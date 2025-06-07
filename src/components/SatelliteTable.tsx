import React, { useMemo } from 'react'
import axios from 'axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
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

interface SatelliteTableProps {
  searchQuery: string
}

const fetchSatellites = async (searchQuery: string) => {
  const params: Record<string, any> = {
    attributes: [
      'noradCatId',
      'name',
      'orbitCode',
      'objectType',
      'countryCode',
      'launchDate',
    ].join(','),
  }
  if (searchQuery) {
    // we’ll pass searchQuery as name OR noradCatId partial match on backend
    params.name = searchQuery
    params.noradCatId = searchQuery
  }
  const response = await axios.get<{ data: Satellite[] }>('/v1/satellites', {
    params,
  })
  return response.data.data
}

const SatelliteTable: React.FC<SatelliteTableProps> = ({ searchQuery }) => {
  // 1) fetch data
  const {
    data: satellites = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['satellites', searchQuery],
    queryFn: () => fetchSatellites(searchQuery),
    placeholderData: keepPreviousData,
  })

  // 2) table columns
  const columns = useMemo<ColumnDef<Satellite>[]>(
    () => [
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
      { accessorKey: 'orbitCode', header: 'Orbit Code' },
      { accessorKey: 'objectType', header: 'Object Type' },
      { accessorKey: 'countryCode', header: 'Country' },
      {
        accessorKey: 'launchDate',
        header: 'Launch Date',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
    ],
    []
  )

  // 3) sorting state
  const [sorting, setSorting] = React.useState<SortingState>([])

  // 4) create table
  const table = useReactTable({
    data: satellites,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // 5) loading / error / empty
  if (isLoading) return <div className='p-4'>Loading satellites…</div>
  if (isError)
    return <div className='p-4 text-red-600'>Failed to load data.</div>
  if (satellites.length === 0)
    return <div className='p-4'>No results found.</div>

  // 6) virtualized list of rows
  const rows = table.getRowModel().rows
  const rowHeight = 48

  return (
    <div className='border rounded'>
      {/* Header */}
      <div className='flex bg-gray-100 font-semibold'>
        {table.getHeaderGroups()[0].headers.map((header) => (
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

      {/* Virtualized body */}
      <List
        height={Math.min(rows.length * rowHeight, 600)}
        itemCount={rows.length}
        itemSize={rowHeight}
        width='100%'
      >
        {({ index, style }) => {
          const row = rows[index]
          return (
            <div
              style={style}
              className='flex border-b last:border-0 hover:bg-gray-50'
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className='flex-1 p-2'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          )
        }}
      </List>
    </div>
  )
}

export default SatelliteTable
