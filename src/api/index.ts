import axios from 'axios'
import type { Satellite } from '../types'

interface SatelliteResponse {
  data: Satellite[]
  statusCode: number
  message: string
}

export const fetchSatellites = async (searchQuery: string) => {
  const params = {
    attributes: [
      'noradCatId',
      'name',
      'orbitCode',
      'objectType',
      'countryCode',
      'launchDate',
    ].join(','),
  }
  const { data } = await axios.get<SatelliteResponse>('/v1/satellites', {
    params,
  })
  return data.data
}
