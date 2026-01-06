'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type Driver } from '@/lib/api/drivers'

interface DriversGridProps {
  drivers: Driver[]
  onCreateDriver: () => void
  viewMode: 'list' | 'grid'
  onViewModeChange?: (mode: 'list' | 'grid') => void
}

// Icons
const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="3" height="4" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <rect x="6.5" y="6" width="3" height="8" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
  </svg>
)

const PackageOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2L3 5V11L8 14L13 11V5L8 2Z" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <path d="M3 5L8 8L13 5" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <path d="M8 8V14" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
  </svg>
)

const GaugeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <path d="M8 2C10.2091 2 12 3.79086 12 6" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <path d="M8 2L10 6L8 8L6 6Z" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
  </svg>
)

const ListTodoIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="12" height="2" rx="0.5" fill={isActive ? 'white' : '#90a1b9'}/>
    <rect x="2" y="7" width="12" height="2" rx="0.5" fill={isActive ? 'white' : '#90a1b9'}/>
    <rect x="2" y="11" width="12" height="2" rx="0.5" fill={isActive ? 'white' : '#90a1b9'}/>
  </svg>
)

const LayoutGridIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="5" height="5" rx="0.5" stroke={isActive ? 'white' : '#90a1b9'} strokeWidth="1.33" fill="none"/>
    <rect x="9" y="2" width="5" height="5" rx="0.5" stroke={isActive ? 'white' : '#90a1b9'} strokeWidth="1.33" fill="none"/>
    <rect x="2" y="9" width="5" height="5" rx="0.5" stroke={isActive ? 'white' : '#90a1b9'} strokeWidth="1.33" fill="none"/>
    <rect x="9" y="9" width="5" height="5" rx="0.5" stroke={isActive ? 'white' : '#90a1b9'} strokeWidth="1.33" fill="none"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="#737373" strokeWidth="1.33" fill="none"/>
    <path d="M12 12L14.5 14.5" stroke="#737373" strokeWidth="1.33" strokeLinecap="round"/>
  </svg>
)

const EllipsisIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="12" r="1.5" fill="#0a0a0a"/>
    <circle cx="12" cy="12" r="1.5" fill="#0a0a0a"/>
    <circle cx="18" cy="12" r="1.5" fill="#0a0a0a"/>
  </svg>
)

const CrownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" stroke="white" strokeWidth="1" fill="none"/>
  </svg>
)

const TriangleAlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1L10 10H2L6 1Z" stroke="white" strokeWidth="1" fill="none"/>
    <path d="M6 7V9M6 4V5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
  </svg>
)

const PercentIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="#0a0a0a" strokeWidth="1" fill="none"/>
    <path d="M3 3L9 9M9 3L3 9" stroke="#0a0a0a" strokeWidth="1" strokeLinecap="round"/>
  </svg>
)

// Score badge colors based on CPS tier system (300-850 range)
// Exceptional: 750-850 → Green (crown)
// Very Good: 650-749 → Green (crown)
// Good: 550-649 → Yellow (crown)
// Fair: 450-549 → Orange (crown)
// High Risk: 300-449 → Red (alert)
const getScoreBadgeColor = (score: number | null): { bg: string; icon: JSX.Element } => {
  if (score === null) return { bg: '#e7000b', icon: <TriangleAlertIcon /> }  // Red for unknown
  if (score >= 650) return { bg: '#008236', icon: <CrownIcon /> }            // Green for Exceptional + Very Good
  if (score >= 550) return { bg: '#d4a700', icon: <CrownIcon /> }            // Yellow for Good
  if (score >= 450) return { bg: '#d08700', icon: <CrownIcon /> }            // Orange for Fair
  return { bg: '#e7000b', icon: <TriangleAlertIcon /> }                       // Red for High Risk (300-449)
}

export function DriversGrid({ drivers, onCreateDriver, viewMode, onViewModeChange }: DriversGridProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewProfile = (driverId: string) => {
    router.push(`/carrier/drivers/${driverId}`)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 w-full">
      {/* Title and Filters Section */}
      <div className="flex flex-col gap-3 mb-4">
        <h2 className="text-[20px] font-bold text-[#333333] tracking-[-0.4px]">Drivers</h2>
        
        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-3 items-center">
              <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
                <BarChartIcon />
                <span className="text-sm font-medium text-[#1f1e1e]">Score</span>
              </button>
              <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
                <PackageOpenIcon />
                <span className="text-sm font-medium text-[#1f1e1e]">Load Type</span>
              </button>
              <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
                <GaugeIcon />
                <span className="text-sm font-medium text-[#1f1e1e]">Acceptance Rate</span>
              </button>
            </div>
            
            {/* View Toggle */}
            <div className="bg-[#eef6ff] h-9 p-1 rounded-md flex items-center">
              <button
                onClick={() => onViewModeChange?.('list')}
                className={`h-7 px-3 py-1.5 rounded-md flex items-center gap-2 ${
                  viewMode === 'list' ? 'bg-[#0a376c]' : ''
                }`}
              >
                <ListTodoIcon isActive={viewMode === 'list'} />
              </button>
              <button
                onClick={() => onViewModeChange?.('grid')}
                className={`h-7 px-3 py-1.5 rounded-md flex items-center gap-2 ${
                  viewMode === 'grid' ? 'bg-[#0a376c]' : ''
                }`}
              >
                <LayoutGridIcon isActive={viewMode === 'grid'} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-[272px] h-9 px-3 py-1 bg-white border border-gray-200 rounded-md flex items-center gap-1">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm text-[#737373] outline-none"
              />
            </div>
            <button
              onClick={onCreateDriver}
              className="bg-[#0a376c] h-9 px-4 py-2 rounded-md flex items-center justify-center shadow-sm"
            >
              <span className="text-sm font-medium text-white">Create Driver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex gap-4 flex-wrap">
        {filteredDrivers.map((driver) => {
          // Handle null, undefined, or 0 scores - display as 350 (initial score)
          const displayScore = (driver.score === null || driver.score === undefined || driver.score === 0) 
            ? 350 
            : driver.score;
          const scoreBadge = getScoreBadgeColor(displayScore)
          return (
            <div
              key={driver.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-4 w-[207px] h-[257px] relative"
            >
              {/* Ellipsis Menu */}
              <div className="absolute top-2.5 right-2.5 cursor-pointer">
                <EllipsisIcon />
              </div>

              {/* Avatar and Info */}
              <div className="flex flex-col gap-4 items-center mt-6">
                {/* Avatar */}
                <div className="w-[59px] h-[59px] rounded-full bg-gray-100 flex items-center justify-center">
                  {'avatar' in driver && (driver as any).avatar ? (
                    <img src={(driver as any).avatar} alt={driver.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" stroke="#6a7280" strokeWidth="1.5" fill="none"/>
                      <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="#6a7280" strokeWidth="1.5" fill="none"/>
                    </svg>
                  )}
                </div>

                {/* Name and Email */}
                <div className="flex flex-col gap-2 items-center text-center">
                  <h3 className="text-base font-medium text-black">{driver.name}</h3>
                  <p className="text-sm text-[#737373]">{driver.email || 'N/A'}</p>
                </div>

                {/* Badges */}
                <div className="flex gap-2.25 items-center justify-center">
                  {/* Score Badge - always show (default to 350) */}
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: scoreBadge.bg }}
                  >
                    {scoreBadge.icon}
                    <span className="text-xs font-semibold text-white">Score: {displayScore}</span>
                  </div>
                  
                  {/* Acceptance Rate Badge */}
                  <div className="bg-white border border-gray-200 flex items-center gap-1 px-2 py-0.5 rounded-md">
                    <span className="text-xs font-semibold text-[#1f1e1e]">{driver.acceptanceRate}</span>
                    <PercentIcon />
                  </div>
                </div>

                {/* View Profile Button */}
                <button
                  onClick={() => handleViewProfile(driver.id)}
                  className="bg-[#eef6ff] w-full h-8 px-3 py-2 rounded-md flex items-center justify-center shadow-sm"
                >
                  <span className="text-xs font-medium text-[#0a376c]">View Profile</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

