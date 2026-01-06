'use client'

import { CheckmarkIcon } from '../TrendIcons'

interface RecommendationSectionProps {
  className?: string
}

export function RecommendationSection({ className = '' }: RecommendationSectionProps) {
  const checklistItems = [
    'Accuracy improvement exceeds 0.5% threshold',
    'Majority of drivers benefit from changes',
    'No significant negative impacts detected',
    'Model stability maintained',
  ]

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <CheckmarkIcon className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Recommendation: Apply New Weights
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            The simulation shows a 0.7% improvement in overall accuracy with positive impact on 54.5% of drivers. 
            The proposed weights maintain baseline accuracy and show improvement across key metrics.
          </p>
          
          <div className="space-y-2">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5 flex items-center justify-center">
                  <CheckmarkIcon className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
