'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/api/auth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      // Get user type and redirect to appropriate dashboard
      const userType = localStorage.getItem('userType') || 'carrier'
      if (userType === 'admin') {
        router.replace('/admin/overview')
      } else {
        router.replace('/carrier/dashboard')
      }
    } else {
      // Redirect to sign-in
      router.replace('/auth/sign-in')
    }
  }, [router])

  // Show loading state while checking auth
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* CPS Logo */}
        <svg width="120" height="88" viewBox="0 0 73 54" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36.5 0C16.3 0 0 12.1 0 27s16.3 27 36.5 27S73 41.9 73 27 56.7 0 36.5 0z" fill="#0a376c"/>
          <path d="M20 20c0-5.5 4.5-10 10-10h13c5.5 0 10 4.5 10 10v14c0 5.5-4.5 10-10 10H30c-5.5 0-10-4.5-10-10V20z" fill="#fff"/>
          <circle cx="58" cy="18" r="4" fill="#FF7F00"/>
          <path d="M25 27h23M25 33h15" stroke="#0a376c" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <p className="text-lg text-[#737373]">Loading...</p>
      </div>
    </main>
  )
}
