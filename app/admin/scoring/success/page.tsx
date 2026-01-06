'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'

export default function ScoringSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'admin')
      document.cookie = 'userType=admin; path=/; max-age=31536000'
    }
  }, [])

  const handleBackToDashboard = () => {
    router.push('/admin/scoring')
  }

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
      {/* Sidebar */}
      <Sidebar userType="admin" />

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-slate-50">
        {/* Header */}
        <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100 inline-flex flex-col justify-center items-end gap-2.5">
          <Header userType="admin" />
        </div>

        {/* Success Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            {/* Large Green Checkmark */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Weights Applied Successfully!
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8">
              New weight version is now ready for deployment
            </p>

            {/* Back to Dashboard Button */}
            <button
              onClick={handleBackToDashboard}
              className="px-6 py-3 text-sm font-medium text-white bg-[#0A376C] rounded-lg hover:bg-[#082a56] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
