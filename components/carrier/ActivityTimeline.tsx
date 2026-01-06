'use client'

interface ActivityItem {
  id: string
  type: 'delivery' | 'payment' | 'update' | 'message'
  title: string
  description: string
  time: string
  icon?: React.ReactNode
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  className?: string
}

export function ActivityTimeline({ activities, className = '' }: ActivityTimelineProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {activity.icon || (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">
                    {activity.type.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
            {index < activities.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

