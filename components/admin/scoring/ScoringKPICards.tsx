'use client'

import { useEffect, useState } from 'react'
import { TrendUpIcon } from '../TrendIcons'
import { getDrivers } from '@/lib/api/drivers'
import { getCarriers } from '@/lib/api/carriers'
import { getTrips } from '@/lib/api/trips'

interface ScoringKPICardProps {
  title: string
  value: string | number
  trend?: 'up' | 'down' | null
}

function ScoringKPICard({ title, value, trend = 'up' }: ScoringKPICardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {trend && (
          <div className={`flex items-center justify-center w-6 h-6 rounded ${
            trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
          }`}>
            <TrendUpIcon />
          </div>
        )}
      </div>
    </div>
  )
}

interface ScoringKPICardsProps {
  className?: string
}

export function ScoringKPICards({ className = '' }: ScoringKPICardsProps) {
  const [stats, setStats] = useState({
    totalDriversScored: 0,
    totalActiveCarriers: 0,
    dailyTripsProcessed: 0,
    averageCPS: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all data in parallel
        const [drivers, carriers, trips] = await Promise.all([
          getDrivers(),
          getCarriers(),
          getTrips(),
        ])

        // Calculate stats
        const totalDriversScored = drivers.length
        const totalActiveCarriers = carriers.carriers.filter(c => c.status === 'active').length
        
        // Count trips processed today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dailyTripsProcessed = trips.filter(trip => {
          const tripDate = trip.createdAt ? new Date(trip.createdAt) : null
          return tripDate && tripDate >= today
        }).length

        // Calculate average CPS from drivers
        const driversWithScores = drivers.filter(d => d.score !== null && d.score !== undefined)
        const averageCPS = driversWithScores.length > 0
          ? Math.round(driversWithScores.reduce((sum, d) => sum + (d.score || 0), 0) / driversWithScores.length)
          : 0

        setStats({
          totalDriversScored,
          totalActiveCarriers,
          dailyTripsProcessed,
          averageCPS,
        })
      } catch (error) {
        // Keep default values on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <ScoringKPICard 
        title="Total Drivers Scored" 
        value={stats.totalDriversScored} 
        trend="up"
      />
      <ScoringKPICard 
        title="Total Active Carriers" 
        value={stats.totalActiveCarriers} 
        trend="up"
      />
      <ScoringKPICard 
        title="Daily Trips Processed" 
        value={stats.dailyTripsProcessed} 
        trend="up"
      />
      <ScoringKPICard 
        title="Average CPS Score Today" 
        value={stats.averageCPS} 
        trend="up"
      />
    </div>
  )
}
