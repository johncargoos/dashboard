'use client'

import { Modal } from '@/components/shared/Modal'

interface RecentScoreChange {
  type: 'driver' | 'trip'
  id: string
  name: string
  company?: string
  scoreChange: string
  adminName?: string
  description?: string
  category?: string
  icon?: string
}

interface RecentScoreChangeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RecentScoreChangeModal({ isOpen, onClose }: RecentScoreChangeModalProps) {
  const recentChanges: RecentScoreChange[] = [
    {
      type: 'driver',
      id: 'driver-1',
      name: 'John Driver',
      company: 'Swift Logistics',
      scoreChange: '760 → 763',
      adminName: 'Admin Joe',
    },
    {
      type: 'trip',
      id: 'trip-10422',
      name: 'Trip #10422',
      description: 'Accident-free trip',
      scoreChange: '+2',
      category: 'Safety',
    },
    {
      type: 'trip',
      id: 'trip-10423',
      name: 'Trip #10423',
      description: 'On-time delivery',
      scoreChange: '+1',
      category: 'Timeliness',
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recent Score Change" className="max-w-3xl">
      <div className="space-y-4">
        {recentChanges.map((change, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar/Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {change.type === 'driver' ? (
                <span className="text-sm font-semibold text-gray-600">
                  {change.name.split(' ').map(n => n[0]).join('')}
                </span>
              ) : (
                <span className="text-lg">🚛</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{change.name}</h3>
                  {change.company && (
                    <p className="text-xs text-gray-500">{change.company}</p>
                  )}
                  {change.description && (
                    <p className="text-xs text-gray-600 mt-1">{change.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {change.scoreChange.includes('→') ? (
                    <span className="text-sm font-semibold text-green-600">{change.scoreChange}</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      {change.scoreChange}
                    </span>
                  )}
                  {change.adminName && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {change.adminName}
                    </span>
                  )}
                </div>
              </div>
              
              {change.category && (
                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded mt-2">
                  {change.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
