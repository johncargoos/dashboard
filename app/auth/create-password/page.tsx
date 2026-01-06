'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { respondNewPassword, parseToken } from '@/lib/api/auth'

// CPS Logo Component
const CPSLogo = () => (
  <svg width="73" height="54" viewBox="0 0 73 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36.5 0C16.3 0 0 12.1 0 27s16.3 27 36.5 27S73 41.9 73 27 56.7 0 36.5 0z" fill="#0a376c"/>
    <path d="M20 20c0-5.5 4.5-10 10-10h13c5.5 0 10 4.5 10 10v14c0 5.5-4.5 10-10 10H30c-5.5 0-10-4.5-10-10V20z" fill="#fff"/>
    <circle cx="58" cy="18" r="4" fill="#FF7F00"/>
    <path d="M25 27h23M25 33h15" stroke="#0a376c" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

// Clock Icon
const ClockIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.5" cy="10.5" r="9" stroke="#171717" strokeWidth="1.5"/>
    <path d="M10.5 5.5v5.5l3.5 2" stroke="#171717" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// Eye Off Icon
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.59 6.59a2 2 0 0 0 2.82 2.82M9.88 9.88A3.5 3.5 0 0 1 8 10.5c-2.5 0-4.5-2.5-4.5-2.5a7.5 7.5 0 0 1 1.38-1.62m2.12-.88a3.5 3.5 0 0 1 4.12 4.12M1 1l14 14" stroke="#737373" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 3c2.5 0 6 2.5 6 5 0 .77-.23 1.5-.62 2.17" stroke="#737373" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Eye Icon
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#737373" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" stroke="#737373" strokeWidth="1.33"/>
  </svg>
)

export default function CreatePasswordPage() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(45)
  const [canResend, setCanResend] = useState(false)
  const [email, setEmail] = useState('')
  const [tempPassword, setTempPassword] = useState('')

  useEffect(() => {
    // Get stored email and temp password
    const storedEmail = localStorage.getItem('pendingEmail') || localStorage.getItem('resetEmail') || ''
    const storedTempPassword = localStorage.getItem('tempPassword') || ''
    setEmail(storedEmail)
    setTempPassword(storedTempPassword)

    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleResendCode = () => {
    setCountdown(45)
    setCanResend(false)
    // TODO: Call resend code API
  }

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    return hasMinLength && hasLetter && hasNumber
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters and contain a letter and a number.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      // If we have temp password, this is a first-time login password change
      if (tempPassword) {
        const result = await respondNewPassword({
          email,
          tempPassword,
          newPassword,
        })
        
        // Determine user type from token
        let userType = 'carrier' // default
        if (result.idToken) {
          const decodedToken = parseToken(result.idToken)
          if (decodedToken && decodedToken['cognito:groups']) {
            const groups = decodedToken['cognito:groups']
            if (Array.isArray(groups)) {
              if (groups.includes('admin')) {
                userType = 'admin'
              } else if (groups.includes('carrier')) {
                userType = 'carrier'
              } else if (groups.includes('driver')) {
                userType = 'driver'
              }
            }
          }
        }
        
        localStorage.setItem('userType', userType)
        document.cookie = `userType=${userType}; path=/; max-age=31536000`
        
        localStorage.removeItem('pendingEmail')
        localStorage.removeItem('tempPassword')
        router.push('/auth/password-success')
      } else {
        // This is a forgot password flow - redirect to reset password
        localStorage.setItem('verificationCode', verificationCode)
        localStorage.setItem('newPassword', newPassword)
        router.push('/auth/reset-password')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isButtonDisabled = !newPassword || !confirmPassword || !validatePassword(newPassword) || newPassword !== confirmPassword || isLoading

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Create Password Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-[374px] flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="mb-2">
            <CPSLogo />
          </div>

          {/* Title */}
          <h1 className="text-[20px] font-bold text-[#0a0a0a] text-center leading-9">
            Create New Password
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Verification Code Input (only for forgot password flow) */}
            {!tempPassword && (
              <>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter Verification Code"
                    className="h-10 px-3 py-2 bg-white border border-[#e5e5e5] rounded-md text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#0a376c] focus:border-transparent"
                    required={!tempPassword}
                  />
                </div>

                {/* Resend Code Section */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#171717]">
                    <span>Didn't get the code? </span>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={!canResend}
                      className={`font-bold ${canResend ? 'text-[#1f1e1e] cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                    >
                      Resend it
                    </button>
                  </p>
                  <div className="flex items-center gap-1">
                    <ClockIcon />
                    <span className="text-xs font-bold text-[#171717]">{countdown}s</span>
                  </div>
                </div>
              </>
            )}

            {/* New Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#0a0a0a]">
                Choose a Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-10 px-3 py-2 pr-10 bg-white border border-[#e5e5e5] rounded-md text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#0a376c] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#0a0a0a]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-10 px-3 py-2 pr-10 bg-white border border-[#e5e5e5] rounded-md text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#0a376c] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>

              {/* Password Requirements */}
              <p className="text-sm text-[#333]">
                At least <span className="font-bold">8 characters</span>, containing <span className="font-bold">a letter</span> and <span className="font-bold">a number</span>
              </p>
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`h-[34px] text-sm font-medium rounded-md transition-colors ${
                isButtonDisabled
                  ? 'bg-[#0a376c] opacity-50 text-[#62748e] cursor-not-allowed'
                  : 'bg-[#0a376c] text-white hover:bg-[#082d58]'
              }`}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - Background Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-[rgba(255,127,0,0.2)]" />
      </div>
    </div>
  )
}
