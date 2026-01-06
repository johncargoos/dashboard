import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config';

export interface Load {
  id?: string;
  loadNo: string;
  company: string;
  driver?: string | null;  // Driver name (from driverName field)
  driverId?: string;        // Driver email (from driverExternalId field) - primary identifier
  score?: number | null;
  pickupLocation: string;
  deliveryLocation: string;
  status: 'pending' | 'in-transit' | 'completed';
  pickup?: {
    state?: string;
    city?: string;
    zip?: string;
    address?: string;
    contact?: string;
    phone?: string;
    date?: string | Date;
    time?: string;
  };
  delivery?: {
    state?: string;
    city?: string;
    zip?: string;
    address?: string;
    contact?: string;
    phone?: string;
    date?: string | Date;
    time?: string;
  };
  shipment?: {
    pieces?: number;
    weight?: number;
    commodity?: string;
    specialInstructions?: string;
  };
  rates?: {
    rateConfirmationNo?: string;
    totalRate?: number;
    fuelSurcharge?: number;
  };
  equipmentType?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateLoadRequest {
  loadNo: string;
  company: string;
  driverId?: string;
  pickupLocation: string;
  deliveryLocation: string;
  status?: 'pending' | 'in-transit' | 'completed';
  pickupState?: string;
  pickupCity?: string;
  pickupZip?: string;
  pickupAddress?: string;
  pickupContact?: string;
  pickupPhone?: string;
  pickupDate?: string;
  pickupTime?: string;
  deliveryState?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  deliveryAddress?: string;
  deliveryContact?: string;
  deliveryPhone?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  pieces?: number;
  weight?: number;
  commodity?: string;
  specialInstructions?: string;
  equipmentType?: string;
  rateConfirmationNo?: string;
  totalRate?: number;
  fuelSurcharge?: number;
}

export interface LoadsResponse {
  loads: Load[];
  total: number;
}

export interface CreateLoadResponse {
  message: string;
  load: Load;
}

/**
 * Get all loads
 */
export async function getLoads(params?: {
  status?: 'pending' | 'in-transit' | 'completed';
  driverId?: string;
  limit?: number;
  skip?: number;
}): Promise<LoadsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.driverId) queryParams.append('driverId', params.driverId);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.skip) queryParams.append('skip', params.skip.toString());

  const url = `${API_BASE_URL}/loads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse<LoadsResponse>(response);
}

/**
 * Get a specific load by ID
 */
export async function getLoadById(id: string): Promise<{ load: Load }> {
  const response = await fetch(`${API_BASE_URL}/loads/${id}`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse<{ load: Load }>(response);
}

/**
 * Create a new load
 */
export async function createLoad(data: CreateLoadRequest): Promise<CreateLoadResponse> {
  const response = await fetch(`${API_BASE_URL}/loads`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<CreateLoadResponse>(response);
}

/**
 * Update a load
 */
export async function updateLoad(id: string, data: Partial<CreateLoadRequest>): Promise<{ message: string; load: Load }> {
  const response = await fetch(`${API_BASE_URL}/loads/${id}`, {
    method: 'PUT',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<{ message: string; load: Load }>(response);
}

/**
 * Delete a load
 */
export async function deleteLoad(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/loads/${id}`, {
    method: 'DELETE',
    headers: getDefaultHeaders(),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Get loads assigned to a specific driver
 */
export async function getLoadsByDriver(driverId: string): Promise<{
  loads: Load[];
  trips: any[];
  driver: {
    id: string;
    name: string;
    email: string;
    score: number | null;
  };
}> {
  const response = await fetch(`${API_BASE_URL}/loads/driver/${driverId}`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse(response);
}

