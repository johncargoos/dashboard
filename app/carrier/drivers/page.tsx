'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { DriversTable } from '@/components/carrier/DriversTable'
import { DriversGrid } from '@/components/carrier/DriversGrid'
import { DriversEmpty } from '@/components/carrier/DriversEmpty'
import { getDrivers, type Driver } from '@/lib/api/drivers'

export default function DriversPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'carrier')
      document.cookie = 'userType=carrier; path=/; max-age=31536000'
    }
  }, [])

  // Fetch drivers function
  const fetchDrivers = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Fetching drivers from API...')
      const driversData = await getDrivers()
      console.log('✅ Drivers fetched:', driversData?.length || 0, 'drivers')
      setDrivers(driversData || [])
    } catch (error) {
      console.error('❌ Error fetching drivers:', error)
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      setDrivers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on mount and when pathname/searchParams change (navigation back to this page)
  useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers, pathname, searchParams])

  // Also refetch when page becomes visible again (user switches back to tab/window)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('📄 Page became visible, refetching drivers...')
        fetchDrivers()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchDrivers])

  const handleCreateDriver = () => {
    router.push('/carrier/drivers/create')
  }

  const handleDriverDeleted = async () => {
    // Refresh drivers list after deletion
    await fetchDrivers()
  }

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
      {/* Sidebar */}
      <Sidebar userType="carrier" />

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-slate-50">
        {/* Header */}
        <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100 inline-flex flex-col justify-center items-end gap-2.5 bg-white">
          <Header userType="carrier" />
        </div>

        {/* Drivers Content */}
        <div className="p-8 bg-slate-50">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-lg text-gray-600">Loading drivers...</div>
              </div>
            </div>
          ) : drivers.length === 0 ? (
            <DriversEmpty onCreateDriver={handleCreateDriver} onViewModeChange={setViewMode} />
          ) : viewMode === 'list' ? (
            <DriversTable drivers={drivers} onCreateDriver={handleCreateDriver} viewMode={viewMode} onViewModeChange={setViewMode} onDriverDeleted={handleDriverDeleted} />
          ) : (
            <DriversGrid drivers={drivers} onCreateDriver={handleCreateDriver} viewMode={viewMode} onViewModeChange={setViewMode} />
          )}
        </div>
      </div>
    </div>
  )
}

