'use client'

interface StatusIconProps {
  status: 'completed' | 'pending'
  className?: string
}

export function StatusIcon({ status, className = '' }: StatusIconProps) {
  if (status === 'completed') {
    return (
      <svg
        className={`w-5 h-5 text-green-600 ${className}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    )
  }

  // Pending - yellow circle
  return (
    <div className={`w-5 h-5 rounded-full border-2 border-yellow-500 ${className}`} />
  )
}
