'use client'

interface FilterButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}

export function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-4 py-2 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] flex justify-center items-center gap-2 ${
        isActive
          ? 'bg-white outline-[#0A376C]'
          : 'bg-white outline-gray-300'
      }`}
    >
      <div
        className={`text-sm font-['Plus_Jakarta_Sans'] leading-5 ${
          isActive
            ? 'text-[#0A376C] font-semibold'
            : 'text-gray-600 font-medium'
        }`}
      >
        {label}
      </div>
    </button>
  )
}

