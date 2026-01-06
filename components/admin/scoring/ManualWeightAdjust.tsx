'use client'

import { useEffect, useState } from 'react'
import { getScoreWeights } from '@/lib/api/scoringConfig'

interface WeightItem {
  name: string
  percentage: number
  color: string
}

interface ManualWeightAdjustProps {
  className?: string
  onRunSimulation?: () => void
}

export function ManualWeightAdjust({ className = '', onRunSimulation }: ManualWeightAdjustProps) {
  const [weights, setWeights] = useState<WeightItem[]>([
    { name: 'Safety', percentage: 35, color: 'bg-blue-500' },
    { name: 'Timeliness', percentage: 25, color: 'bg-green-500' },
    { name: 'Quality', percentage: 15, color: 'bg-yellow-500' },
    { name: 'Feedback', percentage: 15, color: 'bg-purple-500' },
    { name: 'Experience', percentage: 10, color: 'bg-orange-500' },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        setIsLoading(true)
        const scoreWeights = await getScoreWeights()
        
        setWeights([
          { name: 'Safety', percentage: scoreWeights.safety, color: 'bg-blue-500' },
          { name: 'Timeliness', percentage: scoreWeights.timeliness, color: 'bg-green-500' },
          { name: 'Quality', percentage: scoreWeights.quality, color: 'bg-yellow-500' },
          { name: 'Feedback', percentage: scoreWeights.feedback, color: 'bg-purple-500' },
          { name: 'Experience', percentage: scoreWeights.experience, color: 'bg-orange-500' },
        ])
      } catch (error) {
        // Keep default weights on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeights()
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Manual Weight Adjust</h2>
          <p className="text-sm text-gray-500 mt-1">Tweak score weightings and run simulations</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-2.5 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {weights.map((weight, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{weight.name}</span>
              <span className="text-sm font-semibold text-gray-900">{weight.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${weight.color} h-2.5 rounded-full transition-all duration-300`}
                style={{ width: `${weight.percentage}%` }}
              />
            </div>
          </div>
        ))}
        </div>
      )}

      <button
        onClick={onRunSimulation}
        className="w-full px-4 py-2 bg-[#0A376C] text-white rounded-lg font-medium hover:bg-[#082a56] transition-colors"
      >
        Run Simulation
      </button>
    </div>
  )
}
