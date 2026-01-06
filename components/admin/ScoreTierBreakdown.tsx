'use client'

import { useEffect, useState } from 'react'
import { getScoreTierDistribution } from '@/lib/api/admin'

interface TierData {
  name: string
  range: string
  count: number
  percentage: number
  color: string
}

interface ScoreTierBreakdownProps {
  className?: string
}

// Default tiers in case API fails
const defaultTiers: TierData[] = [
  { name: 'Exceptional', range: '760-800', count: 0, percentage: 0, color: '#10b981' },
  { name: 'Very Good', range: '680-759', count: 0, percentage: 0, color: '#14b8a6' },
  { name: 'Good', range: '640-679', count: 0, percentage: 0, color: '#f59e0b' },
  { name: 'Fair', range: '580-639', count: 0, percentage: 0, color: '#f97316' },
  { name: 'High Risk', range: '<580', count: 0, percentage: 0, color: '#ef4444' },
]

export function ScoreTierBreakdown({ className = '' }: ScoreTierBreakdownProps) {
  const [tiers, setTiers] = useState<TierData[]>(defaultTiers)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        setIsLoading(true)
        try {
          const data = await getScoreTierDistribution()
          if (data && data.length > 0) {
            setTiers(data)
          }
        } catch (apiError) {
          // If endpoint doesn't exist, calculate from drivers
          try {
            const { getDrivers } = await import('@/lib/api/drivers')
            const drivers = await getDrivers()
            
            // Calculate tier distribution from driver scores
            const tierCounts = {
              'Exceptional': { count: 0, range: '760-800', color: '#10b981' },
              'Very Good': { count: 0, range: '680-759', color: '#14b8a6' },
              'Good': { count: 0, range: '640-679', color: '#f59e0b' },
              'Fair': { count: 0, range: '580-639', color: '#f97316' },
              'High Risk': { count: 0, range: '<580', color: '#ef4444' },
            }

            drivers.forEach(driver => {
              const score = driver.score || 0
              if (score >= 760) tierCounts['Exceptional'].count++
              else if (score >= 680) tierCounts['Very Good'].count++
              else if (score >= 640) tierCounts['Good'].count++
              else if (score >= 580) tierCounts['Fair'].count++
              else tierCounts['High Risk'].count++
            })

            const total = drivers.length
            const calculatedTiers = Object.entries(tierCounts).map(([name, data]) => ({
              name,
              range: data.range,
              count: data.count,
              percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
              color: data.color,
            }))

            setTiers(calculatedTiers)
          } catch (calcError) {
            // Keep default tiers on error
          }
        }
      } catch (error) {
        // Keep default tiers on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchTiers()
  }, [])

  // Find max count for relative width calculation
  const maxCount = Math.max(...tiers.map(t => t.count), 1)

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Score Tier Breakdown</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`} style={{ padding: '16px' }}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 leading-5">Score Tier Breakdown</h2>
      </div>
      
      <div className="space-y-3">
        {tiers.map((tier, index) => {
          const width = maxCount > 0 ? (tier.count / maxCount) * 100 : 0
          return (
            <div key={tier.name} className="relative">
              <div className="flex items-center" style={{ height: '42px' }}>
                <div 
                  className="rounded transition-all relative overflow-hidden"
                  style={{ 
                    width: `${Math.max(width, 3)}%`,
                    height: '42px',
                    backgroundColor: tier.color,
                    minWidth: tier.count > 0 ? '80px' : '0px'
                  }}
                >
                  {tier.count > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white" style={{ padding: '0 10px', fontSize: '12px', lineHeight: '16px' }}>
                        {tier.count} drivers
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
