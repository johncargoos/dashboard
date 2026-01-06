'use client'

import Image from 'next/image'

interface EmptyStateProps {
  title: string
  description: string
  buttonLabel: string
  onButtonClick: () => void
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  buttonLabel, 
  onButtonClick,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`w-[519px] inline-flex flex-col justify-start items-center gap-6 ${className}`}>
      {/* Checkmark Icon - using the greencheck.png image without background */}
      <div className="relative flex items-center justify-center">
        <div className="w-28 h-28 flex items-center justify-center">
          <Image
            src="/assets/greencheck.png"
            alt="Checkmark"
            width={112}
            height={112}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="w-[521px] h-24 flex flex-col justify-start items-center gap-4">
        <div className="w-80 h-7 text-center justify-start text-stone-900 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-6">
          {title}
        </div>
        <div className="self-stretch h-14 text-center justify-start text-slate-600 text-base font-medium font-['Plus_Jakarta_Sans'] leading-6">
          {description}
          <br/>
        </div>
      </div>

      {/* Call to Action Button */}
      <button
        onClick={onButtonClick}
        data-show-left-icon="false"
        data-show-right-icon="false"
        data-size="default"
        data-state="Default"
        data-variant="Default"
        className="h-9 px-4 py-2 rounded-lg inline-flex justify-center items-center gap-2"
        style={{ backgroundColor: '#0A376C' }}
      >
        <div className="justify-center text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
          {buttonLabel}
        </div>
      </button>
    </div>
  )
}
