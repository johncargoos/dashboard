'use client'

import { useEffect } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { OverviewCards } from '@/components/admin/OverviewCards'
import { AnomaliesTable } from '@/components/admin/AnomaliesTable'
import { TicketsList } from '@/components/admin/TicketsList'
import { ScoreTierBreakdown } from '@/components/admin/ScoreTierBreakdown'
import { CarriersOverview } from '@/components/admin/CarriersOverview'

export default function AdminOverview() {
  useEffect(() => {
    // Store user type preference in both localStorage and ensure cookie is set
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'admin')
      // Cookie is set by middleware, but we can also set it here as backup
      document.cookie = 'userType=admin; path=/; max-age=31536000' // 1 year
    }
  }, [])

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

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Title */}
          <div className="mb-5">
            <h1 className="text-xl font-semibold text-gray-900 leading-7">Overview</h1>
          </div>

          {/* Overview Cards */}
          <div className="mb-6">
            <OverviewCards className="mb-0" />
          </div>

          {/* Two Column Layout: Anomalies (left/wider) and Tickets (right/narrower) */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex-1 lg:flex-[2] min-w-0">
              <AnomaliesTable />
            </div>
            <div className="flex-shrink-0 lg:w-[354px] w-full">
              <TicketsList />
            </div>
          </div>

          {/* Score Tier Breakdown - Full Width */}
          <div className="mb-6">
            <ScoreTierBreakdown />
          </div>

          {/* Carriers Overview - Full Width */}
          <div>
            <CarriersOverview />
          </div>
        </div>
      </div>
    </div>
  )
}
