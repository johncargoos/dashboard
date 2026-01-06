'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// CPS Logo Component
const CPSLogo = () => (
  <svg width="54" height="40" viewBox="0 0 73 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36.5 0C16.3 0 0 12.1 0 27s16.3 27 36.5 27S73 41.9 73 27 56.7 0 36.5 0z" fill="#0a376c"/>
    <path d="M20 20c0-5.5 4.5-10 10-10h13c5.5 0 10 4.5 10 10v14c0 5.5-4.5 10-10 10H30c-5.5 0-10-4.5-10-10V20z" fill="#fff"/>
    <circle cx="58" cy="18" r="4" fill="#FF7F00"/>
    <path d="M25 27h23M25 33h15" stroke="#0a376c" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

// Arrow Right Icon
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33 8h9.34M8 3.33L12.67 8 8 12.67" stroke="#fafafa" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function PasswordSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after a short delay based on user type
    const userType = localStorage.getItem('userType') || 'carrier'
    
    const timer = setTimeout(() => {
      if (userType === 'admin') {
        router.push('/admin/overview')
      } else {
        router.push('/auth/onboarding')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  const handleContinue = () => {
    const userType = localStorage.getItem('userType') || 'carrier'
    if (userType === 'admin') {
      router.push('/admin/overview')
    } else {
      router.push('/auth/onboarding')
    }
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80')`,
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.27)]" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-[0px_6px_10px_4px_rgba(0,0,0,0.15),0px_2px_3px_0px_rgba(0,0,0,0.3)] w-full max-w-[416px] px-4 py-10 flex flex-col items-center">
          <div className="flex flex-col items-center gap-6 w-full max-w-[372px]">
            {/* Logo */}
            <CPSLogo />

            {/* Text Content */}
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-lg font-bold text-[#171717] tracking-[-0.24px]">
                Password Successfully Updated!
              </h1>
              <p className="text-base text-[#737373]">
                You're all set to begin using your driver account.
                <br />
                Let's take a quick minute to finish setting up your profile.
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-[340px] h-[34px] bg-[#0a376c] text-white text-sm font-medium rounded-md flex items-center justify-center gap-2 hover:bg-[#082d58] transition-colors"
            >
              <span>Continue to Onboarding</span>
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
