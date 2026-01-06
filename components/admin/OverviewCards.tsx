'use client'

import { useEffect, useState } from 'react'
import { getAdminStats } from '@/lib/api/admin'

interface OverviewCardProps {
  title: string
  value: string | number
  description: string
  trend?: 'up' | 'down' | null
}

const TrendUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3L12 7M12 7H9M12 7V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TrendDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 13L4 9M4 9H7M4 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function OverviewCard({ title, value, description, trend }: OverviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100" style={{ padding: '24px' }}>
      <div className="flex flex-col gap-0">
        <div className="flex items-start justify-between mb-0">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 leading-5">{title}</h3>
              {trend && (
                <div className="flex items-center justify-center w-4 h-4">
                  {trend === 'up' ? <TrendUpIcon /> : <TrendDownIcon />}
                </div>
              )}
            </div>
            <p className="text-xs font-normal text-gray-600 mb-0" style={{ marginTop: '6px' }}>{description}</p>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 leading-9 mt-3">{value}</p>
      </div>
    </div>
  )
}

interface OverviewCardsProps {
  className?: string
}

export function OverviewCards({ className = '' }: OverviewCardsProps) {
  const [stats, setStats] = useState({
    totalCarriers: 0,
    activeCarriers: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    averageCPS: 0,
    openAnomalies: 0,
    openTickets: 0,
    waitingOnCarrierTickets: 0,
    anomalyTrend: null as 'up' | 'down' | null,
    ticketTrend: null as 'up' | 'down' | null,
    cpsTrend: null as 'up' | 'down' | null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        // Fetch admin stats which includes carriers and drivers
        const data = await getAdminStats()
        setStats({
          totalCarriers: data.totalCarriers || 0,
          activeCarriers: data.activeCarriers || 0,
          totalDrivers: data.totalDrivers || 0,
          activeDrivers: data.activeDrivers || 0,
          averageCPS: Math.round(data.averageCPS || 0),
          openAnomalies: data.openAnomalies || 0,
          openTickets: data.openTickets || 0,
          waitingOnCarrierTickets: data.waitingOnCarrierTickets || 0,
          anomalyTrend: data.anomalyTrend || null,
          ticketTrend: data.ticketTrend || null,
          cpsTrend: data.cpsTrend || null,
        })
      } catch (error) {
        // Keep default values on error
        setStats({
          totalCarriers: 0,
          activeCarriers: 0,
          totalDrivers: 0,
          activeDrivers: 0,
          averageCPS: 0,
          openAnomalies: 0,
          openTickets: 0,
          waitingOnCarrierTickets: 0,
          anomalyTrend: null,
          ticketTrend: null,
          cpsTrend: null,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100" style={{ padding: '24px' }}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="h-9 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      <OverviewCard 
        title="Open Anomalies" 
        value={stats.openAnomalies} 
        description="Need review"
        trend={stats.anomalyTrend || 'up'}
      />
      <OverviewCard 
        title="Open Tickets" 
        value={stats.openTickets} 
        description="Support & disputes"
        trend={stats.ticketTrend || 'up'}
      />
      <OverviewCard 
        title="Waiting on Carrier" 
        value={stats.waitingOnCarrierTickets} 
        description="Tickets waiting on evidence"
        trend={stats.ticketTrend || 'up'}
      />
      <OverviewCard 
        title="Avg CPS (All Drivers)" 
        value={stats.averageCPS} 
        description="Last 24 hours"
      />
    </div>
  )
}
