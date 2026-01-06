import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config'

export interface Carrier {
  id: string
  name: string
  email?: string
  phone?: string
  companyName?: string
  companyId?: string
  status?: 'active' | 'inactive' | 'pending'
  createdAt?: string
  updatedAt?: string
  driversCount?: number // Backend returns driversCount
  driverCount?: number // Alias for compatibility
  totalScore?: number
  averageScore?: number
}

export interface CreateCarrierRequest {
  companyName: string
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface CreateCarrierResponse {
  message: string
  carrier?: Carrier
}

export interface CarriersResponse {
  carriers: Carrier[]
  total: number
}

/**
 * Get all carriers
 * Backend returns: array of carriers with { id, email, name, companyName, status, driversCount, createdAt }
 */
export async function getCarriers(): Promise<CarriersResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/carriers`, {
      method: 'GET',
      headers: getDefaultHeaders(),
    })

    // Backend returns an array directly, not wrapped in an object
    const carriersArray = await handleResponse<Carrier[]>(response)
    
    // Ensure it's an array
    const carriers = Array.isArray(carriersArray) ? carriersArray : []
    
    // Transform backend format to match our interface
    const transformedCarriers = carriers.map(c => ({
      id: c.id || c.email || '',
      name: c.name || '',
      email: c.email,
      companyName: c.companyName,
      status: c.status || 'active',
      driversCount: c.driversCount || 0,
      driverCount: c.driversCount || 0, // Alias for compatibility
      createdAt: c.createdAt,
    }))
    
    return {
      carriers: transformedCarriers,
      total: transformedCarriers.length,
    }
  } catch (error: any) {
    // Re-throw error to be handled by caller
    throw error
  }
}

/**
 * Get a specific carrier by ID
 */
export async function getCarrierById(id: string): Promise<Carrier> {
  const encodedId = encodeURIComponent(id)
  const response = await fetch(`${API_BASE_URL}/carriers/${encodedId}`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  })

  return handleResponse<Carrier>(response)
}

/**
 * Create a new carrier account
 */
export async function createCarrier(data: CreateCarrierRequest): Promise<CreateCarrierResponse> {
  const response = await fetch(`${API_BASE_URL}/carriers`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  })

  return handleResponse<CreateCarrierResponse>(response)
}

/**
 * Update a carrier
 */
export async function updateCarrier(
  id: string,
  data: Partial<CreateCarrierRequest>
): Promise<{ message: string }> {
  const encodedId = encodeURIComponent(id)
  const response = await fetch(`${API_BASE_URL}/carriers/${encodedId}`, {
    method: 'PUT',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  })

  return handleResponse<{ message: string }>(response)
}

/**
 * Delete a carrier
 */
export async function deleteCarrier(id: string): Promise<{ message: string }> {
  const encodedId = encodeURIComponent(id)
  const response = await fetch(`${API_BASE_URL}/carriers/${encodedId}`, {
    method: 'DELETE',
    headers: getDefaultHeaders(),
  })

  return handleResponse<{ message: string }>(response)
}

/**
 * Get carrier statistics (admin dashboard)
 * Calculated from /carriers endpoint
 */
export async function getCarrierStats(): Promise<{
  totalCarriers: number
  activeCarriers: number
  inactiveCarriers: number
  pendingCarriers: number
}> {
  try {
    const carriersData = await getCarriers()
    const carriers = carriersData.carriers

    return {
      totalCarriers: carriers.length,
      activeCarriers: carriers.filter(c => c.status === 'active').length,
      inactiveCarriers: carriers.filter(c => c.status === 'inactive').length,
      pendingCarriers: carriers.filter(c => c.status === 'pending').length,
    }
  } catch (error) {
    // Return default values on error
    return {
      totalCarriers: 0,
      activeCarriers: 0,
      inactiveCarriers: 0,
      pendingCarriers: 0,
    }
  }
}
