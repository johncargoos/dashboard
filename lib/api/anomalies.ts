import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config'

export interface Anomaly {
  id: string
  anomalyId: string
  type: string
  severity: 'high' | 'medium' | 'low'
  status: 'open' | 'in-review' | 'resolved'
  dateTime: string
  carrier?: {
    id: string
    name: string
  }
  driver?: {
    id: string
    name: string
  }
  scope?: string
}

export interface AnomaliesResponse {
  anomalies: Anomaly[]
  total: number
}

/**
 * Get all anomalies
 */
export async function getAnomalies(): Promise<AnomaliesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/anomalies`, {
      method: 'GET',
      headers: getDefaultHeaders(),
    })

    // If endpoint doesn't exist or has CORS issues, return empty array
    if (!response || !response.ok) {
      return { anomalies: [], total: 0 }
    }

    const anomalies = await handleResponse<Anomaly[]>(response)
    
    return {
      anomalies: anomalies || [],
      total: anomalies?.length || 0,
    }
  } catch (error: any) {
    // Handle CORS errors and network failures gracefully
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      return { anomalies: [], total: 0 }
    }
    // Re-throw other errors
    throw error
  }
}

/**
 * Get anomalies summary (for overview)
 */
export async function getAnomaliesSummary(limit: number = 5): Promise<Anomaly[]> {
  try {
    const data = await getAnomalies()
    return data.anomalies.slice(0, limit)
  } catch (error: any) {
    // Silently handle errors - endpoint doesn't exist yet
    return []
  }
}
