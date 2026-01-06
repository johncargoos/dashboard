'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { LogsTable, type LogFilters } from '@/components/carrier/LogsTable'
import { getLogs, type LogEntry } from '@/lib/api/logs'

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<LogFilters>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'carrier')
      document.cookie = 'userType=carrier; path=/; max-age=31536000'
    }
  }, [])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true)
        const response = await getLogs({
          limit: 100,
          ...filters,
        })
        setLogs(response.logs || [])
      } catch (error) {
        console.error('Error fetching logs:', error)
        setLogs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [filters])

  const handleFilterChange = (newFilters: LogFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
      {/* Sidebar */}
      <Sidebar userType="carrier" />

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-slate-50">
        {/* Header */}
        <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100 inline-flex flex-col justify-center items-end gap-2.5">
          <Header userType="carrier" />
        </div>

        {/* Logs Content */}
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
            <p className="text-gray-600 mt-1">View all system activities and events</p>
          </div>

          <LogsTable 
            logs={logs} 
            isLoading={isLoading}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  )
}
