import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Satellite } from '../types'
import { fetchSatellites } from '../api'

export const useSatellites = () => {
  return useQuery<Satellite[], Error>({
    queryKey: ['satellites'],
    queryFn: () => fetchSatellites(),
    placeholderData: keepPreviousData,
  })
}
