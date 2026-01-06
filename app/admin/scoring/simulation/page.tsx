'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { BackButton } from '@/components/shared/BackButton'
import { SimulationResultsHeader } from '@/components/admin/scoring/SimulationResultsHeader'
import { ScoreDistributionChart } from '@/components/admin/scoring/ScoreDistributionChart'
import { ImpactedDriversSummary } from '@/components/admin/scoring/ImpactedDriversSummary'
import { SimulationDetails } from '@/components/admin/scoring/SimulationDetails'
import { RecommendationSection } from '@/components/admin/scoring/RecommendationSection'
import { ApplyWeightsModal } from '@/components/admin/scoring/ApplyWeightsModal'

export default function SimulationPage() {
  const router = useRouter()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'admin')
      document.cookie = 'userType=admin; path=/; max-age=31536000'
    }
  }, [])

  const handleApplyWeights = () => {
    setIsApplyModalOpen(true)
  }

  const handleConfirmApply = () => {
    setIsApplyModalOpen(false)
    router.push('/admin/scoring/success')
  }

  // Mock data - replace with API call
  const scoreDistributionData = [
    { range: '0-200', currentCount: 5, proposedCount: 3 },
    { range: '200-300', currentCount: 12, proposedCount: 8 },
    { range: '300-350', currentCount: 25, proposedCount: 20 },
    { range: '350-400', currentCount: 45, proposedCount: 50 },
    { range: '400-500', currentCount: 80, proposedCount: 90 },
    { range: '500-600', currentCount: 120, proposedCount: 140 },
    { range: '600-700', currentCount: 200, proposedCount: 180 },
    { range: '700-800', currentCount: 180, proposedCount: 190 },
    { range: '800-850+', currentCount: 110, proposedCount: 96 },
  ]

  const simulationParams = {
    dataRange: 'Last 30 days',
    totalEvents: 12487,
    driversAnalyzed: 777,
    simulationTime: 2.3,
  }

  const weightChanges = [
    { name: 'Safety', current: 35, proposed: 38, delta: 3 },
    { name: 'Timeliness', current: 25, proposed: 23, delta: -2 },
    { name: 'Quality', current: 15, proposed: 15, delta: 0 },
    { name: 'Feedback', current: 15, proposed: 14, delta: -1 },
    { name: 'Experience', current: 10, proposed: 10, delta: 0 },
  ]

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
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Simulation Results Header */}
          <SimulationResultsHeader
            currentAccuracy={92.3}
            projectedAccuracy={93.0}
            accuracyDelta={0.7}
            className="mb-6"
          />

          {/* Score Distribution Chart */}
          <ScoreDistributionChart
            data={scoreDistributionData}
            totalDrivers={777}
            className="mb-6"
          />

          {/* Impacted Drivers Summary */}
          <ImpactedDriversSummary
            improved={{ count: 423, percentage: 54.5 }}
            noChange={{ count: 289, percentage: 37.2 }}
            lower={{ count: 65, percentage: 8.3 }}
            className="mb-6"
          />

          {/* Simulation Details */}
          <SimulationDetails
            params={simulationParams}
            weightChanges={weightChanges}
            className="mb-6"
          />

          {/* Recommendation Section */}
          <RecommendationSection className="mb-6" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyWeights}
              className="px-6 py-2 text-sm font-medium text-white bg-[#0A376C] rounded-lg hover:bg-[#082a56] transition-colors"
            >
              Apply New Weights
            </button>
          </div>
        </div>
      </div>

      {/* Apply Weights Modal */}
      <ApplyWeightsModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onConfirm={handleConfirmApply}
        expectedImprovement={0.7}
        driversPositivelyAffected={{ count: 423, percentage: 54.5 }}
        driversNegativelyAffected={{ count: 65, percentage: 8.3 }}
      />
    </div>
  )
}
