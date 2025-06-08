import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Satellite } from '../types'
import { fetchSatellites } from '../api'

/**
 * Custom hook to fetch and manage satellite data
 * Includes caching, error handling, and loading states
 */
export const useSatellites = () => {
  return useQuery<Satellite[], Error>({
    queryKey: ['satellites'],
    queryFn: () => fetchSatellites(),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  })
}
