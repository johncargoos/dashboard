'use client'

import { ChevronDown } from 'lucide-react'

interface GreetingSectionProps {
  userName: string
  onViewRiskReports?: () => void
  onCreateLoad?: () => void
}

export function GreetingSection({ userName, onViewRiskReports, onCreateLoad }: GreetingSectionProps) {
  return (
    <div className="w-full h-9 inline-flex justify-between items-center">
      <div className="w-40 h-7 justify-start text-stone-900 text-xl font-bold font-['Plus_Jakarta_Sans']">
        Hello, {userName}!
      </div>
      <div className="flex justify-start items-center gap-2">
        <button
          onClick={onViewRiskReports}
          data-show-left-icon="false"
          data-show-right-icon="false"
          data-size="default"
          data-state="Default"
          data-variant="Secondary"
          className="h-9 px-4 py-2 bg-gray-100 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center gap-2"
        >
          <div className="justify-center text-sky-900 text-sm font-medium font-['Plus_Jakarta_Sans']">
            View Risk Reports
          </div>
        </button>
        <button
          onClick={onCreateLoad}
          data-show-left-icon="false"
          data-show-right-icon="true"
          data-size="default"
          data-state="Default"
          data-variant="Default"
          className="h-9 px-4 py-2 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center gap-2"
          style={{ backgroundColor: '#0A376C' }}
        >
          <div className="justify-center text-white text-sm font-semibold font-['Plus_Jakarta_Sans']">
            Create Load
          </div>
          <div className="w-4 h-4 relative overflow-hidden flex items-center justify-center">
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>
    </div>
  )
}

