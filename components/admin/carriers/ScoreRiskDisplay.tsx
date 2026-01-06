'use client'

import { ProgressBar } from '@/components/shared/ProgressBar'
import { StatusBadge } from '@/components/shared/StatusBadge'

interface ScoreRiskDisplayProps {
  value: number
  label: 'GOOD' | 'AVG' | 'FAIR' | 'POOR' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  maxValue?: number // Default 1000 for scores, 10 for risk
  type: 'score' | 'risk'
  className?: string
}

export function ScoreRiskDisplay({ value, label, maxValue, type, className = '' }: ScoreRiskDisplayProps) {
  const defaultMax = type === 'score' ? 1000 : 10
  const max = maxValue || defaultMax
  
  // Calculate progress percentage
  const progress = Math.min(Math.max((value / max) * 100, 0), 100)
  
  // Determine badge status based on label (map uppercase labels to lowercase config keys)
  const labelToStatusMap: Record<'GOOD' | 'AVG' | 'FAIR' | 'POOR' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', 'good' | 'average' | 'fair' | 'poor' | 'low' | 'medium' | 'high' | 'critical'> = {
    'GOOD': 'good',
    'AVG': 'average',
    'FAIR': 'fair',
    'POOR': 'poor',
    'LOW': 'low',
    'MEDIUM': 'medium',
    'HIGH': 'high',
    'CRITICAL': 'critical',
  }
  const badgeStatus = labelToStatusMap[label]
  
  // Determine progress bar status for color coding
  let progressStatus: 'onTrack' | 'delayed' | 'blocked' = 'onTrack'
  if (type === 'score') {
    if (label === 'GOOD') progressStatus = 'onTrack'
    else if (label === 'AVG') progressStatus = 'delayed'
    else progressStatus = 'blocked'
  } else {
    if (label === 'LOW') progressStatus = 'onTrack'
    else if (label === 'MEDIUM' || label === 'HIGH') progressStatus = 'delayed'
    else progressStatus = 'blocked'
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
        <StatusBadge status={badgeStatus} />
      </div>
      <ProgressBar progress={progress} status={progressStatus} showLabel={false} />
    </div>
  )
}
