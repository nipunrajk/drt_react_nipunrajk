import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Satellite } from '../types'
import { fetchSatellites } from '../api'

export const useSatellites = () => {
  return useQuery<Satellite[], Error>({
    queryKey: ['satellites'],
    queryFn: () => fetchSatellites(),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Disable automatic refetch on window focus
    retry: 2, // Retry failed requests twice
  })
}
