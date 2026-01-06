'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { CarriersEmptyState } from '@/components/admin/carriers/CarriersEmptyState'
import { CarriersTable } from '@/components/admin/carriers/CarriersTable'
import { CreateCarrierModal } from '@/components/admin/carriers/CreateCarrierModal'
import { getCarriers } from '@/lib/api/carriers'

interface User {
  id: string
  name: string
}

interface CarrierEntry {
  id: string
  companyName: string
  carrierId: string
  accountManager: User
  score: number
  scoreLabel: 'GOOD' | 'AVG' | 'FAIR' | 'POOR'
  risk: number
  riskLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  numberOfDrivers: number | string
  openHighPrioTrips: number
  status: 'active' | 'pending' | 'declined'
}

export default function CarriersPage() {
  const [entries, setEntries] = useState<CarrierEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    // Store user type preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'admin')
      document.cookie = 'userType=admin; path=/; max-age=31536000'
    }

    // Fetch carriers from API
    const fetchCarriers = async () => {
      try {
        setIsLoading(true)
        const data = await getCarriers()
        
        console.log('Carriers data fetched:', data)
        
        // Check if carriers array exists and has items
        if (!data || !data.carriers || data.carriers.length === 0) {
          console.log('No carriers found in response')
          setEntries([])
          return
        }
        
        console.log(`Found ${data.carriers.length} carriers`)
        
        // Transform API data to match component interface
        const transformedEntries: CarrierEntry[] = data.carriers.map((carrier) => {
          // Use companyName from backend, fallback to name
          const companyName = carrier.companyName || carrier.name || 'Unknown Carrier'
          
          // For now, use mock score/risk data - TODO: Calculate from driver scores
          // Determine score label (mock - should calculate from carrier's drivers' average scores)
          const avgScore = 750 // TODO: Calculate from carrier's drivers
          let scoreLabel: 'GOOD' | 'AVG' | 'FAIR' | 'POOR' = 'GOOD'
          if (avgScore >= 700) scoreLabel = 'GOOD'
          else if (avgScore >= 600) scoreLabel = 'AVG'
          else if (avgScore >= 500) scoreLabel = 'FAIR'
          else scoreLabel = 'POOR'

          // Determine risk label (mock - should calculate from carrier's drivers' risk levels)
          let riskLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
          const risk = Math.floor(Math.random() * 7) + 1
          if (risk <= 2) riskLabel = 'LOW'
          else if (risk <= 4) riskLabel = 'MEDIUM'
          else if (risk <= 6) riskLabel = 'HIGH'
          else riskLabel = 'CRITICAL'

          return {
            id: carrier.id,
            companyName,
            carrierId: carrier.id, // Use carrier ID
            accountManager: { id: '1', name: 'John Ceriola' }, // TODO: Get from API
            score: Math.round(avgScore), // Use score as-is (0-1000 scale)
            scoreLabel,
            risk,
            riskLabel,
            numberOfDrivers: carrier.driversCount || carrier.driverCount || 0,
            openHighPrioTrips: 0, // TODO: Get from API (count high priority trips for this carrier)
            status: (carrier.status as 'active' | 'pending' | 'declined') || 'active',
          }
        })
        
        console.log(`Transformed ${transformedEntries.length} carrier entries`)
        setEntries(transformedEntries)
      } catch (error: any) {
        console.error('Error fetching carriers:', error)
        // Handle authentication errors gracefully
        if (error.message?.includes('forbidden') || error.message?.includes('403')) {
          console.error('403 Forbidden - Authentication issue. Make sure you are signed in as admin.')
          // Authentication issue - show empty state
          setEntries([])
        } else {
          console.error('Other error fetching carriers:', error.message)
          // Other errors - show empty state
          setEntries([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCarriers()
  }, [])

  const handleAddCarrier = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateSuccess = async () => {
    // Refresh carriers list after successful creation
    try {
      const data = await getCarriers()
      
      if (!data || !data.carriers || data.carriers.length === 0) {
        setEntries([])
        return
      }
      
      const transformedEntries: CarrierEntry[] = data.carriers.map((carrier) => {
        const companyName = carrier.companyName || carrier.name || 'Unknown Carrier'
        const avgScore = 750 // TODO: Calculate from carrier's drivers
        let scoreLabel: 'GOOD' | 'AVG' | 'FAIR' | 'POOR' = 'GOOD'
        if (avgScore >= 700) scoreLabel = 'GOOD'
        else if (avgScore >= 600) scoreLabel = 'AVG'
        else if (avgScore >= 500) scoreLabel = 'FAIR'
        else scoreLabel = 'POOR'

        let riskLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
        const risk = Math.floor(Math.random() * 7) + 1
        if (risk <= 2) riskLabel = 'LOW'
        else if (risk <= 4) riskLabel = 'MEDIUM'
        else if (risk <= 6) riskLabel = 'HIGH'
        else riskLabel = 'CRITICAL'

        return {
          id: carrier.id,
          companyName,
          carrierId: carrier.id,
          accountManager: { id: '1', name: 'John Ceriola' },
          score: Math.round(avgScore),
          scoreLabel,
          risk,
          riskLabel,
          numberOfDrivers: carrier.driversCount || carrier.driverCount || 0,
          openHighPrioTrips: 0,
          status: (carrier.status as 'active' | 'pending' | 'declined') || 'active',
        }
      })
      
      setEntries(transformedEntries)
    } catch (error) {
      console.error('Error refreshing carriers list:', error)
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Carriers</h1>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : entries.length === 0 ? (
            <CarriersEmptyState onAddCarrier={handleAddCarrier} />
          ) : (
            <CarriersTable entries={entries} onAddCarrier={handleAddCarrier} />
          )}
        </div>

        {/* Create Carrier Modal */}
        <CreateCarrierModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  )
}
