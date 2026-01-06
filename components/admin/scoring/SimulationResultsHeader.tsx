'use client'

import { TrendUpIcon } from '../TrendIcons'

interface SimulationResultsHeaderProps {
  currentAccuracy: number
  projectedAccuracy: number
  accuracyDelta: number
  className?: string
}

export function SimulationResultsHeader({
  currentAccuracy,
  projectedAccuracy,
  accuracyDelta,
  className = ''
}: SimulationResultsHeaderProps) {
  const isPositive = accuracyDelta >= 0

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Simulation Results</h2>
      <p className="text-sm text-gray-500 mb-6">Analysis of proposed weight changes on historical data</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Accuracy */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Current Accuracy</p>
          <p className="text-3xl font-bold text-gray-900">{currentAccuracy}%</p>
        </div>

        {/* Projected Accuracy */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Projected Accuracy</p>
          <p className="text-3xl font-bold text-gray-900">{projectedAccuracy}%</p>
        </div>

        {/* Accuracy Delta */}
        <div className={`text-center p-4 rounded-lg ${
          isPositive ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <p className="text-sm text-gray-600 mb-1">Accuracy Delta</p>
          <div className="flex items-center justify-center gap-2">
            {isPositive && (
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <TrendUpIcon className="text-green-600" />
              </div>
            )}
            <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{accuracyDelta}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
