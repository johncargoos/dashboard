'use client'

interface AnomaliesEmptyStateProps {
  onCreateAnomaly?: () => void
}

export function AnomaliesEmptyState({ onCreateAnomaly }: AnomaliesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* 3D Box Icon */}
      <div className="w-24 h-24 mb-6 text-gray-400">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Simple 3D box representation */}
          <path
            d="M20 30L50 15L80 30V70L50 85L20 70V30Z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M20 30L50 15V55L20 70V30Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M50 15L80 30V70L50 55V15Z"
            fill="currentColor"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No Anomalies Found</h2>

      {/* Description */}
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Looks like there aren't any current anomalies to display. Start by creating a new one or check back later.
      </p>

      {/* Create New Anomaly Button */}
      <button
        onClick={onCreateAnomaly}
        className="px-6 py-3 bg-[#0A376C] text-white rounded-lg font-medium hover:bg-[#082a56] transition-colors"
      >
        Create New Anomaly
      </button>
    </div>
  )
}
