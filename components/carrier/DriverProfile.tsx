'use client'

import { useState, useEffect } from 'react'
import { getDriverById, getDriverScore } from '@/lib/api/drivers'
import { getDriverInfractions, getDriverScoreHistory, getTierColorClasses, getRecommendation, formatScore, type CPSScore, type InfractionsResponse, type ScoreHistoryResponse } from '@/lib/api/cps'

interface DriverProfileProps {
  driverId: string
  onBack: () => void
}

// Icons
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4L6 8L10 12" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="#737373" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CalendarDaysIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="12" height="10" rx="1" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <path d="M5 2V6M11 2V6" stroke="#1f1e1e" strokeWidth="1.33" strokeLinecap="round"/>
    <path d="M2 8H14" stroke="#1f1e1e" strokeWidth="1.33" strokeLinecap="round"/>
  </svg>
)

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2V10M8 2L5 5M8 2L11 5" stroke="#171717" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V12" stroke="#171717" strokeWidth="1.33" strokeLinecap="round"/>
  </svg>
)

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C10.5 2 12.5 3.5 13.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 5.5H14V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// CPS Score Gauge Component
function CPSScoreGauge({ score, tier, tierColor }: { score: number; tier: string; tierColor: string }) {
  const colors = getTierColorClasses(tier)
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={tierColor === 'green' ? '#22c55e' : tierColor === 'yellow' ? '#eab308' : tierColor === 'orange' ? '#f97316' : '#ef4444'}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{Math.round(score)}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <div className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold text-white ${colors.bg}`}>
        {tier}
      </div>
    </div>
  )
}

// CPS Breakdown Bar Component
function BreakdownBar({ label, raw, weighted, weight, color }: { label: string; raw?: number; weighted?: number; weight?: number; color: string }) {
  const safeRaw = raw ?? 0
  const safeWeighted = weighted ?? 0
  const safeWeight = weight ?? 0
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{Math.round(safeRaw)}% × {safeWeight * 100}% = {safeWeighted.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, safeRaw))}%` }}
        />
      </div>
    </div>
  )
}

// Infraction Card Component
function InfractionCard({ infraction }: { infraction: any }) {
  const isBonus = infraction.category === 'bonus'
  
  return (
    <div className={`p-3 rounded-lg border ${isBonus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className={`text-sm font-medium ${isBonus ? 'text-green-700' : 'text-red-700'}`}>
            {infraction.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </span>
          <p className="text-xs text-gray-600 mt-1">{infraction.description}</p>
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${isBonus ? 'text-green-600' : 'text-red-600'}`}>
            {infraction.currentPoints > 0 ? '+' : ''}{infraction.currentPoints.toFixed(1)}%
          </span>
          <p className="text-xs text-gray-500">{infraction.decayApplied}% decayed</p>
        </div>
      </div>
    </div>
  )
}

export function DriverProfile({ driverId, onBack }: DriverProfileProps) {
  const [activeTab, setActiveTab] = useState<'score' | 'trips' | 'badges'>('score')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Driver data
  const [driver, setDriver] = useState<any>(null)
  const [cpsScore, setCpsScore] = useState<CPSScore | null>(null)
  const [infractions, setInfractions] = useState<InfractionsResponse | null>(null)
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryResponse | null>(null)

  // Fetch all data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch driver details
        const driverData = await getDriverById(driverId)
        setDriver(driverData.driver || driverData)
        
        // Fetch CPS score
        const scoreData = await getDriverScore(driverId)
        setCpsScore(scoreData as unknown as CPSScore)
        
        // Fetch infractions
        try {
          const infractionsData = await getDriverInfractions(driverId)
          setInfractions(infractionsData)
        } catch (e) {
          console.warn('Could not fetch infractions:', e)
        }
        
        // Fetch score history
        try {
          const historyData = await getDriverScoreHistory(driverId)
          setScoreHistory(historyData)
        } catch (e) {
          console.warn('Could not fetch score history:', e)
        }
        
      } catch (err: any) {
        console.error('Error fetching driver data:', err)
        setError(err.message || 'Failed to load driver data')
      } finally {
        setLoading(false)
      }
    }
    
    if (driverId) {
      fetchData()
    }
  }, [driverId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a376c]"></div>
        <p className="mt-4 text-gray-500">Loading driver profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={onBack}
          className="mt-4 bg-[#0a376c] text-white px-4 py-2 rounded-md"
        >
          Go Back
        </button>
      </div>
    )
  }

  const recommendation = cpsScore ? getRecommendation(cpsScore.tier) : null

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="bg-[#eef6ff] rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2 w-[91px]"
      >
        <ChevronLeftIcon />
        <span className="text-sm font-medium text-[#0a376c]">Back</span>
      </button>

      {/* Profile Header */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-5 items-start">
            {/* Avatar */}
            <div className="w-[90px] h-[90px] rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="15" r="8" stroke="#6a7280" strokeWidth="2" fill="none"/>
                <path d="M8 32C8 27.5817 11.5817 24 16 24H24C28.4183 24 32 27.5817 32 32" stroke="#6a7280" strokeWidth="2" fill="none"/>
              </svg>
            </div>

            {/* Driver Info */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h2 className="text-base font-medium text-black">{driver?.name || driverId}</h2>
                <p className="text-sm text-[#737373]">
                  {driver?.email || driverId} {driver?.phone && `| ${driver.phone}`}
                </p>
              </div>

              {/* CPS Badge */}
              {cpsScore && (
                <div className="flex gap-2.5 items-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${getTierColorClasses(cpsScore.tier).bg}`}>
                    <span className="text-sm font-bold text-white">CPS: {Math.round(cpsScore.finalScore)}</span>
                  </div>
                  <div className="bg-gray-100 flex items-center gap-1 px-2 py-1 rounded-md">
                    <span className="text-xs font-semibold text-gray-700">{cpsScore.tier}</span>
                  </div>
                  {cpsScore.stats && (
                    <div className="bg-white border border-gray-200 flex items-center gap-1 px-2 py-1 rounded-md">
                      <span className="text-xs text-gray-600">{cpsScore.stats.totalDeliveries || 0} trips</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-center">
            <button className="bg-gray-100 h-9 px-4 py-2 rounded-md">
              <span className="text-sm font-medium text-[#171717]">Edit Profile</span>
            </button>
            <button className="bg-gray-100 h-9 w-9 rounded-md flex items-center justify-center">
              <ShareIcon />
            </button>
          </div>
        </div>
      </div>

      {/* CPS Score Card */}
      {cpsScore && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Cargoos Performance Score (CPS)</h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">v{cpsScore.formulaVersion}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Gauge */}
            <div className="flex justify-center">
              <CPSScoreGauge 
                score={cpsScore.finalScore} 
                tier={cpsScore.tier} 
                tierColor={cpsScore.tierColor}
              />
            </div>

            {/* Breakdown */}
            <div className="col-span-2 flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Score Breakdown</h4>
              
              {cpsScore.breakdown.safety && (
                <BreakdownBar 
                  label="🛡️ Safety (40%)"
                  raw={cpsScore.breakdown.safety.raw}
                  weighted={cpsScore.breakdown.safety.weighted}
                  weight={cpsScore.breakdown.safety.weight}
                  color="bg-green-500"
                />
              )}
              
              {cpsScore.breakdown.punctuality && (
                <BreakdownBar 
                  label="⏱️ Punctuality (30%)"
                  raw={cpsScore.breakdown.punctuality.raw}
                  weighted={cpsScore.breakdown.punctuality.weighted}
                  weight={cpsScore.breakdown.punctuality.weight}
                  color="bg-blue-500"
                />
              )}
              
              {cpsScore.breakdown.quality && (
                <BreakdownBar 
                  label="📦 Quality (20%)"
                  raw={cpsScore.breakdown.quality.raw}
                  weighted={cpsScore.breakdown.quality.weighted}
                  weight={cpsScore.breakdown.quality.weight}
                  color="bg-purple-500"
                />
              )}
              
              {cpsScore.breakdown.experience && (
                <BreakdownBar 
                  label={`🎖️ Experience (10%) - ${cpsScore.breakdown.experience.months || 0} months`}
                  raw={cpsScore.breakdown.experience.raw}
                  weighted={cpsScore.breakdown.experience.weighted}
                  weight={cpsScore.breakdown.experience.weight}
                  color="bg-orange-500"
                />
              )}

              {/* Time Decay Adjustment */}
              {cpsScore.decayAdjustment !== undefined && cpsScore.decayAdjustment !== null && cpsScore.decayAdjustment !== 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">⏳ Time Decay Adjustment</span>
                    <span className={`text-sm font-medium ${(cpsScore.decayAdjustment || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(cpsScore.decayAdjustment || 0) > 0 ? '+' : ''}{(cpsScore.decayAdjustment || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendation */}
          {recommendation && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{recommendation.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{recommendation.action}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      {cpsScore?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Accident-Free</p>
            <p className="text-xl font-bold text-green-600">{Math.round(cpsScore.stats.accidentFreeTrips || 100)}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">On-Time</p>
            <p className="text-xl font-bold text-blue-600">{Math.round(cpsScore.stats.onTimeDeliveries || 100)}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Damage-Free</p>
            <p className="text-xl font-bold text-purple-600">{Math.round(cpsScore.stats.damageFreeDeliveries || 100)}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Total Miles</p>
            <p className="text-xl font-bold text-gray-800">{(cpsScore.stats.totalMileage || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        {/* Tab Headers */}
        <div className="flex gap-4 mb-4 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('score')}
            className={`px-4 py-2 rounded-t ${
              activeTab === 'score' ? 'bg-white border border-b-0 border-gray-200 -mb-[3px]' : ''
            }`}
          >
            <span className={`text-sm font-medium ${activeTab === 'score' ? 'text-[#0a376c]' : 'text-[#737373]'}`}>
              Score Details
            </span>
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 rounded-t ${
              activeTab === 'trips' ? 'bg-white border border-b-0 border-gray-200 -mb-[3px]' : ''
            }`}
          >
            <span className={`text-sm font-medium ${activeTab === 'trips' ? 'text-[#0a376c]' : 'text-[#737373]'}`}>
              Trips
            </span>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-t ${
              activeTab === 'badges' ? 'bg-white border border-b-0 border-gray-200 -mb-[3px]' : ''
            }`}
          >
            <span className={`text-sm font-medium ${activeTab === 'badges' ? 'text-[#0a376c]' : 'text-[#737373]'}`}>
              Badges
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'score' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Infractions */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Active Infractions ({infractions?.activeCount || 0})
              </h4>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {infractions?.infractions && infractions.infractions.length > 0 ? (
                  infractions.infractions.filter(i => i.isActive).map((inf) => (
                    <InfractionCard key={inf._id} infraction={inf} />
                  ))
                ) : (
                  <div className="text-center py-8 bg-green-50 rounded-lg">
                    <span className="text-4xl">🎉</span>
                    <p className="text-sm text-green-700 mt-2">No active infractions!</p>
                    <p className="text-xs text-green-600">Keep up the great work</p>
                  </div>
                )}
              </div>
              {infractions && (
                <div className="mt-3 p-2 bg-gray-100 rounded-lg text-xs">
                  <div className="flex justify-between">
                    <span>Total Penalties:</span>
                    <span className="text-red-600 font-medium">{infractions.totalPenalties.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Bonuses:</span>
                    <span className="text-green-600 font-medium">+{infractions.totalBonuses.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Score History */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Score History ({scoreHistory?.count || 0})
              </h4>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {scoreHistory?.history && scoreHistory.history.length > 0 ? (
                  scoreHistory.history.slice(0, 10).map((entry) => (
                    <div key={entry._id} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium text-gray-800">
                            {entry.trigger.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(entry.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${getTierColorClasses(entry.tier).text}`}>
                            {Math.round(entry.score)}%
                          </span>
                          <p className="text-xs text-gray-500">{entry.tier}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <span className="text-4xl">📊</span>
                    <p className="text-sm text-gray-600 mt-2">No score history yet</p>
                    <p className="text-xs text-gray-500">Complete trips to build history</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="flex flex-col gap-3">
            {/* Filters */}
            <div className="flex gap-4 items-center">
              <button className="bg-white border border-gray-200 h-9 px-4 py-2 rounded-md flex items-center gap-2">
                <CalendarDaysIcon />
                <span className="text-sm font-medium text-[#1f1e1e]">Date</span>
              </button>
              <div className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-[200px]">
                <span className="text-sm text-[#737373]">Filter by: Status</span>
                <ChevronDownIcon />
              </div>
            </div>

            {/* Trips List */}
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <span className="text-4xl">🚚</span>
              <p className="text-sm text-gray-600 mt-2">Trip history will appear here</p>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="text-center py-8">
            <span className="text-4xl">🏆</span>
            <p className="text-sm text-gray-600 mt-2">Badges will be implemented here</p>
          </div>
        )}
      </div>

      {/* Formula Reference */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">CPS Formula Reference</h4>
        <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm">
          <span className="text-blue-600">CPS</span> = 
          (<span className="text-green-600">Safety</span> × <span className="text-gray-500">40%</span>) + 
          (<span className="text-blue-600">Punctuality</span> × <span className="text-gray-500">30%</span>) + 
          (<span className="text-purple-600">Quality</span> × <span className="text-gray-500">20%</span>) + 
          (<span className="text-orange-600">Experience</span> × <span className="text-gray-500">10%</span>)
        </div>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-green-50 p-2 rounded">
            <span className="font-medium text-green-700">Safety:</span>
            <span className="text-green-600"> Accident-free %</span>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <span className="font-medium text-blue-700">Punctuality:</span>
            <span className="text-blue-600"> On-time %</span>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <span className="font-medium text-purple-700">Quality:</span>
            <span className="text-purple-600"> Damage-free %</span>
          </div>
          <div className="bg-orange-50 p-2 rounded">
            <span className="font-medium text-orange-700">Experience:</span>
            <span className="text-orange-600"> Months / 12</span>
          </div>
        </div>
      </div>
    </div>
  )
}
