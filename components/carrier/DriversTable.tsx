'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { type Driver, deleteDriver, getDrivers } from '@/lib/api/drivers'

interface DriversTableProps {
  drivers: Driver[]
  onCreateDriver: () => void
  viewMode: 'list' | 'grid'
  onViewModeChange?: (mode: 'list' | 'grid') => void
  onDriverDeleted?: () => void // Callback when a driver is deleted
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

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 2.00001C11.5084 1.8249 11.7163 1.68605 11.9447 1.59129C12.1731 1.49653 12.4173 1.44775 12.6667 1.44775C12.916 1.44775 13.1602 1.49653 13.3886 1.59129C13.617 1.68605 13.8249 1.8249 14 2.00001C14.1751 2.17512 14.314 2.38301 14.4087 2.61143C14.5035 2.83984 14.5523 3.08401 14.5523 3.33334C14.5523 3.58267 14.5035 3.82684 14.4087 4.05525C14.314 4.28367 14.1751 4.49156 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z" stroke="#1f1e1e" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2762C12.026 14.5263 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5263 3.72381 14.2762C3.47372 14.0261 3.33334 13.687 3.33334 13.3333V4M5.33334 4V2.66667C5.33334 2.31305 5.47372 1.97391 5.72381 1.72381C5.97391 1.47372 6.31305 1.33334 6.66667 1.33334H9.33334C9.68696 1.33334 10.0261 1.47372 10.2762 1.72381C10.5263 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#1f1e1e" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function DriversTable({ drivers: initialDrivers, onCreateDriver, viewMode, onViewModeChange, onDriverDeleted }: DriversTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [drivers, setDrivers] = useState(initialDrivers)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const itemsPerPage = 7

  // Sync local state with prop changes
  useEffect(() => {
    setDrivers(initialDrivers)
  }, [initialDrivers])

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex)

  const handleViewProfile = (driverId: string) => {
    router.push(`/carrier/drivers/${driverId}`)
  }

  const handleEdit = (e: React.MouseEvent, driverId: string) => {
    e.stopPropagation()
    router.push(`/carrier/drivers/${driverId}/edit`)
  }

  const handleDelete = async (e: React.MouseEvent, driverId: string, driverName: string) => {
    e.stopPropagation()
    
    // Show confirmation dialog
    if (!deleteConfirm || deleteConfirm !== driverId) {
      setDeleteConfirm(driverId)
      return
    }
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${driverName}"? This action cannot be undone.`)) {
      setDeleteConfirm(null)
      return
    }
    
    try {
      setDeletingId(driverId)
      await deleteDriver(driverId)
      
      // Remove driver from list
      setDrivers(prev => prev.filter(d => d.id !== driverId))
      setDeleteConfirm(null)
      
      // Notify parent to refresh the list
      if (onDriverDeleted) {
        onDriverDeleted()
      } else {
        // Fallback: refresh locally
        try {
          const updatedDrivers = await getDrivers()
          setDrivers(updatedDrivers)
        } catch (err) {
          console.error('Error refreshing drivers list:', err)
        }
      }
    } catch (err: any) {
      console.error('Error deleting driver:', err)
      alert(err.message || 'Failed to delete driver. Please try again.')
      setDeleteConfirm(null)
    } finally {
      setDeletingId(null)
    }
  }

  // Score badge colors based on CPS tier system (300-850 range)
  // Exceptional: 750-850 → Green
  // Very Good: 650-749 → Green  
  // Good: 550-649 → Yellow
  // Fair: 450-549 → Orange
  // High Risk: 300-449 → Red
  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return 'bg-gray-500'
    if (score >= 650) return 'bg-green-600'    // Exceptional + Very Good
    if (score >= 550) return 'bg-yellow-500'   // Good
    if (score >= 450) return 'bg-orange-500'   // Fair
    return 'bg-red-600'                         // High Risk (300-449)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 w-full">
      {/* Title and Filters Section */}
      <div className="flex flex-col gap-3 mb-3">
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
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden w-full">
        <div className="flex w-full min-w-full">
          {/* Driver Column */}
          <div className="min-w-[194px] flex-1 flex flex-col">
            <div className="bg-gray-50 border-b border-gray-200 h-10 px-2 py-0 flex items-center">
              <div className="text-sm font-medium text-[#1f1e1e]">Driver</div>
            </div>
            {paginatedDrivers.map((driver) => (
              <div
                key={driver.id}
                className="border-b border-gray-200 h-[53px] px-2 py-2 flex items-center cursor-pointer hover:bg-gray-50"
                onClick={() => handleViewProfile(driver.id)}
              >
                <div className="text-sm text-[#1f1e1e]">{driver.name}</div>
              </div>
            ))}
          </div>

          {/* Phone Number Column */}
          <div className="min-w-[180px] flex-1 flex flex-col">
            <div className="bg-gray-50 border-b border-gray-200 h-10 px-2 py-0 flex items-center">
              <div className="text-sm font-medium text-[#1f1e1e]">Phone Number</div>
            </div>
            {paginatedDrivers.map((driver) => (
              <div
                key={driver.id}
                className="border-b border-gray-200 h-[53px] px-2 py-2 flex items-center"
              >
                <div className="text-sm text-[#1f1e1e]">{driver.phone || '-'}</div>
              </div>
            ))}
          </div>

          {/* Location Column */}
          <div className="min-w-[212px] flex-1 flex flex-col">
            <div className="bg-gray-50 border-b border-gray-200 h-10 px-2 py-0 flex items-center">
              <div className="text-sm font-medium text-[#1f1e1e]">Location</div>
            </div>
            {paginatedDrivers.map((driver) => (
              <div
                key={driver.id}
                className="border-b border-gray-200 h-[53px] px-2 py-2 flex items-center"
              >
                <div className="text-sm text-[#1f1e1e]">{driver.location}</div>
              </div>
            ))}
          </div>

          {/* Score Column */}
          <div className="min-w-[120px] flex-1 flex flex-col">
            <div className="bg-gray-50 border-b border-gray-200 h-10 px-2 py-0 flex items-center">
              <div className="text-sm font-medium text-[#1f1e1e]">Score</div>
            </div>
            {paginatedDrivers.map((driver) => {
              // Handle null, undefined, or 0 scores - display as 350 (initial score)
              const displayScore = (driver.score === null || driver.score === undefined || driver.score === 0) 
                ? 350 
                : driver.score;
              return (
                <div
                  key={driver.id}
                  className="border-b border-gray-200 h-[53px] px-2 py-2 flex items-center"
                >
                  <div className={`px-2 py-1 rounded-md text-xs font-semibold text-white ${getScoreBadgeColor(displayScore)}`}>
                    {displayScore}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Column */}
          <div className="min-w-[120px] flex-1 flex flex-col">
            <div className="bg-gray-50 border-b border-gray-200 h-10 px-2 py-0 flex items-center justify-center">
              <div className="text-sm font-medium text-[#1f1e1e]">Action</div>
            </div>
            {paginatedDrivers.map((driver) => (
              <div
                key={driver.id}
                className="border-b border-gray-200 h-[53px] px-2 py-2 flex items-center justify-center gap-2"
              >
                <button
                  onClick={(e) => handleEdit(e, driver.id)}
                  className="p-1 hover:bg-gray-100 rounded flex items-center justify-center"
                  title="Edit"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={(e) => handleDelete(e, driver.id, driver.name)}
                  disabled={deletingId === driver.id}
                  className={`p-1 hover:bg-gray-100 rounded flex items-center justify-center ${
                    deletingId === driver.id ? 'opacity-50 cursor-not-allowed' : ''
                  } ${deleteConfirm === driver.id ? 'bg-red-100' : ''}`}
                  title={deleteConfirm === driver.id ? 'Click again to confirm deletion' : 'Delete'}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-1 items-center justify-end mt-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-9 px-2.5 py-2 rounded-md flex items-center gap-2.5 disabled:opacity-50"
          >
            <ChevronLeftIcon />
            <span className="text-sm font-medium text-[#1f1e1e]">Previous</span>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-md flex items-center justify-center ${
                    currentPage === page
                      ? 'bg-white border border-[#0a376c]'
                      : ''
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    currentPage === page ? 'text-[#1f1e1e]' : 'text-[#1f1e1e]'
                  }`}>
                    {page}
                  </span>
                </button>
              )
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <div key={page} className="h-9 w-9 flex items-center justify-center">
                  <EllipsisIcon />
                </div>
              )
            }
            return null
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="bg-[#eef6ff] h-9 px-4 py-2 rounded-md flex items-center gap-1 disabled:opacity-50"
          >
            <span className="text-sm font-medium text-[#0a376c]">Next</span>
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  )
}

