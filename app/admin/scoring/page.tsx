'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { ScoringKPICards } from '@/components/admin/scoring/ScoringKPICards'
import { ScoreCalculationQueue } from '@/components/admin/scoring/ScoreCalculationQueue'
import { ManualWeightAdjust } from '@/components/admin/scoring/ManualWeightAdjust'
import { VersionAccuracyInfo } from '@/components/admin/scoring/VersionAccuracyInfo'
import { RecentScoreChangeModal } from '@/components/admin/scoring/RecentScoreChangeModal'

type TabType = 'dashboard' | 'feedback'

export default function ScoringPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isRecentChangesModalOpen, setIsRecentChangesModalOpen] = useState(false)

  useEffect(() => {
    // Store user type preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'admin')
      document.cookie = 'userType=admin; path=/; max-age=31536000'
    }
  }, [])

  const handleRunSimulation = () => {
    router.push('/admin/scoring/simulation')
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
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Score Engine Management</h1>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-[#0A376C] border-b-2 border-[#0A376C]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              AI Scoring Dashboard
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'feedback'
                  ? 'text-[#0A376C] border-b-2 border-[#0A376C]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Feedback Loop Trainer
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <ScoringKPICards />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreCalculationQueue />
                <VersionAccuracyInfo />
              </div>

              {/* Manual Weight Adjust */}
              <ManualWeightAdjust onRunSimulation={handleRunSimulation} />

              {/* Recent Changes Button (temporary - will be replaced with actual trigger) */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsRecentChangesModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View Recent Score Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Feedback Loop Trainer content coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RecentScoreChangeModal 
        isOpen={isRecentChangesModalOpen}
        onClose={() => setIsRecentChangesModalOpen(false)}
      />
    </div>
  )
}
