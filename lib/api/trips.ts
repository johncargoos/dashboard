import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config'

export interface Trip {
  id: string
  tripId?: string
  tripNumber?: string
  frameId?: string
  loadNo?: string
  cargoType?: string
  companyName?: string
  distanceMiles?: number
  mileageMiles?: number
  duration?: number
  stops?: number
  pickupCity?: string
  pickupTime?: string
  deliveryCity?: string
  deliveryTime?: string
  cargoWeight?: string
  trailerType?: string
  status?: string
  state?: string
  driverId?: string
  driver_id?: string
  driverEmail?: string
  driverExternalId?: string
  verified?: boolean
  createdAt?: string
  updatedAt?: string
  pickup?: any
  delivery?: any
  shipment?: any
  rates?: any
}

/**
 * Get all trips (includes completed trips and assigned loads)
 * Backend returns: array of trips from both trips collection and loads collection
 */
export async function getTrips(): Promise<Trip[]> {
  const response = await fetch(`${API_BASE_URL}/trips`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  })

  return handleResponse<Trip[]>(response)
}

/**
 * Get trips by driver ID
 */
export async function getTripsByDriver(driverId: string): Promise<Trip[]> {
  const encodedId = encodeURIComponent(driverId)
  const response = await fetch(`${API_BASE_URL}/trips/${encodedId}/history`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  })

  return handleResponse<Trip[]>(response)
}

/**
 * Get a specific trip by ID
 */
export async function getTripById(id: string): Promise<Trip> {
  const encodedId = encodeURIComponent(id)
  const response = await fetch(`${API_BASE_URL}/trips/${encodedId}`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  })

  return handleResponse<Trip>(response)
}
