'use client'

import { useEffect, useState } from 'react'
import { getAnomaliesSummary } from '@/lib/api/anomalies'

interface Anomaly {
  anomalyNo: string
  anomalyType: string
  severity: 'High' | 'Medium' | 'Low'
  scope: string
  status: string
}

interface AnomaliesTableProps {
  className?: string
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'text-red-700 bg-red-50'
    case 'medium':
      return 'text-orange-700 bg-orange-50'
    case 'low':
      return 'text-yellow-700 bg-yellow-50'
    default:
      return 'text-gray-700 bg-gray-50'
  }
}

export function AnomaliesTable({ className = '' }: AnomaliesTableProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        setIsLoading(true)
        const data = await getAnomaliesSummary(5)
        
        // Transform API data to match component interface
        const transformedAnomalies: Anomaly[] = data.map((anomaly) => ({
          anomalyNo: anomaly.anomalyId || `AN-${anomaly.id}`,
          anomalyType: anomaly.type,
          severity: anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1) as 'High' | 'Medium' | 'Low',
          scope: anomaly.scope || (anomaly.driver ? 'Driver' : anomaly.carrier ? 'Carrier' : 'All'),
          status: anomaly.status === 'open' ? 'New' : anomaly.status === 'in-review' ? 'In Review' : 'Resolved',
        }))
        
        setAnomalies(transformedAnomalies)
      } catch (error) {
        // Silently handle errors - endpoint doesn't exist yet
        setAnomalies([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnomalies()
  }, [])

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`} style={{ padding: '16px' }}>
      <div className="flex items-start justify-between mb-4" style={{ marginBottom: '12px' }}>
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1 leading-5">Anomalies to Review</h2>
          <p className="text-sm text-gray-600 leading-5" style={{ marginTop: '4px' }}>System-detected issues that need your attention</p>
        </div>
        <a href="/admin/anomalies" className="text-sm font-medium text-[#0a376c] hover:underline leading-5">
          See all
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2.5 px-2 text-sm font-medium text-gray-700" style={{ height: '40px' }}>Anomaly No.</th>
              <th className="text-left py-2.5 px-2 text-sm font-medium text-gray-700" style={{ height: '40px' }}>Anomaly Type</th>
              <th className="text-left py-2.5 px-2 text-sm font-medium text-gray-700" style={{ height: '40px' }}>Severity</th>
              <th className="text-left py-2.5 px-2 text-sm font-medium text-gray-700" style={{ height: '40px' }}>Scope</th>
              <th className="text-left py-2.5 px-2 text-sm font-medium text-gray-700" style={{ height: '40px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.length > 0 ? (
              anomalies.map((anomaly) => (
                <tr key={anomaly.anomalyNo} className="border-b border-gray-100 hover:bg-gray-50" style={{ height: '53px' }}>
                  <td className="py-4 px-2 text-sm text-gray-900 font-medium leading-5">{anomaly.anomalyNo}</td>
                  <td className="py-4 px-2 text-sm text-gray-900 leading-5">{anomaly.anomalyType}</td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-900 leading-5">{anomaly.scope}</td>
                  <td className="py-4 px-2">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-50">
                      {anomaly.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                  No anomalies to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
