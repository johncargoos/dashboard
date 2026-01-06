'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { AnomaliesEmptyState } from '@/components/admin/anomalies/AnomaliesEmptyState'
import { AnomalySummaryKPI } from '@/components/admin/anomalies/AnomalySummaryKPI'
import { AnomaliesListTable } from '@/components/admin/anomalies/AnomaliesListTable'
import { getAnomalies } from '@/lib/api/anomalies'

interface User {
  id: string
  name: string
}

interface Carrier {
  id: string
  name: string
}

interface Driver {
  id: string
  name: string
}

interface AnomalyEntry {
  id: string
  anomalyId: string
  type: string
  severity: 'high' | 'medium' | 'low'
  status: 'open' | 'in-review' | 'resolved'
  dateTime: string
  carrier: Carrier
  driver: Driver
  assignedTo?: User
}

type TabType = 'all' | 'resolved' | 'high-priority'

export default function AnomaliesPage() {
  const [entries, setEntries] = useState<AnomalyEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('all')

  useEffect(() => {
    // Store user type preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'admin')
      document.cookie = 'userType=admin; path=/; max-age=31536000'
    }

    // Fetch anomalies from API
    const fetchAnomalies = async () => {
      try {
        setIsLoading(true)
        const data = await getAnomalies()
        
        // Transform API data to match component interface
        const transformedEntries: AnomalyEntry[] = data.anomalies.map((anomaly) => ({
          id: anomaly.id,
          anomalyId: anomaly.anomalyId || `ANM-${anomaly.id}`,
          type: anomaly.type,
          severity: anomaly.severity,
          status: anomaly.status,
          dateTime: anomaly.dateTime || new Date().toLocaleString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          carrier: anomaly.carrier || { id: '', name: 'Unknown' },
          driver: anomaly.driver || { id: '', name: 'Unknown' },
          assignedTo: undefined, // TODO: Get from API
        }))
        
        setEntries(transformedEntries)
      } catch (error) {
        // Silently handle errors - endpoint doesn't exist yet
        setEntries([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnomalies()
  }, [])

  const handleCreateAnomaly = () => {
    // TODO: Implement create anomaly flow
    console.log('Create new anomaly')
  }

  const handleNewAnomaly = () => {
    // TODO: Implement create anomaly flow
    console.log('New anomaly')
  }

  // Filter entries based on active tab
  const filteredEntries = entries.filter((entry) => {
    if (activeTab === 'resolved') {
      return entry.status === 'resolved'
    } else if (activeTab === 'high-priority') {
      return entry.status === 'open' && entry.severity === 'high'
    }
    return true // 'all' tab
  })

  // Calculate summary KPIs
  const totalAnomalies = entries.length
  const resolvedLastWeek = entries.filter(e => e.status === 'resolved').length
  const openHighPrioToday = entries.filter(e => e.status === 'open' && e.severity === 'high').length

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
      {/* Sidebar */}
      <Sidebar userType="admin" />

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-slate-50">
        {/* Header */}
        <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100 inline-flex flex-col justify-center items-end gap-2.5">
          <Header userType="admin" />
        </div>

        {/* Page Content */}
        <div className="p-8">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Anomalies</h1>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
            <>
              {/* Summary KPI Cards */}
              <AnomalySummaryKPI
                totalAnomalies={totalAnomalies}
                resolvedLastWeek={resolvedLastWeek}
                openHighPrioToday={openHighPrioToday}
              />

              {/* Tab Navigation */}
              <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'text-[#0A376C] border-b-2 border-[#0A376C]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Anomalies
                </button>
                <button
                  onClick={() => setActiveTab('resolved')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'resolved'
                      ? 'text-[#0A376C] border-b-2 border-[#0A376C]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Resolved
                </button>
                <button
                  onClick={() => setActiveTab('high-priority')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'high-priority'
                      ? 'text-[#0A376C] border-b-2 border-[#0A376C]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Open High Prio.
                </button>
              </div>

              {/* Table or Empty State */}
              {filteredEntries.length === 0 ? (
                <AnomaliesEmptyState onCreateAnomaly={handleCreateAnomaly} />
              ) : (
                <AnomaliesListTable entries={filteredEntries} onNewAnomaly={handleNewAnomaly} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
