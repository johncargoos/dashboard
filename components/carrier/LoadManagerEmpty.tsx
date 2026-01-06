'use client'

interface LoadManagerEmptyProps {
  onCreateLoad: () => void
}

// Icons
const MapPinnedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2C6.34315 2 5 3.34315 5 5C5 7 8 12 8 12C8 12 11 7 11 5C11 3.34315 9.65685 2 8 2Z" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
    <circle cx="8" cy="5" r="1.5" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
  </svg>
)

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="8" width="6" height="4" rx="0.5" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
    <path d="M8 10H10L12 8V10H13C13.5523 10 14 10.4477 14 11V12" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
    <circle cx="4" cy="13" r="1.5" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
    <circle cx="12" cy="13" r="1.5" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
  </svg>
)

const AreaChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12L5 8L8 10L13 4V12H2Z" stroke="#0a376c" strokeWidth="1.33" fill="none" fillOpacity="0.2"/>
    <path d="M2 12L5 8L8 10L13 4" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
    <circle cx="2" cy="12" r="1" fill="#0a376c"/>
    <circle cx="5" cy="8" r="1" fill="#0a376c"/>
    <circle cx="8" cy="10" r="1" fill="#0a376c"/>
    <circle cx="13" cy="4" r="1" fill="#0a376c"/>
  </svg>
)

export function LoadManagerEmpty({ onCreateLoad }: LoadManagerEmptyProps) {
  return (
    <div className="w-full">
      {/* Title and Filters Section */}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-[20px] font-bold text-[#1f1e1e] tracking-[-0.4px]">Load Manager</h2>
        
        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="10" width="3" height="4" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33"/>
                <rect x="6.5" y="6" width="3" height="8" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33"/>
                <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="#1f1e1e" strokeWidth="1.33"/>
              </svg>
              <span className="text-sm font-medium text-[#1f1e1e]">Score Range</span>
            </button>
            <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C6.34315 2 5 3.34315 5 5C5 7 8 12 8 12C8 12 11 7 11 5C11 3.34315 9.65685 2 8 2Z" stroke="#1f1e1e" strokeWidth="1.33"/>
                <circle cx="8" cy="5" r="1.5" stroke="#1f1e1e" strokeWidth="1.33"/>
              </svg>
              <span className="text-sm font-medium text-[#1f1e1e]">Region</span>
            </button>
            <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14" stroke="#1f1e1e" strokeWidth="1.33"/>
                <path d="M8 2C10.2091 2 12 3.79086 12 6" stroke="#1f1e1e" strokeWidth="1.33"/>
                <path d="M8 2L10 6L8 8L6 6Z" stroke="#1f1e1e" strokeWidth="1.33"/>
              </svg>
              <span className="text-sm font-medium text-[#1f1e1e]">Status</span>
            </button>
            <button className="bg-white border border-gray-200 rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 2V14" stroke="#1f1e1e" strokeWidth="1.33" strokeLinecap="round"/>
                <path d="M3 2L9 2L7 6L9 10L3 10" stroke="#1f1e1e" strokeWidth="1.33"/>
              </svg>
              <span className="text-sm font-medium text-[#1f1e1e]">Flags</span>
            </button>
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
              onClick={onCreateLoad}
              className="bg-[#0a376c] h-9 px-4 py-2 rounded-md flex items-center justify-center"
            >
              <span className="text-sm font-semibold text-white">Create Load</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State Content */}
      <div className="flex flex-col items-center justify-center min-h-[557px] gap-6">
        {/* Illustration and Text Section */}
        <div className="flex flex-col gap-6 items-center">
          {/* Illustration - Box with dashed line */}
          <div className="w-[108px] h-[108px] relative flex items-center justify-center">
            <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Main box */}
              <rect x="10" y="30" width="88" height="68" rx="4" stroke="#62748e" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
              {/* Box lid */}
              <rect x="10" y="20" width="88" height="15" rx="2" stroke="#62748e" strokeWidth="2" fill="none"/>
              {/* Dashed line going up */}
              <path d="M54 20L54 10M54 10L48 4M54 10L60 4" stroke="#62748e" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
              {/* Small elements */}
              <circle cx="30" cy="50" r="3" fill="#62748e" opacity="0.3"/>
              <circle cx="78" cy="50" r="3" fill="#62748e" opacity="0.3"/>
              <circle cx="30" cy="75" r="3" fill="#62748e" opacity="0.3"/>
              <circle cx="78" cy="75" r="3" fill="#62748e" opacity="0.3"/>
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-3 items-center text-center">
            <h3 className="text-[16px] font-bold text-[#1f1e1e] leading-6">No Loads Yet</h3>
            <p className="text-[16px] font-normal text-[#62748e] leading-6 max-w-[812px]">
              Start managing your logistics by creating your first load. Track shipments, assign drivers, and monitor delivery progress all in one place.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={onCreateLoad}
            className="bg-[#0a376c] h-9 px-4 py-2 rounded-md flex items-center justify-center"
          >
            <span className="text-sm font-semibold text-white">Create Your First Load</span>
          </button>
        </div>

        {/* Feature Cards */}
        <div className="flex gap-4 items-center w-full justify-center mt-8">
          {/* Track Locations Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 flex flex-col gap-2.5 w-[260px] h-[134px]">
            <div className="flex flex-col gap-2">
              <div className="bg-[#eef6ff] w-9 h-9 rounded-md flex items-center justify-center shadow-sm">
                <MapPinnedIcon />
              </div>
              <h4 className="text-sm font-semibold text-[#1f1e1e] leading-5">Track Locations</h4>
              <p className="text-sm font-medium text-[#45556c] leading-5">
                Monitor real-time shipment locations
              </p>
            </div>
          </div>

          {/* Assign Drivers Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 flex flex-col gap-2.5 w-[260px] h-[134px]">
            <div className="flex flex-col gap-2">
              <div className="bg-[#eef6ff] w-9 h-9 rounded-md flex items-center justify-center shadow-sm">
                <TruckIcon />
              </div>
              <h4 className="text-sm font-semibold text-[#1f1e1e] leading-5">Assign Drivers</h4>
              <p className="text-sm font-medium text-[#45556c] leading-5">
                Match loads with available drivers
              </p>
            </div>
          </div>

          {/* View Analytics Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4.5 flex flex-col gap-2.5 w-[260px] h-[134px]">
            <div className="flex flex-col gap-2">
              <div className="bg-[#eef6ff] w-9 h-9 rounded-md flex items-center justify-center shadow-sm">
                <AreaChartIcon />
              </div>
              <h4 className="text-sm font-semibold text-[#1f1e1e] leading-5">View Analytics</h4>
              <p className="text-sm font-medium text-[#45556c] leading-5">
                Access performance metrics and reports
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
