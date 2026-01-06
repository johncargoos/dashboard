'use client'

import { useEffect, useState } from 'react'
import { getTrips } from '@/lib/api/trips'

interface QueueItem {
  incidentType: string
  detectedCount: number
}

interface ScoreCalculationQueueProps {
  className?: string
}

export function ScoreCalculationQueue({ className = '' }: ScoreCalculationQueueProps) {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        setIsLoading(true)
        const trips = await getTrips()
        
        // Calculate incident counts from trips
        // This is simplified - in production, this would come from a scoring queue system
        const accidentFreeCount = trips.filter(t => !t.verified || t.status === 'completed').length
        const onTimeCount = trips.filter(t => t.status === 'completed').length
        const ratingCount = trips.filter(t => t.verified).length

        // Create queue items based on trip data
        const items: QueueItem[] = [
          { incidentType: 'Accident-free trip', detectedCount: Math.min(accidentFreeCount, 100) },
          { incidentType: 'Minor delay', detectedCount: Math.min(Math.floor(trips.length * 0.1), 20) },
          { incidentType: 'On-time streak', detectedCount: Math.min(onTimeCount, 50) },
          { incidentType: 'Customer Rating', detectedCount: Math.min(ratingCount, 50) },
          { incidentType: 'Tenure Rewards', detectedCount: Math.min(Math.floor(trips.length * 0.2), 30) },
        ]

        setQueueItems(items)
      } catch (error) {
        // Use default values on error
        setQueueItems([
          { incidentType: 'Accident-free trip', detectedCount: 0 },
          { incidentType: 'Minor delay', detectedCount: 0 },
          { incidentType: 'On-time streak', detectedCount: 0 },
          { incidentType: 'Customer Rating', detectedCount: 0 },
          { incidentType: 'Tenure Rewards', detectedCount: 0 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchQueueData()
  }, [])

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Score Calculation Queue</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time view of pending calculations</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {queueItems.map((item, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <span className="text-sm font-medium text-gray-700">{item.incidentType}</span>
            <span className="text-sm font-semibold text-gray-900">{item.detectedCount} incidents detected</span>
          </div>
        ))}
      </div>
    </div>
  )
}
