'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { LoadManagerAdd } from '@/components/carrier/LoadManagerAdd'
import { useRouter } from 'next/navigation'

export default function CreateLoadPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'carrier')
      document.cookie = 'userType=carrier; path=/; max-age=31536000'
    }
  }, [])

  const handleBack = () => {
    router.push('/carrier/load-manager')
  }

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
      {/* Sidebar */}
      <Sidebar userType="carrier" />

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-slate-50">
        {/* Header */}
        <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100 inline-flex flex-col justify-center items-end gap-2.5">
          <Header userType="carrier" />
        </div>

        {/* Create Load Content */}
        <div className="p-8">
          <LoadManagerAdd onBack={handleBack} />
        </div>
      </div>
    </div>
  )
}

