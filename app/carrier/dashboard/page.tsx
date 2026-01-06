'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { GreetingSection } from '@/components/carrier/GreetingSection'
import { StatCard } from '@/components/carrier/StatCard'
import { LoadsSection } from '@/components/carrier/LoadsSection'
import { EmptyState } from '@/components/carrier/EmptyState'
import { getLoads, type Load } from '@/lib/api/loads'
import { getDrivers } from '@/lib/api/drivers'

export default function CarrierDashboard() {
  const router = useRouter()
  const [loads, setLoads] = useState<Load[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Get user type and ensure it's set (don't override if already set)
    if (typeof window !== 'undefined') {
      const currentUserType = localStorage.getItem('userType')
      // Only set to carrier if not already set (to preserve admin userType if needed)
      if (!currentUserType) {
        localStorage.setItem('userType', 'carrier')
        document.cookie = 'userType=carrier; path=/; max-age=31536000' // 1 year
      }
      
      // Get user name from localStorage if available
      const storedUserName = localStorage.getItem('userName') || ''
      setUserName(storedUserName)
    }
  }, [])

  useEffect(() => {
    // Fetch loads and drivers from API
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch loads and drivers in parallel
        const [loadsResponse, driversData] = await Promise.all([
          getLoads({ limit: 100 }).catch(err => {
            console.error('Error fetching loads:', err)
            return { loads: [] }
          }),
          getDrivers().catch(err => {
            console.error('Error fetching drivers:', err)
            return []
          })
        ])
        
        setLoads(loadsResponse.loads || [])
        setDrivers(driversData || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoads([])
        setDrivers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewRiskReports = () => {
    console.log('View Risk Reports clicked')
  }

  const handleCreateLoad = () => {
    router.push('/carrier/load-manager/create')
  }

  // Calculate stats from API data
  const calculateStats = () => {
    // Fleet AVG CPS Score - average of all driver scores
    const avgCPS = drivers.length > 0
      ? Math.round(drivers.reduce((sum, driver) => sum + (driver.score || 0), 0) / drivers.length)
      : 0

    // Active Trips Today - loads with status 'in-transit' or 'pending' created today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const activeTripsToday = loads.filter(load => {
      const loadDate = load.createdAt ? new Date(load.createdAt) : new Date()
      return (load.status === 'in-transit' || load.status === 'pending') && 
             loadDate >= today
    }).length

    // Incidents this Week - placeholder (would need incidents/trips data)
    const incidentsThisWeek = 0

    // Weekly Timeliness Score - placeholder (would need delivery timing data)
    const weeklyTimelinessScore = 0

    return {
      avgCPS,
      activeTripsToday,
      incidentsThisWeek,
      weeklyTimelinessScore
    }
  }

  const stats = calculateStats()
  const hasData = loads.length > 0

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

        {/* Dashboard Content */}
        <div className="p-8 bg-slate-50">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-lg text-gray-600">Loading...</div>
              </div>
            </div>
          ) : hasData ? (
            <>
              {/* Greeting Section */}
              <div className="w-full h-9 mb-6">
                <GreetingSection
                  userName={userName}
                  onViewRiskReports={handleViewRiskReports}
                  onCreateLoad={handleCreateLoad}
                />
              </div>

              {/* Stats Cards Section */}
              <div className="w-full h-36 inline-flex justify-start items-center gap-4 mb-6">
                <StatCard
                  label="Fleet AVG CPS Score"
                  value={stats.avgCPS}
                  trend={{ text: "", isPositive: true }}
                  className="flex-1 min-w-[200px]"
                />
                <StatCard
                  label="Active Trips Today"
                  value={stats.activeTripsToday}
                  trend={{ text: "", isPositive: true }}
                  className="flex-1 min-w-[200px]"
                />
                <StatCard
                  label="Incidents this Week"
                  value={stats.incidentsThisWeek}
                  trend={{ text: "", isPositive: true }}
                  className="flex-1 min-w-[200px]"
                />
                <StatCard
                  label="Weekly Timeliness Score"
                  value={stats.weeklyTimelinessScore}
                  trend={{ text: "", isPositive: true }}
                  className="flex-1 min-w-[200px]"
                />
                <StatCard
                  label="Total Drivers"
                  value={drivers.length}
                  trend={{ text: "", isPositive: true }}
                  className="flex-1 min-w-[200px]"
                />
              </div>

              {/* Loads Section */}
              <LoadsSection loads={loads} />
            </>
          ) : (
            <div className="flex justify-center items-center min-h-[60vh]">
              <EmptyState
                title="Welcome to Cargoos!"
                description="You haven't created any loads yet. Start by creating your first load to begin tracking your fleet operations."
                buttonLabel="Create Your First Load"
                onButtonClick={handleCreateLoad}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
