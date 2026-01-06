'use client'

import { useEffect, useState } from 'react'
import { getCarrierStats } from '@/lib/api/carriers'
import { getCarriers } from '@/lib/api/carriers'

interface OnboardingCarrier {
  name: string
  status: string
  progress: number // percentage
}

interface CarriersOverviewProps {
  className?: string
}

export function CarriersOverview({ className = '' }: CarriersOverviewProps) {
  const [stats, setStats] = useState({
    totalCarriers: 0,
    activeCarriers: 0,
    carriersWithHighRiskDrivers: 0,
    carriersOnboardedLast30Days: 0,
  })
  const [onboardingCarriers, setOnboardingCarriers] = useState<OnboardingCarrier[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Fetch carrier stats
        const statsData = await getCarrierStats()
        setStats({
          totalCarriers: statsData.totalCarriers || 0,
          activeCarriers: statsData.activeCarriers || 0,
          carriersWithHighRiskDrivers: 0, // TODO: Add this to API
          carriersOnboardedLast30Days: 0, // TODO: Add this to API
        })

        // Fetch carriers to get onboarding status
        const carriersData = await getCarriers()
        // Filter carriers with pending/in-progress status for onboarding
        const onboarding = carriersData.carriers
          .filter(c => c.status === 'pending' || c.status === 'inactive')
          .slice(0, 5) // Show up to 5 carriers in onboarding
          .map(c => ({
            name: c.companyName || c.name || 'Unknown',
            status: c.status === 'pending' ? 'Documents Pending' : 'In Progress',
            progress: c.status === 'pending' ? 30 : 60, // TODO: Get actual progress from API
          }))
        setOnboardingCarriers(onboarding)
      } catch (error) {
        // Silently handle errors - use default values
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate donut chart segments (mock distribution - replace with real data)
  const segment1 = 40 // Active carriers percentage
  const segment2 = 35 // Other percentage
  const segment3 = 25 // Remaining percentage

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900 leading-5">Carriers Overview</h2>
        <a href="/admin/carriers" className="text-sm font-medium text-[#0a376c] hover:underline leading-5">
          Go to Carriers
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Card - Stats and Radial Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1" style={{ padding: '24px' }}>
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Column - Metrics */}
            <div className="space-y-6 flex-shrink-0 lg:w-[236px] w-full">
              <div>
                <div className="text-base font-medium text-gray-900 mb-0.5 leading-6">Active carriers</div>
                <div className="text-2xl font-semibold text-gray-900 leading-7 mt-0.5">{stats.activeCarriers || 30}</div>
              </div>
              <div>
                <div className="text-base font-medium text-gray-900 mb-0.5 leading-6">Carriers with high-risk drivers</div>
                <div className="text-2xl font-semibold text-gray-900 leading-7 mt-0.5">{stats.carriersWithHighRiskDrivers || 5}</div>
              </div>
              <div>
                <div className="text-base font-medium text-gray-900 mb-0.5 leading-6">Carriers onboarded last 30 days</div>
                <div className="text-2xl font-semibold text-gray-900 leading-7 mt-0.5">{stats.carriersOnboardedLast30Days || 2}</div>
              </div>
            </div>

            {/* Middle - Radial Chart */}
            <div className="flex items-center justify-center flex-1">
              <div className="relative" style={{ width: '223px', height: '223px' }}>
                {/* Radial Chart SVG */}
                <svg className="transform -rotate-90" width="223" height="223" viewBox="0 0 223 223">
                  <circle
                    cx="111.5"
                    cy="111.5"
                    r="86"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="32"
                  />
                  {/* Segment 1 */}
                  <circle
                    cx="111.5"
                    cy="111.5"
                    r="86"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="32"
                    strokeDasharray={`${2 * Math.PI * 86 * (segment1 / 100)} ${2 * Math.PI * 86}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                  />
                  {/* Segment 2 */}
                  <circle
                    cx="111.5"
                    cy="111.5"
                    r="86"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="32"
                    strokeDasharray={`${2 * Math.PI * 86 * (segment2 / 100)} ${2 * Math.PI * 86}`}
                    strokeDashoffset={-2 * Math.PI * 86 * (segment1 / 100)}
                    strokeLinecap="round"
                  />
                  {/* Segment 3 */}
                  <circle
                    cx="111.5"
                    cy="111.5"
                    r="86"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="32"
                    strokeDasharray={`${2 * Math.PI * 86 * (segment3 / 100)} ${2 * Math.PI * 86}`}
                    strokeDashoffset={-2 * Math.PI * 86 * ((segment1 + segment2) / 100)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card - Carriers in Onboarding */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 lg:w-[556px] w-full" style={{ padding: '24px' }}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-0">
              <h3 className="text-base font-semibold text-gray-900 leading-5">Carriers in Onboarding</h3>
              <span className="text-3xl font-bold text-gray-900 leading-9">{onboardingCarriers.length || 2}</span>
            </div>
          </div>
          <div className="space-y-4">
            {onboardingCarriers.length > 0 ? (
              onboardingCarriers.map((carrier) => (
                <div key={carrier.name} className="space-y-2" style={{ padding: '12px 24px' }}>
                  <div className="flex items-center justify-between mb-0">
                    <span className="text-base font-medium text-gray-900 leading-5">{carrier.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-4 mb-2">{carrier.status}</p>
                  <div className="w-full bg-gray-200 rounded-full" style={{ height: '9px' }}>
                    <div
                      className="bg-[#0a376c] rounded-full transition-all"
                      style={{ width: `${carrier.progress}%`, height: '9px' }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No carriers in onboarding</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
