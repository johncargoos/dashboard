'use client'

import { useState } from 'react'
import { LoadsTable } from './LoadsTable'
import { FilterButton } from './FilterButton'
import { type Load } from '@/lib/api/loads'
import { Search, Calendar, ChevronDown, List, Grid, ChevronLeft, ChevronRight } from 'lucide-react'

interface LoadsSectionProps {
  loads: Load[]
  className?: string
}

export function LoadsSection({ loads, className = '' }: LoadsSectionProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'in-transit'>('all')
  const [stateSearch, setStateSearch] = useState('')

  const filteredLoads = loads.filter(load => {
    const matchesFilter = filter === 'all' || load.status === filter
    const matchesState = !stateSearch || 
      load.pickupLocation?.toLowerCase().includes(stateSearch.toLowerCase()) ||
      load.deliveryLocation?.toLowerCase().includes(stateSearch.toLowerCase())
    return matchesFilter && matchesState
  })

  return (
    <div className={`self-stretch flex flex-col justify-start items-start gap-3 ${className}`}>
      {/* Title and View Toggle */}
      <div className="inline-flex justify-start items-center gap-2">
        <div className="w-14 justify-start text-black text-lg font-medium font-['Plus_Jakarta_Sans'] leading-6">
          Loads
        </div>
        <div className="h-9 p-[5px] bg-blue-50 rounded-md flex justify-start items-center">
          <button
            onClick={() => setViewMode('list')}
            className={`h-7 px-3 py-1.5 rounded-md flex justify-start items-center gap-2 ${
              viewMode === 'list' ? 'bg-sky-900' : ''
            }`}
          >
            <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-white' : 'text-gray-600'}`} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`h-7 px-3 py-1.5 rounded-[3px] flex justify-start items-center gap-2 ${
              viewMode === 'grid' ? 'bg-sky-900' : ''
            }`}
          >
            <Grid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-white' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Search, Filter Buttons, and Date - Same Row */}
      <div className="self-stretch inline-flex justify-between items-center">
        {/* Search Bar and Filter Buttons - Left Side */}
        <div className="flex justify-start items-center gap-3">
          {/* Search Bar - 272px width */}
          <div className="w-[272px] inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch h-9 px-3 py-1 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-[#e5e5e5] inline-flex justify-start items-center gap-1 overflow-hidden">
                <div className="w-4 h-4 relative overflow-hidden flex items-center justify-center">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 justify-start text-[#737373] text-sm font-medium font-['Plus_Jakarta_Sans'] leading-5 line-clamp-1">
                  Search Load
                </div>
              </div>
            </div>
          </div>

          {/* State Search Input */}
          <div className="w-[200px] inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch h-9 px-3 py-1 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-[#e5e5e5] inline-flex justify-start items-center gap-1 overflow-hidden">
                <div className="w-4 h-4 relative overflow-hidden flex items-center justify-center">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search State"
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  className="flex-1 text-[#737373] text-sm font-medium font-['Plus_Jakarta_Sans'] leading-5 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filter Buttons - Right after Search */}
          <div className="inline-flex justify-start items-center gap-3">
            <FilterButton
              label="All"
              isActive={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            <div className="h-9 w-px bg-slate-300"></div>
            <div className="flex justify-start items-center gap-3">
              <FilterButton
                label="Completed"
                isActive={filter === 'completed'}
                onClick={() => setFilter('completed')}
              />
              <FilterButton
                label="Pending"
                isActive={filter === 'pending'}
                onClick={() => setFilter('pending')}
              />
              <FilterButton
                label="In Transit"
                isActive={filter === 'in-transit'}
                onClick={() => setFilter('in-transit')}
              />
            </div>
          </div>
        </div>

        {/* Date Button - Right Side */}
        <button
          data-show-left-icon="false"
          data-show-right-icon="true"
          data-size="default"
          data-state="Default"
          data-variant="Secondary"
          className="h-9 px-4 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2"
        >
          <div className="justify-center text-[#0A376C] text-sm font-medium font-['Plus_Jakarta_Sans'] leading-5">
            Date
          </div>
          <div className="w-4 h-4 relative overflow-hidden flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#0A376C]" />
          </div>
        </button>
      </div>

      {/* Table */}
      <div className="self-stretch relative">
        <LoadsTable loads={filteredLoads} />
        
        {/* Pagination */}
        <div className="w-full mt-4 inline-flex justify-between items-center">
          <div className="flex justify-start items-center gap-4">
            <div className="justify-start text-stone-900 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
              Show
            </div>
            <div className="w-20 inline-flex flex-col justify-start items-start gap-2">
              <div className="self-stretch h-9 px-3 py-2 bg-gray-50 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center gap-2 overflow-hidden">
                <div className="flex-1 justify-start text-gray-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5 line-clamp-1">
                  20
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center gap-1">
            <button className="h-9 pl-2.5 pr-4 py-2 rounded-lg flex justify-center items-center gap-1">
              <ChevronLeft className="w-4 h-4 text-stone-900" />
              <div className="justify-center text-stone-900 text-sm font-medium font-['Plus_Jakarta_Sans']">
                Previous
              </div>
            </button>
            <button className="w-9 h-9 rounded-lg flex justify-center items-center">
              <div className="justify-center text-stone-900 text-sm font-medium font-['Plus_Jakarta_Sans']">1</div>
            </button>
            <button className="w-9 h-9 bg-blue-50 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center">
              <div className="justify-center text-sky-900 text-sm font-bold font-['Plus_Jakarta_Sans']">2</div>
            </button>
            <button className="w-9 h-9 rounded-lg flex justify-center items-center">
              <div className="justify-center text-stone-900 text-sm font-medium font-['Plus_Jakarta_Sans']">3</div>
            </button>
            <button className="h-9 pl-4 pr-2.5 py-2 rounded-lg flex justify-center items-center gap-1">
              <div className="justify-center text-stone-900 text-sm font-medium font-['Plus_Jakarta_Sans']">Next</div>
              <ChevronRight className="w-4 h-4 text-stone-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

