'use client'

interface AnomalySummaryKPIProps {
  totalAnomalies: number
  resolvedLastWeek: number
  openHighPrioToday: number
  className?: string
}

export function AnomalySummaryKPI({ totalAnomalies, resolvedLastWeek, openHighPrioToday, className = '' }: AnomalySummaryKPIProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${className}`}>
      {/* Total Anomalies */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-1">TOTAL ANOMALIES</h3>
            <p className="text-2xl font-bold text-gray-900">{totalAnomalies.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">Last Month</p>
      </div>

      {/* Resolved */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-1">RESOLVED</h3>
            <p className="text-2xl font-bold text-gray-900">{resolvedLastWeek}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">Last Week</p>
      </div>

      {/* Open High Priority */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-1">OPEN HIGH PRIO.</h3>
            <p className="text-2xl font-bold text-gray-900">{openHighPrioToday}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">Today</p>
      </div>
    </div>
  )
}
