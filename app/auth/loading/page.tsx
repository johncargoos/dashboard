'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Hourglass/Loading Icon
const HourglassIcon = () => (
  <svg width="136" height="136" viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="68" cy="68" r="60" stroke="#0a376c" strokeWidth="4" strokeOpacity="0.2"/>
    <path 
      d="M68 8C101.137 8 128 34.863 128 68C128 101.137 101.137 128 68 128" 
      stroke="#0a376c" 
      strokeWidth="4" 
      strokeLinecap="round"
      className="animate-spin origin-center"
      style={{ transformOrigin: '68px 68px', animation: 'spin 1.5s linear infinite' }}
    />
    <path d="M50 45h36M50 91h36" stroke="#0a376c" strokeWidth="3" strokeLinecap="round"/>
    <path d="M53 45l15 23-15 23M83 45L68 68l15 23" stroke="#0a376c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function LoadingPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 3 seconds (the actual redirect will happen from onboarding page)
    const timer = setTimeout(() => {
      // Check if we should redirect to completed
      const shouldRedirect = localStorage.getItem('userEmail')
      if (shouldRedirect) {
        router.push('/auth/completed')
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 w-full max-w-[396px]">
        {/* Loading Animation */}
        <div className="relative">
          <svg width="136" height="136" viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="68" cy="68" r="60" stroke="#0a376c" strokeWidth="4" strokeOpacity="0.2"/>
            <path 
              d="M68 8C101.137 8 128 34.863 128 68" 
              stroke="#0a376c" 
              strokeWidth="4" 
              strokeLinecap="round"
              className="animate-spin"
              style={{ transformOrigin: '68px 68px' }}
            />
            {/* Hourglass */}
            <g transform="translate(44, 40)">
              <path d="M0 0h48M0 56h48" stroke="#0a376c" strokeWidth="3" strokeLinecap="round"/>
              <path d="M4 0v8c0 8 20 20 20 20s20-12 20-20V0" stroke="#0a376c" strokeWidth="2.5" fill="none"/>
              <path d="M4 56v-8c0-8 20-20 20-20s20 12 20 20v8" stroke="#0a376c" strokeWidth="2.5" fill="none"/>
            </g>
          </svg>
        </div>

        {/* Loading Text */}
        <p className="text-lg font-bold text-[#171717] text-center tracking-[-0.24px]">
          Hang tight, we're getting things ready for you.
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1.5s linear infinite;
          transform-origin: 68px 68px;
        }
      `}</style>
    </div>
  )
}
