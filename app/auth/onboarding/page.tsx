'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/api/auth'

// User Icon
const UserIcon = () => (
  <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="19.5" cy="12" r="6" stroke="#737373" strokeWidth="2"/>
    <path d="M7 34c0-6.075 4.925-11 11-11h3c6.075 0 11 4.925 11 11" stroke="#737373" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export default function OnboardingPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<'carrier' | 'admin'>('carrier')
  const [companyName, setCompanyName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [syncELD, setSyncELD] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Get stored email and password from sign-up step
    const storedEmail = localStorage.getItem('signupEmail') || ''
    const storedPassword = localStorage.getItem('signupPassword') || ''
    setEmail(storedEmail)
    setPassword(storedPassword)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!firstName || !lastName) {
      setError('Please fill in First Name and Last Name.')
      return
    }

    setIsLoading(true)

    try {
      // Show loading screen
      router.push('/auth/loading')

      // Complete the sign-up process
      await signUp({
        email,
        password,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        companyName: userType === 'carrier' ? (companyName || undefined) : undefined,
        group: userType, // Set user as carrier or admin
      })

      // Clear stored credentials
      localStorage.removeItem('signupEmail')
      localStorage.removeItem('signupPassword')
      
      // Store user info
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userName', `${firstName} ${lastName}`)
      if (userType === 'carrier') {
        localStorage.setItem('companyName', companyName || '')
      }
      localStorage.setItem('userType', userType)
      document.cookie = `userType=${userType}; path=/; max-age=31536000`

      // Redirect to completed page
      setTimeout(() => {
        router.push('/auth/completed')
      }, 2000)
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Sign up failed. Please try again.')
      router.push('/auth/onboarding')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-8">
      <div className="w-full max-w-[374px] flex flex-col items-center gap-2">
        {/* Header */}
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-[20px] font-bold text-[#1f1e1e] text-center leading-9 tracking-[-0.4px]">
            Account Setup
          </h1>
          <p className="text-sm text-[rgba(0,0,0,0.63)] leading-5">
            {userType === 'admin' 
              ? "We'll need just a few more details to complete your admin account setup."
              : "Before you start accepting trips, we'll need just a few more details."}
          </p>
        </div>

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-[85px] h-[85px] bg-[#f3f4f6] rounded-full border-2 border-white flex items-center justify-center">
            <UserIcon />
          </div>
          <button
            type="button"
            className="h-8 px-3 bg-[#eef6ff] text-[#0a376c] text-xs font-medium rounded-lg hover:bg-[#dceeff] transition-colors"
          >
            Upload Photo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* User Type Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">
              Account Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUserType('carrier')}
                className={`flex-1 h-10 px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                  userType === 'carrier'
                    ? 'bg-[#0a376c] text-white border-[#0a376c]'
                    : 'bg-white text-[#0a0a0a] border-[#e5e5e5] hover:border-[#0a376c]'
                }`}
              >
                Carrier
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 h-10 px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                  userType === 'admin'
                    ? 'bg-[#0a376c] text-white border-[#0a376c]'
                    : 'bg-white text-[#0a0a0a] border-[#e5e5e5] hover:border-[#0a376c]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Company Name Input - Only show for carrier */}
          {userType === 'carrier' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#0a0a0a]">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder=""
                className="h-10 px-3 py-2 bg-white border border-[#e5e5e5] rounded-md text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#0a376c] focus:border-transparent"
              />
            </div>
          )}

          {/* First Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder=""
              className="h-10 px-3 py-2 bg-white border border-[#e5e5e5] rounded-md text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#0a376c] focus:border-transparent"
              required
            />
          </div>

          {/* Last Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder=""
              className="h-10 px-3 py-2 bg-white border border-[#e5e5e5] rounded-md text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#0a376c] focus:border-transparent"
              required
            />
          </div>

          {/* Sync ELD Toggle - Only show for carrier */}
          {userType === 'carrier' && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSyncELD(!syncELD)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  syncELD ? 'bg-[#0a376c]' : 'bg-[#e5e5e5]'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${
                    syncELD ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-[#0a0a0a]">
                Sync ELD or Telematics
              </span>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="h-[39px] bg-[#0a376c] text-white text-sm font-medium rounded-md hover:bg-[#082d58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save and Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
