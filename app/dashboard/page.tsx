'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Check for stored user type preference
    const userType = localStorage.getItem('userType') || 'carrier'
    
    // Redirect based on stored preference
    if (userType === 'admin') {
      router.replace('/admin/dashboard')
    } else {
      router.replace('/carrier/dashboard')
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  )
}

