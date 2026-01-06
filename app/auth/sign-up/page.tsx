'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/api/auth'

// CPS Logo Component
const CPSLogo = () => (
  <svg width="73" height="54" viewBox="0 0 73 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36.5 0C16.3 0 0 12.1 0 27s16.3 27 36.5 27S73 41.9 73 27 56.7 0 36.5 0z" fill="#0a376c"/>
    <path d="M20 20c0-5.5 4.5-10 10-10h13c5.5 0 10 4.5 10 10v14c0 5.5-4.5 10-10 10H30c-5.5 0-10-4.5-10-10V20z" fill="#fff"/>
    <circle cx="58" cy="18" r="4" fill="#FF7F00"/>
    <path d="M25 27h23M25 33h15" stroke="#0a376c" strokeWidth="3" strokeLinecap="round"/>
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

// Check Icon
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.67 3.5L5.25 9.92 2.33 7" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[\W_]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    return hasMinLength && hasLetter && hasNumber && hasSpecial && hasUppercase && hasLowercase
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.')
      return
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions.')
      return
    }

    setIsLoading(true)

    try {
      // Store email and password for onboarding
      localStorage.setItem('signupEmail', email)
      localStorage.setItem('signupPassword', password)
      router.push('/auth/onboarding')
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Sign Up Form */}
      <div className="w-[551px] flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-[374px] flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="mb-2">
            <CPSLogo />
          </div>

          {/* Title */}
          <h1 className="text-[20px] font-bold text-[#1f1e1e] text-center leading-9 tracking-[-0.4px]">
            Update Information
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0a0a0a]">
                Company Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-10 px-3 py-2 bg-white border border-[#e5e5e5] rounded-md text-sm text-[#0a0a0a] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#0a376c] focus:border-transparent"
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#0a0a0a]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* Password Requirements */}
              <p className="text-sm text-[#333]">
                At least <span className="font-bold">8 characters</span>, containing <span className="font-bold">a letter</span> and <span className="font-bold">a number</span>
              </p>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="h-[34px] bg-[#0a376c] text-white text-sm font-medium rounded-md hover:bg-[#082d58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer">
              <button
                type="button"
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`w-4 h-4 rounded flex items-center justify-center border shadow-sm transition-colors ${
                  acceptTerms
                    ? 'bg-[#0a376c] border-[#0a376c]'
                    : 'bg-white border-[#e5e5e5]'
                }`}
              >
                {acceptTerms && <CheckIcon />}
              </button>
              <span className="text-sm font-medium text-[#0a0a0a]">
                I accept terms & condition
              </span>
            </label>

            {/* Sign In Link */}
            <p className="text-sm text-center text-[#737373]">
              Already have an account?{' '}
              <a href="/auth/sign-in" className="text-[#0a376c] font-medium hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel - Background Image */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80')`,
          }}
        />
      </div>
    </div>
  )
}
