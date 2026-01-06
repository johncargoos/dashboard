import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config';

export interface Driver {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  score: number | null;
  etaToPickup?: number | null;
  acceptanceRate: number;
  location: string;
}

export interface CreateDriverRequest {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  driverId?: string;
  licenseNumber?: string;
  carrierIdNumber?: string;
  address?: string;
  dateOfBirth?: string;
  driverType?: string;
  region?: string;
  preferredRoutes?: string;
  licenseExpiryDate?: string;
  licenseClass?: string;
  hazmatCertification?: string;
}

export interface CreateDriverResponse {
  message: string;
  driver: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    score: number | null;
  };
}

export interface DriverDetail {
  driver: {
    externalId: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    score: {
      current: number;
      tier: string;
      tierColor?: string;
      breakdown: {
        // Legacy format (v1.0)
        S?: number;
        T?: number;
        Q?: number;
        E?: number;
        F?: number;
        // New format (v2.0)
        safety?: { raw: number; weighted: number; weight: number };
        punctuality?: { raw: number; weighted: number; weight: number };
        quality?: { raw: number; weighted: number; weight: number };
        experience?: { raw: number; weighted: number; weight: number; months?: number };
      };
      updatedAt: string;
      formulaVersion: string;
    };
    stats: {
      completedDeliveries: number;
      totalMileage: number;
      onTimeStreak?: number;
      avgStars?: number;
      lastTripAt: string | null;
      acceptanceRate?: number;
      // CPS v2.0 stats
      accidentFreeTrips?: number;     // Percentage
      onTimeDeliveries?: number;      // Percentage
      damageFreeDeliveries?: number;  // Percentage
      experienceMonths?: number;
      totalDeliveries?: number;
      avgRating?: number;
    };
    createdAt: string;
    updatedAt: string;
  };
  latestScore: any;
  // CPS v2.0 additional data
  score?: any;           // Full CPS score object
  stats?: any;           // Full stats object
  infractions?: any[];   // Active infractions
  scoreHistory?: any[];  // Score history
}

/**
 * Get all drivers
 */
export async function getDrivers(): Promise<Driver[]> {
  const url = `${API_BASE_URL}/drivers`
  const headers = getDefaultHeaders()
  
  console.log('📡 Fetching drivers from:', url)
  console.log('🔑 Headers:', { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : 'none' })
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    console.log('📥 Response status:', response.status, response.statusText)
    
    return handleResponse<Driver[]>(response);
  } catch (error) {
    console.error('❌ Fetch error:', error)
    throw error
  }
}

/**
 * Get a specific driver by ID
 */
export async function getDriverById(id: string): Promise<DriverDetail> {
  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse<DriverDetail>(response);
}

/**
 * Create a new driver
 */
export async function createDriver(data: CreateDriverRequest): Promise<CreateDriverResponse> {
  const response = await fetch(`${API_BASE_URL}/drivers`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<CreateDriverResponse>(response);
}

/**
 * Update a driver
 */
export async function updateDriver(id: string, data: Partial<CreateDriverRequest>): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/drivers/${id}/update`, {
    method: 'PUT',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Delete a driver
 */
export async function deleteDriver(id: string): Promise<{ message: string }> {
  const encodedId = encodeURIComponent(id); // Encode email addresses properly
  const response = await fetch(`${API_BASE_URL}/drivers/${encodedId}`, {
    method: 'DELETE',
    headers: getDefaultHeaders(),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Get driver stats
 */
export async function getDriverStats(id: string): Promise<{
  completedDeliveries: number;
  totalMileage: number;
  onTimeStreak: number;
  avgStars: number;
  lastTripAt: string | null;
}> {
  const response = await fetch(`${API_BASE_URL}/drivers/${id}/stats`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse(response);
}

/**
 * Get driver score (CPS v2.0 format)
 * Returns percentage-based score with breakdown
 */
export async function getDriverScore(id: string): Promise<{
  finalScore: number;        // 0-100 percentage
  tier: string;
  tierColor: string;
  breakdown: {
    safety: { raw: number; weighted: number; weight: number };
    punctuality: { raw: number; weighted: number; weight: number };
    quality: { raw: number; weighted: number; weight: number };
    experience: { raw: number; weighted: number; weight: number; months: number };
  };
  decayAdjustment: number;
  baseCPS: number;
  formulaVersion: string;
  calculatedAt?: string;
  stats?: {
    accidentFreeTrips: number;
    onTimeDeliveries: number;
    damageFreeDeliveries: number;
    experienceMonths: number;
    totalDeliveries: number;
    totalMileage: number;
    avgRating: number;
  };
  infractionsCount?: number;
  isNewDriver?: boolean;
}> {
  const encodedId = encodeURIComponent(id);
  const response = await fetch(`${API_BASE_URL}/drivers/${encodedId}/score`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse(response);
}

