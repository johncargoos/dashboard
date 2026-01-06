'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { LoadManagerTable } from '@/components/carrier/LoadManagerTable'
import { LoadManagerEmpty } from '@/components/carrier/LoadManagerEmpty'
import { useRouter } from 'next/navigation'
import { getLoads, type Load } from '@/lib/api/loads'

export default function LoadManagerPage() {
  const router = useRouter()
  const [loads, setLoads] = useState<Load[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'carrier')
      document.cookie = 'userType=carrier; path=/; max-age=31536000'
    }
  }, [])

  useEffect(() => {
    // Fetch loads from API
    const fetchLoads = async () => {
      try {
        setIsLoading(true)
        const response = await getLoads({ limit: 100 })
        setLoads(response.loads || [])
      } catch (error) {
        console.error('Error fetching loads:', error)
        setLoads([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoads()
  }, [])

  const handleCreateLoad = () => {
    router.push('/carrier/load-manager/create')
  }

  const handleEditLoad = (load: Load) => {
    router.push(`/carrier/load-manager/edit/${load.id || load.loadNo}`)
  }

  const handleDeleteLoad = async (loadId: string) => {
    try {
      const { deleteLoad } = await import('@/lib/api/loads')
      await deleteLoad(loadId)
      // Refresh loads after deletion
      const response = await getLoads({ limit: 100 })
      setLoads(response.loads || [])
    } catch (error) {
      console.error('Error deleting load:', error)
      alert('Failed to delete load. Please try again.')
    }
  }

  const handleViewLoad = (load: Load) => {
    router.push(`/carrier/load-manager/${load.id || load.loadNo}`)
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

        {/* Load Manager Content */}
        <div className="p-8 bg-slate-50">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-lg text-gray-600">Loading loads...</div>
              </div>
            </div>
          ) : loads.length === 0 ? (
            <LoadManagerEmpty onCreateLoad={handleCreateLoad} />
          ) : (
            <LoadManagerTable 
              loads={loads} 
              onCreateLoad={handleCreateLoad}
              onEditLoad={handleEditLoad}
              onDeleteLoad={handleDeleteLoad}
              onViewLoad={handleViewLoad}
            />
          )}
        </div>
      </div>
    </div>
  )
}

