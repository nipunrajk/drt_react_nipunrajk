import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Satellite } from '../types'
import { fetchSatellites } from '../api'

export const useSatellites = (searchQuery: string) => {
  return useQuery<Satellite[], Error>({
    queryKey: ['satellites', searchQuery],
    queryFn: () => fetchSatellites(searchQuery),
    placeholderData: keepPreviousData,
  })
}
