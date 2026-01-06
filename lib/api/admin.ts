import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config'
import { getCarriers } from './carriers'
import { getDrivers } from './drivers'

export interface AdminStats {
  totalCarriers: number
  activeCarriers: number
  totalDrivers: number
  activeDrivers: number
  totalAnomalies: number
  openAnomalies: number
  resolvedAnomalies: number
  totalTickets: number
  openTickets: number
  waitingOnCarrierTickets: number
  averageCPS: number
  cpsTrend?: 'up' | 'down' | null
  anomalyTrend?: 'up' | 'down' | null
  ticketTrend?: 'up' | 'down' | null
}

export interface ScoreTierDistribution {
  tier: string
  range: string
  count: number
  percentage: number
  color: string
}

export interface AdminDashboardData {
  stats: AdminStats
  scoreTierDistribution: ScoreTierDistribution[]
  topDrivers: any[]
  carriersOnboarding: any[]
}

/**
 * Get admin dashboard overview statistics
 * Calculated from existing /carriers and /drivers endpoints
 */
export async function getAdminStats(): Promise<AdminStats> {
  let carriers: any[] = []
  let drivers: any[] = []

  // Try to fetch carriers (may fail with 403)
  try {
    const carriersData = await getCarriers()
    carriers = carriersData.carriers || []
  } catch (error) {
    // If carriers fails, continue with empty array
    carriers = []
  }

  // Always try to fetch drivers (this is critical for averageCPS)
  try {
    drivers = await getDrivers()
  } catch (error) {
    // If drivers also fails, use empty array
    drivers = []
  }

  const totalCarriers = carriers.length
  const activeCarriers = carriers.filter(c => c.status === 'active').length

  const totalDrivers = drivers.length
  const activeDrivers = drivers.filter(d => d.score && d.score > 0).length

  // Calculate average CPS from drivers (critical - this should always work if drivers are available)
  const driversWithScores = drivers.filter(d => d.score !== null && d.score !== undefined && d.score > 0)
  const averageCPS = driversWithScores.length > 0
    ? Math.round(driversWithScores.reduce((sum, d) => sum + (d.score || 0), 0) / driversWithScores.length)
    : 0

  return {
    totalCarriers,
    activeCarriers,
    totalDrivers,
    activeDrivers,
    totalAnomalies: 0,
    openAnomalies: 0,
    resolvedAnomalies: 0,
    totalTickets: 0,
    openTickets: 0,
    waitingOnCarrierTickets: 0,
    averageCPS,
    cpsTrend: null,
    anomalyTrend: null,
    ticketTrend: null,
  }
}

/**
 * Get score tier distribution (for tier breakdown chart)
 * Calculated from /drivers endpoint
 */
export async function getScoreTierDistribution(): Promise<ScoreTierDistribution[]> {
  try {
    const drivers = await getDrivers()

    // Define tier thresholds (matching backend config: 800, 740, 670, 580)
    const tiers = [
      { min: 800, name: 'Exceptional', range: '800+', color: 'green' },
      { min: 740, name: 'Very Good', range: '740-799', color: 'blue' },
      { min: 670, name: 'Good', range: '670-739', color: 'yellow' },
      { min: 580, name: 'Fair', range: '580-669', color: 'orange' },
    ]

    // Count drivers in each tier
    const tierCounts: { [key: string]: number } = {}
    tiers.forEach(tier => {
      tierCounts[tier.name] = 0
    })
    tierCounts['High Risk'] = 0

    drivers.forEach(driver => {
      const score = driver.score || 350
      let tierName = 'High Risk'
      
      // Find matching tier (check from highest to lowest)
      for (const tier of tiers) {
        if (score >= tier.min) {
          tierName = tier.name
          break
        }
      }
      
      tierCounts[tierName] = (tierCounts[tierName] || 0) + 1
    })

    const total = drivers.length

    // Build distribution array (sorted from highest to lowest tier)
    const distribution: ScoreTierDistribution[] = tiers.map(tier => ({
      tier: tier.name,
      range: tier.range,
      count: tierCounts[tier.name] || 0,
      percentage: total > 0 ? Math.round(((tierCounts[tier.name] || 0) / total) * 100) : 0,
      color: tier.color,
    }))

    // Add High Risk tier
    distribution.push({
      tier: 'High Risk',
      range: '0-579',
      count: tierCounts['High Risk'],
      percentage: total > 0 ? Math.round((tierCounts['High Risk'] / total) * 100) : 0,
      color: 'red',
    })

    return distribution
  } catch (error: any) {
    // Return empty distribution on error
    return []
  }
}

/**
 * Get full admin dashboard data (combined endpoint for efficiency)
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  })

  return handleResponse<AdminDashboardData>(response)
}
