'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Success Checkmark Icon
const SuccessIcon = () => (
  <svg width="223" height="223" viewBox="0 0 223 223" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Confetti elements */}
    <circle cx="40" cy="60" r="4" fill="#93C5FD" opacity="0.6"/>
    <circle cx="183" cy="45" r="3" fill="#FCD34D" opacity="0.6"/>
    <circle cx="195" cy="100" r="4" fill="#86EFAC" opacity="0.6"/>
    <circle cx="28" cy="120" r="3" fill="#F9A8D4" opacity="0.6"/>
    <circle cx="55" cy="175" r="4" fill="#C4B5FD" opacity="0.6"/>
    <circle cx="168" cy="178" r="3" fill="#93C5FD" opacity="0.6"/>
    <rect x="35" y="90" width="8" height="3" rx="1" fill="#93C5FD" opacity="0.4" transform="rotate(-30 35 90)"/>
    <rect x="180" y="70" width="8" height="3" rx="1" fill="#FCD34D" opacity="0.4" transform="rotate(20 180 70)"/>
    <rect x="45" y="145" width="8" height="3" rx="1" fill="#86EFAC" opacity="0.4" transform="rotate(-15 45 145)"/>
    <rect x="175" cy="145" width="8" height="3" rx="1" fill="#F9A8D4" opacity="0.4" transform="rotate(30 175 145)"/>
    
    {/* Main circle with checkmark */}
    <circle cx="111.5" cy="111.5" r="54" fill="#22C55E"/>
    <path 
      d="M85 111.5L102 128.5L138 92.5" 
      stroke="white" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

// Arrow Right Icon
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33 8h9.34M8 3.33L12.67 8 8 12.67" stroke="#fafafa" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function CompletedPage() {
  const router = useRouter()

  useEffect(() => {
    // Get user type from localStorage
    const userType = localStorage.getItem('userType') || 'carrier'
    
    // Auto-redirect after a short delay
    const timer = setTimeout(() => {
      if (userType === 'admin') {
        router.push('/admin/overview')
      } else {
        router.push('/carrier/dashboard')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  const handleStartExploring = () => {
    const userType = localStorage.getItem('userType') || 'carrier'
    if (userType === 'admin') {
      router.push('/admin/overview')
    } else {
      router.push('/carrier/dashboard')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 w-full max-w-[396px]">
        {/* Success Icon */}
        <SuccessIcon />

        {/* Text Content */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-lg font-bold text-[#171717] tracking-[-0.24px]">
            All Done!
          </h1>
          <p className="text-base text-[#45556c]">
            Your account is ready to go, Welcome!
          </p>
        </div>

        {/* Start Exploring Button */}
        <button
          onClick={handleStartExploring}
          className="h-[37px] px-4 bg-[#0a376c] text-white text-sm font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-[#082d58] transition-colors"
        >
          <span>Start Exploring</span>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  )
}
