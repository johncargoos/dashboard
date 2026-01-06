'use client'

import { useEffect } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { DriversAdd } from '@/components/carrier/DriversAdd'
import { useRouter } from 'next/navigation'

export default function CreateDriverPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'carrier')
      document.cookie = 'userType=carrier; path=/; max-age=31536000'
    }
  }, [])

  const handleBack = () => {
    router.push('/carrier/drivers')
  }

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
      <Sidebar userType="carrier" />
      <div className="flex-1 bg-slate-50 rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-slate-50">
        <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100 inline-flex flex-col justify-center items-end gap-2.5 bg-white">
          <Header userType="carrier" />
        </div>
        <div className="p-8 bg-slate-50">
          <DriversAdd onBack={handleBack} />
        </div>
        
        {/* Loading Overlay */}
        <div id="loading-overlay" className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a376c]"></div>
            <p className="text-sm font-medium text-gray-700">Creating driver...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

