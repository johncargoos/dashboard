'use client'

interface DriversEmptyProps {
  onCreateDriver: () => void
  onViewModeChange?: (mode: 'list' | 'grid') => void
}

const ListTodoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="12" height="2" rx="0.5" fill="#eef6ff"/>
    <rect x="2" y="7" width="12" height="2" rx="0.5" fill="#90a1b9"/>
    <rect x="2" y="11" width="12" height="2" rx="0.5" fill="#90a1b9"/>
  </svg>
)

const LayoutGridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="5" height="5" rx="0.5" stroke="#90a1b9" strokeWidth="1.33" fill="none"/>
    <rect x="9" y="2" width="5" height="5" rx="0.5" stroke="#90a1b9" strokeWidth="1.33" fill="none"/>
    <rect x="2" y="9" width="5" height="5" rx="0.5" stroke="#90a1b9" strokeWidth="1.33" fill="none"/>
    <rect x="9" y="9" width="5" height="5" rx="0.5" stroke="#90a1b9" strokeWidth="1.33" fill="none"/>
  </svg>
)

export function DriversEmpty({ onCreateDriver, onViewModeChange }: DriversEmptyProps) {
  return (
    <div className="w-full">
      {/* Title and Filters Section */}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-[20px] font-bold text-[#1f1e1e] tracking-[-0.4px]">Drivers</h2>
        
        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="10" width="3" height="4" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33"/>
                <rect x="6.5" y="6" width="3" height="8" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33"/>
                <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33"/>
              </svg>
              <span className="text-sm font-medium text-[#1f1e1e]">Score</span>
            </button>
            <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C6.34315 2 5 3.34315 5 5C5 7 8 12 8 12C8 12 11 7 11 5C11 3.34315 9.65685 2 8 2Z" stroke="#1f1e1e" strokeWidth="1.33"/>
                <circle cx="8" cy="5" r="1.5" stroke="#1f1e1e" strokeWidth="1.33"/>
              </svg>
              <span className="text-sm font-medium text-[#1f1e1e]">Load Type</span>
            </button>
            <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14" stroke="#1f1e1e" strokeWidth="1.33"/>
                <path d="M8 2C10.2091 2 12 3.79086 12 6" stroke="#1f1e1e" strokeWidth="1.33"/>
                <path d="M8 2L10 6L8 8L6 6Z" stroke="#1f1e1e" strokeWidth="1.33"/>
              </svg>
              <span className="text-sm font-medium text-[#1f1e1e]">Acceptance Rate</span>
            </button>
            
            {/* View Toggle */}
            <div className="bg-[#eef6ff] h-9 p-1 rounded-md flex items-center">
              <button
                onClick={() => onViewModeChange?.('list')}
                className="h-7 px-3 py-1.5 rounded-md flex items-center gap-2 bg-[#0a376c]"
              >
                <ListTodoIcon />
              </button>
              <button
                onClick={() => onViewModeChange?.('grid')}
                className="h-7 px-3 py-1.5 rounded-md flex items-center gap-2"
              >
                <LayoutGridIcon />
              </button>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-[272px] h-9 px-3 py-1 bg-white border border-gray-200 rounded-md flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#737373" strokeWidth="1.33"/>
                <path d="M12 12L14.5 14.5" stroke="#737373" strokeWidth="1.33" strokeLinecap="round"/>
              </svg>
              <span className="text-sm text-[#737373]">Search</span>
            </div>
            <button
              onClick={onCreateDriver}
              className="bg-[#0a376c] h-9 px-4 py-2 rounded-md flex items-center justify-center"
            >
              <span className="text-sm font-semibold text-white">Create Driver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State Content */}
      <div className="flex flex-col items-center justify-center min-h-[557px] gap-6">
        {/* Illustration and Text Section */}
        <div className="flex flex-col gap-6 items-center">
          {/* Illustration - Complex illustration from Figma */}
          <div className="w-[275px] h-[275px] relative flex items-center justify-center">
            <svg width="275" height="275" viewBox="0 0 275 275" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Main elements from the illustration */}
              <g opacity="0.8">
                <rect x="38" y="98" width="108" height="68" rx="4" stroke="#62748e" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
                <rect x="38" y="88" width="108" height="15" rx="2" stroke="#62748e" strokeWidth="2" fill="none"/>
                <path d="M92 88L92 78M92 78L86 72M92 78L98 72" stroke="#62748e" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
                <circle cx="58" cy="118" r="3" fill="#62748e" opacity="0.3"/>
                <circle cx="106" cy="118" r="3" fill="#62748e" opacity="0.3"/>
                <circle cx="58" cy="143" r="3" fill="#62748e" opacity="0.3"/>
                <circle cx="106" cy="143" r="3" fill="#62748e" opacity="0.3"/>
              </g>
              <g opacity="0.6">
                <rect x="115" y="98" width="54" height="34" rx="2" stroke="#62748e" strokeWidth="1.5" fill="none"/>
                <circle cx="130" cy="115" r="2" fill="#62748e" opacity="0.3"/>
                <circle cx="154" cy="115" r="2" fill="#62748e" opacity="0.3"/>
              </g>
              <g opacity="0.4">
                <circle cx="187" cy="98" r="4" fill="#62748e" opacity="0.2"/>
                <circle cx="200" cy="98" r="3" fill="#62748e" opacity="0.2"/>
                <circle cx="187" cy="143" r="2" fill="#62748e" opacity="0.2"/>
              </g>
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-3 items-center text-center">
            <h3 className="text-[16px] font-normal text-[#62748e] leading-6 max-w-[812px]">
              Oops, you have empty no driver listed. Add a driver by clicking the button below.
            </h3>
          </div>

          {/* CTA Button */}
          <button
            onClick={onCreateDriver}
            className="bg-[#0a376c] h-9 px-4 py-2 rounded-md flex items-center justify-center"
          >
            <span className="text-sm font-medium text-white">+ Add New Driver</span>
          </button>
        </div>

        {/* Feature Cards */}
        <div className="flex gap-4 items-center w-full justify-center mt-8">
          {/* Track Performance Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 flex flex-col gap-2.5 w-[260px] h-[134px]">
            <div className="flex flex-col gap-2">
              <div className="bg-[#eef6ff] w-9 h-9 rounded-md flex items-center justify-center shadow-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="10" width="3" height="4" rx="0.5" stroke="#0a376c" strokeWidth="1.33"/>
                  <rect x="6.5" y="6" width="3" height="8" rx="0.5" stroke="#0a376c" strokeWidth="1.33"/>
                  <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="#0a376c" strokeWidth="1.33"/>
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-[#1f1e1e] leading-5">Track Performance</h4>
              <p className="text-sm font-medium text-[#45556c] leading-5">
                Monitor driver scores and metrics
              </p>
            </div>
          </div>

          {/* Manage Schedule Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 flex flex-col gap-2.5 w-[260px] h-[134px]">
            <div className="flex flex-col gap-2">
              <div className="bg-[#eef6ff] w-9 h-9 rounded-md flex items-center justify-center shadow-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="4" width="12" height="10" rx="1" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
                  <path d="M5 2V6M11 2V6" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round"/>
                  <path d="M2 8H14" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-[#1f1e1e] leading-5">Manage Schedule</h4>
              <p className="text-sm font-medium text-[#45556c] leading-5">
                Assign loads and track delivery times
              </p>
            </div>
          </div>

          {/* Ensure Compliance Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 flex flex-col gap-2.5 w-[260px] h-[134px]">
            <div className="flex flex-col gap-2">
              <div className="bg-[#eef6ff] w-9 h-9 rounded-md flex items-center justify-center shadow-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L9.5 5.5L13 6.5L10.5 9L11 12.5L8 11L5 12.5L5.5 9L3 6.5L6.5 5.5L8 2Z" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-[#1f1e1e] leading-5">Ensure Compliance</h4>
              <p className="text-sm font-medium text-[#45556c] leading-5">
                Keep driver records up to date
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

