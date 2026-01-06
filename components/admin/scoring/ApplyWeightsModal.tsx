'use client'

import { Modal } from '@/components/shared/Modal'

interface ApplyWeightsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  expectedImprovement: number
  driversPositivelyAffected: { count: number; percentage: number }
  driversNegativelyAffected: { count: number; percentage: number }
}

export function ApplyWeightsModal({
  isOpen,
  onClose,
  onConfirm,
  expectedImprovement,
  driversPositivelyAffected,
  driversNegativelyAffected,
}: ApplyWeightsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply New Weights" className="max-w-lg">
      <div className="space-y-6">
        <p className="text-gray-700">Are you sure you want to apply these weight changes?</p>

        {/* Summary of Changes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Summary of Changes</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Expected accuracy improvement: {expectedImprovement > 0 ? '+' : ''}{expectedImprovement}%</li>
            <li>
              • Drivers positively affected: {driversPositivelyAffected.count} ({driversPositivelyAffected.percentage}%)
            </li>
            <li>
              • Drivers negatively affected: {driversNegativelyAffected.count} ({driversNegativelyAffected.percentage}%)
            </li>
            <li>• New version will be marked as "Ready for Deployment"</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0A376C] rounded-lg hover:bg-[#082a56] transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  )
}
