'use client'

interface SimulationParameters {
  dataRange: string
  totalEvents: number
  driversAnalyzed: number
  simulationTime: number
}

interface WeightChange {
  name: string
  current: number
  proposed: number
  delta: number
}

interface SimulationDetailsProps {
  params: SimulationParameters
  weightChanges: WeightChange[]
  className?: string
}

export function SimulationDetails({ params, weightChanges, className = '' }: SimulationDetailsProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Simulation Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Simulation Parameters */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Simulation Parameters</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Range</span>
              <span className="text-sm font-medium text-gray-900">{params.dataRange}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Events</span>
              <span className="text-sm font-medium text-gray-900">{params.totalEvents.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Drivers Analyzed</span>
              <span className="text-sm font-medium text-gray-900">{params.driversAnalyzed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Simulation Time</span>
              <span className="text-sm font-medium text-gray-900">{params.simulationTime} seconds</span>
            </div>
          </div>
        </div>

        {/* Proposed Weight Changes */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Proposed Weight Changes</h3>
          <div className="space-y-3">
            {weightChanges.map((change, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{change.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900">
                    {change.current}% → {change.proposed}%
                  </span>
                  <span className={`text-sm font-medium ${
                    change.delta > 0 ? 'text-green-600' : change.delta < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    ({change.delta > 0 ? '+' : ''}{change.delta}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
