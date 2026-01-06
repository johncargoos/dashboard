'use client'

interface ImpactedDriversSummaryProps {
  improved: { count: number; percentage: number }
  noChange: { count: number; percentage: number }
  lower: { count: number; percentage: number }
  className?: string
}

export function ImpactedDriversSummary({
  improved,
  noChange,
  lower,
  className = ''
}: ImpactedDriversSummaryProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {/* Improved Scores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-600 mb-2">Drivers with Improved Scores</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{improved.count}</p>
        <p className="text-sm font-medium text-blue-600">+{improved.percentage}% of total</p>
      </div>

      {/* No Change */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-600 mb-2">Drivers with No Change</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{noChange.count}</p>
        <p className="text-sm font-medium text-gray-500">{noChange.percentage}% of total</p>
      </div>

      {/* Lower Scores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-600 mb-2">Drivers with Lower Scores</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{lower.count}</p>
        <p className="text-sm font-medium text-red-600">-{lower.percentage}% of total</p>
      </div>
    </div>
  )
}
