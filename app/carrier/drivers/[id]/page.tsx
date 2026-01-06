'use client'

import { useEffect } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { DriverProfile } from '@/components/carrier/DriverProfile'
import { useRouter, useParams } from 'next/navigation'

export default function DriverProfilePage() {
  const router = useRouter()
  const params = useParams()
  const driverId = params.id as string

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
      <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-slate-50">
        <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100 inline-flex flex-col justify-center items-end gap-2.5">
          <Header userType="carrier" />
        </div>
        <div className="p-8">
          <DriverProfile driverId={driverId} onBack={handleBack} />
        </div>
      </div>
    </div>
  )
}

