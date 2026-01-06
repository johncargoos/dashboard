'use client'

import { useState } from 'react'
import { type Load } from '@/lib/api/loads'

interface LoadManagerTableProps {
  loads: Load[]
  onCreateLoad: () => void
  onEditLoad?: (load: Load) => void
  onDeleteLoad?: (loadId: string) => void
  onViewLoad?: (load: Load) => void
}

// Icons
const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="3" height="4" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <rect x="6.5" y="6" width="3" height="8" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
  </svg>
)

const MapPinnedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2C6.34315 2 5 3.34315 5 5C5 7 8 12 8 12C8 12 11 7 11 5C11 3.34315 9.65685 2 8 2Z" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <circle cx="8" cy="5" r="1.5" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
  </svg>
)

const GaugeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <path d="M8 2C10.2091 2 12 3.79086 12 6" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
    <path d="M8 2L10 6L8 8L6 6Z" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
  </svg>
)

const FlagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 2V14" stroke="#1f1e1e" strokeWidth="1.33" strokeLinecap="round"/>
    <path d="M3 2L9 2L7 6L9 10L3 10" stroke="#1f1e1e" strokeWidth="1.33" fill="none"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="#737373" strokeWidth="1.33" fill="none"/>
    <path d="M12 12L14.5 14.5" stroke="#737373" strokeWidth="1.33" strokeLinecap="round"/>
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4L6 8L10 12" stroke="#1f1e1e" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4L10 8L6 12" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const EllipsisIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="8" r="1" fill="#0a0a0a"/>
    <circle cx="8" cy="8" r="1" fill="#0a0a0a"/>
    <circle cx="12" cy="8" r="1" fill="#0a0a0a"/>
  </svg>
)

const LoaderIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="#e17100" strokeWidth="1.25" fill="none"/>
  </svg>
)

const CircleCheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="#00a63e" strokeWidth="1.25" fill="none"/>
    <path d="M4 6L5.5 7.5L8 5" stroke="#00a63e" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PendingIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="#737373" strokeWidth="1.25" fill="none"/>
    <path d="M6 3V6L8 8" stroke="#737373" strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 2.00001C11.5084 1.8249 11.7163 1.68601 11.9447 1.59124C12.1731 1.49647 12.4173 1.44775 12.6638 1.44775C12.9103 1.44775 13.1545 1.49647 13.3829 1.59124C13.6113 1.68601 13.8192 1.8249 13.9943 2.00001C14.1694 2.17512 14.3083 2.38301 14.4031 2.61141C14.4979 2.83981 14.5466 3.08401 14.5466 3.33051C14.5466 3.57701 14.4979 3.82121 14.4031 4.04961C14.3083 4.27801 14.1694 4.4859 13.9943 4.66101L5.32434 13.331L1.33334 14.6667L2.669 10.6757L11.3333 2.00001Z" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33334 13.687 3.33334 13.3333V4M5.33334 4V2.66667C5.33334 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66667 1.33334H9.33334C9.68696 1.33334 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#dc2626" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2.66667C4.66667 2.66667 2 6 2 8C2 10 4.66667 13.3333 8 13.3333C11.3333 13.3333 14 10 14 8C14 6 11.3333 2.66667 8 2.66667Z" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
    <circle cx="8" cy="8" r="2" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
  </svg>
)

// Score range options
const SCORE_RANGES = [
  { label: 'All Scores', value: 'all', min: 0, max: 1000 },
  { label: 'High Risk (0-300)', value: '0-300', min: 0, max: 300 },
  { label: 'Fair (300-580)', value: '300-580', min: 300, max: 580 },
  { label: 'Good (580-670)', value: '580-670', min: 580, max: 670 },
  { label: 'Very Good (670-740)', value: '670-740', min: 670, max: 740 },
  { label: 'Excellent (740-800)', value: '740-800', min: 740, max: 800 },
  { label: 'Exceptional (800+)', value: '800+', min: 800, max: 1000 },
]

// US Regions for filtering
const US_REGIONS: Record<string, string[]> = {
  'Northeast': ['Maine', 'New Hampshire', 'Vermont', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania'],
  'Southeast': ['Delaware', 'Maryland', 'Virginia', 'West Virginia', 'Kentucky', 'Tennessee', 'North Carolina', 'South Carolina', 'Georgia', 'Florida', 'Alabama', 'Mississippi', 'Arkansas', 'Louisiana'],
  'Midwest': ['Ohio', 'Michigan', 'Indiana', 'Illinois', 'Wisconsin', 'Minnesota', 'Iowa', 'Missouri', 'North Dakota', 'South Dakota', 'Nebraska', 'Kansas'],
  'Southwest': ['Texas', 'Oklahoma', 'New Mexico', 'Arizona'],
  'West Coast': ['California', 'Nevada', 'Oregon', 'Washington'],
  'Mountain States': ['Montana', 'Idaho', 'Wyoming', 'Colorado', 'Utah'],
}

export function LoadManagerTable({ loads, onCreateLoad, onEditLoad, onDeleteLoad, onViewLoad }: LoadManagerTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-transit' | 'completed'>('all')
  const [scoreRangeFilter, setScoreRangeFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isScoreRangeDropdownOpen, setIsScoreRangeDropdownOpen] = useState(false)
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)
  const itemsPerPage = 7

  // Fuzzy search function
  const fuzzyMatch = (text: string, query: string): boolean => {
    if (!query) return true
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    
    // Exact match
    if (lowerText.includes(lowerQuery)) return true
    
    // Fuzzy match: check if all query characters appear in order
    let queryIndex = 0
    for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
      if (lowerText[i] === lowerQuery[queryIndex]) {
        queryIndex++
      }
    }
    return queryIndex === lowerQuery.length
  }

  const filteredLoads = loads.filter(load => {
    // Fuzzy search across multiple fields
    const matchesSearch = 
      fuzzyMatch(load.loadNo, searchQuery) ||
      fuzzyMatch(load.company, searchQuery) ||
      (load.driver && fuzzyMatch(load.driver, searchQuery)) ||
      fuzzyMatch(load.pickupLocation, searchQuery) ||
      fuzzyMatch(load.deliveryLocation, searchQuery)
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || load.status === statusFilter
    
    // Score range filter
    const matchesScore = (() => {
      if (scoreRangeFilter === 'all') return true
      const range = SCORE_RANGES.find(r => r.value === scoreRangeFilter)
      if (!range) return true
      const score = load.score ?? 0
      if (range.value === '800+') {
        return score >= range.min
      }
      return score >= range.min && score < range.max
    })()
    
    // Region filter (based on pickup or delivery state)
    const matchesRegion = (() => {
      if (regionFilter === 'all') return true
      const regionStates = US_REGIONS[regionFilter]
      if (!regionStates) return true
      const pickupState = load.pickup?.state || ''
      const deliveryState = load.delivery?.state || ''
      return regionStates.some(state => 
        pickupState.toLowerCase().includes(state.toLowerCase()) ||
        deliveryState.toLowerCase().includes(state.toLowerCase())
      )
    })()
    
    return matchesSearch && matchesStatus && matchesScore && matchesRegion
  })

  const totalPages = Math.ceil(filteredLoads.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLoads = filteredLoads.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5">
      <div className="flex flex-col gap-4">
        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#333333] tracking-[-0.4px]">Load Manager</h2>

        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            {/* Score Range Filter */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsScoreRangeDropdownOpen(!isScoreRangeDropdownOpen)
                  setIsStatusDropdownOpen(false)
                  setIsRegionDropdownOpen(false)
                }}
                className={`bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2 ${
                  scoreRangeFilter !== 'all' ? 'border-[#0a376c] bg-[#eef6ff]' : ''
                }`}
              >
                <BarChartIcon />
                <span className="text-sm font-medium text-[#1f1e1e]">
                  Score Range {scoreRangeFilter !== 'all' ? `(${SCORE_RANGES.find(r => r.value === scoreRangeFilter)?.label.split(' ')[0]})` : ''}
                </span>
              </button>
              {isScoreRangeDropdownOpen && (
                <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[200px] max-h-60 overflow-auto">
                  {SCORE_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setScoreRangeFilter(range.value)
                        setIsScoreRangeDropdownOpen(false)
                        setCurrentPage(1)
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Region Filter */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsRegionDropdownOpen(!isRegionDropdownOpen)
                  setIsStatusDropdownOpen(false)
                  setIsScoreRangeDropdownOpen(false)
                }}
                className={`bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2 ${
                  regionFilter !== 'all' ? 'border-[#0a376c] bg-[#eef6ff]' : ''
                }`}
              >
                <MapPinnedIcon />
                <span className="text-sm font-medium text-[#1f1e1e]">
                  Region {regionFilter !== 'all' ? `(${regionFilter})` : ''}
                </span>
              </button>
              {isRegionDropdownOpen && (
                <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[150px] max-h-60 overflow-auto">
                  <button
                    onClick={() => {
                      setRegionFilter('all')
                      setIsRegionDropdownOpen(false)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    All Regions
                  </button>
                  {Object.keys(US_REGIONS).map((region) => (
                    <button
                      key={region}
                      onClick={() => {
                        setRegionFilter(region)
                        setIsRegionDropdownOpen(false)
                        setCurrentPage(1)
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={`bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2 ${
                  statusFilter !== 'all' ? 'border-[#0a376c] bg-[#eef6ff]' : ''
                }`}
              >
                <GaugeIcon />
                <span className="text-sm font-medium text-[#1f1e1e]">
                  Status {statusFilter !== 'all' ? `(${statusFilter})` : ''}
                </span>
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[150px]">
                  <button
                    onClick={() => {
                      setStatusFilter('all')
                      setIsStatusDropdownOpen(false)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    All Statuses
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('pending')
                      setIsStatusDropdownOpen(false)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('in-transit')
                      setIsStatusDropdownOpen(false)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    In Transit
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('completed')
                      setIsStatusDropdownOpen(false)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    Completed
                  </button>
                </div>
              )}
            </div>
            {/* Flags Filter - For future use (e.g., priority loads, special handling) */}
            <button 
              className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
              title="Flags filter coming soon"
            >
              <FlagIcon />
              <span className="text-sm font-medium text-[#1f1e1e]">Flags</span>
            </button>
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
              onClick={onCreateLoad}
              className="bg-[#0a376c] h-9 px-4 py-2 rounded-md flex items-center justify-center"
            >
              <span className="text-sm font-medium text-white">Create Load</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden w-full overflow-x-auto">
          <div className="flex w-full min-w-max">
            {/* Load No. Column */}
            <div className="min-w-[128px] flex-1 flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 h-10 px-2 flex items-center">
                <span className="text-sm font-medium text-[#0a0a0a]">Load No.</span>
              </div>
              {paginatedLoads.map((load, idx) => (
                <div key={load.loadNo} className={`border-b border-gray-200 h-[53px] px-2 flex items-center ${idx === paginatedLoads.length - 1 ? 'border-b-0' : ''}`}>
                  <span className="text-sm text-[#0a0a0a]">{load.loadNo}</span>
                </div>
              ))}
            </div>

            {/* Score Column */}
            <div className="min-w-[96px] flex-1 flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 h-10 px-2 flex items-center justify-center">
                <span className="text-sm font-medium text-[#0a0a0a]">Score</span>
              </div>
              {paginatedLoads.map((load, idx) => (
                <div key={load.loadNo} className={`border-b border-gray-200 h-[53px] px-2 flex items-center justify-center ${idx === paginatedLoads.length - 1 ? 'border-b-0' : ''}`}>
                  <span className="text-sm text-[#0a0a0a]">
                    {load.score !== null && load.score !== undefined ? load.score : '-'}
                  </span>
                </div>
              ))}
            </div>

            {/* Company Column */}
            <div className="min-w-[148px] flex-1 flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 h-10 px-2 flex items-center">
                <span className="text-sm font-medium text-[#0a0a0a]">Company</span>
              </div>
              {paginatedLoads.map((load, idx) => (
                <div key={load.loadNo} className={`border-b border-gray-200 h-[53px] px-2 flex items-center ${idx === paginatedLoads.length - 1 ? 'border-b-0' : ''}`}>
                  <span className="text-sm text-[#0a0a0a] truncate">{load.company}</span>
                </div>
              ))}
            </div>

            {/* Pickup Location Column */}
            <div className="min-w-[183px] flex-1 flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 h-10 px-2 flex items-center">
                <span className="text-sm font-medium text-[#0a0a0a]">Pickup Location</span>
              </div>
              {paginatedLoads.map((load, idx) => (
                <div key={load.loadNo} className={`border-b border-gray-200 h-[53px] px-2 flex items-center ${idx === paginatedLoads.length - 1 ? 'border-b-0' : ''}`}>
                  <span className="text-sm text-[#0a0a0a] truncate">{load.pickupLocation}</span>
                </div>
              ))}
            </div>

            {/* Delivery Location Column */}
            <div className="min-w-[183px] flex-1 flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 h-10 px-2 flex items-center">
                <span className="text-sm font-medium text-[#0a0a0a]">Delivery Location</span>
              </div>
              {paginatedLoads.map((load, idx) => (
                <div key={load.loadNo} className={`border-b border-gray-200 h-[53px] px-2 flex items-center ${idx === paginatedLoads.length - 1 ? 'border-b-0' : ''}`}>
                  <span className="text-sm text-[#0a0a0a] truncate">{load.deliveryLocation}</span>
                </div>
              ))}
            </div>

            {/* Driver Column */}
            <div className="min-w-[155px] flex-1 flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 h-10 px-2 flex items-center">
                <span className="text-sm font-medium text-[#0a0a0a]">Driver</span>
              </div>
              {paginatedLoads.map((load, idx) => (
                <div key={load.loadNo} className={`border-b border-gray-200 h-[53px] px-2 flex items-center ${idx === paginatedLoads.length - 1 ? 'border-b-0' : ''}`}>
                  <span className="text-sm text-[#0a0a0a] truncate">
                    {load.driver || 'Unassigned'}
                  </span>
                </div>
              ))}
            </div>

            {/* Status Column */}
            <div className="min-w-[125px] flex-1 flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 h-10 px-2 flex items-center">
                <span className="text-sm font-medium text-[#0a0a0a]">Status</span>
              </div>
              {paginatedLoads.map((load, idx) => (
                <div key={load.loadNo} className={`border-b border-gray-200 h-[53px] px-2 flex items-center ${idx === paginatedLoads.length - 1 ? 'border-b-0' : ''}`}>
                  {load.status === 'pending' ? (
                    <div className="bg-white border border-[#737373] rounded-md px-2 py-0.5 flex items-center gap-1">
                      <PendingIcon />
                      <span className="text-xs font-semibold text-[#0a0a0a]">Pending</span>
                    </div>
                  ) : load.status === 'in-transit' ? (
                    <div className="bg-white border border-[#e17100] rounded-md px-2 py-0.5 flex items-center gap-1">
                      <LoaderIcon />
                      <span className="text-xs font-semibold text-[#0a0a0a]">In Transit</span>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#00a63e] rounded-md px-2 py-0.5 flex items-center gap-1">
                      <CircleCheckIcon />
                      <span className="text-xs font-semibold text-[#0a0a0a]">Completed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Column */}
            <div className="min-w-[140px] flex-1 flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 h-10 px-2 flex items-center">
                <span className="text-sm font-medium text-[#0a0a0a]">Action</span>
              </div>
              {paginatedLoads.map((load, idx) => (
                <div key={load.loadNo} className={`border-b border-gray-200 h-[53px] px-2 flex items-center gap-2 ${idx === paginatedLoads.length - 1 ? 'border-b-0' : ''}`}>
                  {onViewLoad && (
                    <button
                      onClick={() => onViewLoad(load)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="View load details"
                    >
                      <ViewIcon />
                    </button>
                  )}
                  {onEditLoad && (
                    <button
                      onClick={() => onEditLoad(load)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="Edit load"
                    >
                      <EditIcon />
                    </button>
                  )}
                  {onDeleteLoad && load.id && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete load ${load.loadNo}?`)) {
                          onDeleteLoad(load.id!)
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      title="Delete load"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(isStatusDropdownOpen || isScoreRangeDropdownOpen || isRegionDropdownOpen) && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsStatusDropdownOpen(false)
              setIsScoreRangeDropdownOpen(false)
              setIsRegionDropdownOpen(false)
            }}
          />
        )}

        {/* Pagination */}
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-9 pl-2.5 pr-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            <ChevronLeftIcon />
            <span className="text-sm font-medium text-[#1f1e1e]">Previous</span>
          </button>
          
          {/* Smart pagination - show first, last, current, and neighbors */}
          {totalPages > 0 && (
            <>
              {/* First page */}
              {currentPage > 3 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-gray-100"
                  >
                    <span className="text-sm font-medium text-[#0a0a0a]">1</span>
                  </button>
                  {currentPage > 4 && (
                    <div className="h-9 w-9 flex items-center justify-center">
                      <EllipsisIcon />
                    </div>
                  )}
                </>
              )}

              {/* Page numbers around current */}
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1) ||
                  (currentPage <= 3 && page <= 5) ||
                  (currentPage >= totalPages - 2 && page >= totalPages - 4)
                
                if (!showPage) return null
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-md flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-white border border-[#0a376c]'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className={`text-sm font-medium ${currentPage === page ? 'text-[#0a0a0a]' : 'text-[#0a0a0a]'}`}>
                      {page}
                    </span>
                  </button>
                )
              }).filter(Boolean)}

              {/* Last page */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <div className="h-9 w-9 flex items-center justify-center">
                      <EllipsisIcon />
                    </div>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-gray-100"
                  >
                    <span className="text-sm font-medium text-[#0a0a0a]">{totalPages}</span>
                  </button>
                </>
              )}
            </>
          )}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-9 pl-4 pr-2.5 py-2 bg-[#eef6ff] rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            <span className="text-sm font-medium text-[#0a376c]">Next</span>
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

