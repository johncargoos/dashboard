'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { OnboardingEmptyState } from '@/components/admin/onboarding/OnboardingEmptyState'
import { OnboardingTable } from '@/components/admin/onboarding/OnboardingTable'

interface OnboardingEntry {
  id: string
  companyName: string
  status: 'active' | 'pending' | 'declined'
  type: 'ELITE' | 'ELD'
  carrierId: string
  onboardingDate: string
  progress: number
  progressStatus: 'onTrack' | 'delayed' | 'blocked'
}

export default function OnboardingPage() {
  const [entries, setEntries] = useState<OnboardingEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Store user type preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'admin')
      document.cookie = 'userType=admin; path=/; max-age=31536000'
    }

    // Fetch onboarding entries from carriers API
    const fetchOnboarding = async () => {
      try {
        setIsLoading(true)
        const { getCarriers } = await import('@/lib/api/carriers')
        const carriersData = await getCarriers()
        
        // Transform carriers to onboarding entries
        // Onboarding entries are carriers with status 'pending' or recently created
        const transformedEntries: OnboardingEntry[] = carriersData.carriers.map((carrier, index) => {
          // Determine progress based on status
          let progress = 100
          let progressStatus: 'onTrack' | 'delayed' | 'blocked' = 'onTrack'
          if (carrier.status === 'pending') {
            progress = 40
            progressStatus = 'delayed'
          } else if (carrier.status === 'declined') {
            progress = 20
            progressStatus = 'blocked'
          } else if (carrier.status === 'active') {
            progress = 80
            progressStatus = 'onTrack'
          }

          // Format onboarding date from createdAt
          let onboardingDate = 'N/A'
          if (carrier.createdAt) {
            const date = new Date(carrier.createdAt)
            onboardingDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
          }

          // Determine type (mock for now - should come from carrier data)
          const type: 'ELITE' | 'ELD' = index % 2 === 0 ? 'ELITE' : 'ELD'

          return {
            id: carrier.id,
            companyName: (carrier.companyName || carrier.name || 'Unknown').toUpperCase(),
            status: carrier.status as 'active' | 'pending' | 'declined',
            type,
            carrierId: carrier.id,
            onboardingDate,
            progress,
            progressStatus,
          }
        })
        
        setEntries(transformedEntries)
      } catch (error) {
        // Silently handle errors
        setEntries([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOnboarding()
  }, [])

  const handleStartOnboarding = () => {
    // TODO: Implement new onboarding flow
    console.log('Start new onboarding')
  }

  const handleNewOnboarding = () => {
    // TODO: Implement new onboarding flow
    console.log('New onboarding')
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
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : entries.length === 0 ? (
            <OnboardingEmptyState onStartOnboarding={handleStartOnboarding} />
          ) : (
            <OnboardingTable entries={entries} onNewOnboarding={handleNewOnboarding} />
          )}
        </div>
      </div>
    </div>
  )
}
