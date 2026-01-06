import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config'

export interface LeaderboardEntry {
  rank: number
  driverId: string
  driverName: string
  carrierName?: string
  score: number
  tier: string
  tierColor?: string
  stats?: {
    completedDeliveries: number
    totalMileage: number
    onTimeStreak?: number
    avgStars?: number
    acceptanceRate?: number
  }
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[]
  total: number
  page?: number
  limit?: number
}

export interface LeaderboardFilters {
  limit?: number
  offset?: number
  sortBy?: 'score' | 'completedDeliveries' | 'totalMileage'
  order?: 'asc' | 'desc'
  tier?: string
  carrierId?: string
}

/**
 * Get driver leaderboard
 */
export async function getLeaderboard(
  filters?: LeaderboardFilters
): Promise<LeaderboardResponse> {
  const params = new URLSearchParams()
  
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.offset) params.append('offset', filters.offset.toString())
  if (filters?.sortBy) params.append('sortBy', filters.sortBy)
  if (filters?.order) params.append('order', filters.order)
  if (filters?.tier) params.append('tier', filters.tier)
  if (filters?.carrierId) params.append('carrierId', filters.carrierId)

  const queryString = params.toString()
  const url = `${API_BASE_URL}/leaderboard${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url, {
    method: 'GET',
    headers: getDefaultHeaders(),
  })

  return handleResponse<LeaderboardResponse>(response)
}

/**
 * Get top drivers (shortcut for top N drivers)
 */
export async function getTopDrivers(limit: number = 10): Promise<LeaderboardEntry[]> {
  const result = await getLeaderboard({ limit, sortBy: 'score', order: 'desc' })
  return result.entries
}

/**
 * Get leaderboard statistics
 */
export async function getLeaderboardStats(): Promise<{
  totalDrivers: number
  averageScore: number
  topScore: number
  tierDistribution: {
    tier: string
    count: number
    percentage: number
  }[]
}> {
  const response = await fetch(`${API_BASE_URL}/leaderboard/stats`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  })

  return handleResponse(response)
}
