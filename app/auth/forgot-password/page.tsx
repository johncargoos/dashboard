'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { forgotPassword } from '@/lib/api/auth'

// CPS Logo Component
const CPSLogo = () => (
  <svg width="73" height="54" viewBox="0 0 73 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36.5 0C16.3 0 0 12.1 0 27s16.3 27 36.5 27S73 41.9 73 27 56.7 0 36.5 0z" fill="#0a376c"/>
    <path d="M20 20c0-5.5 4.5-10 10-10h13c5.5 0 10 4.5 10 10v14c0 5.5-4.5 10-10 10H30c-5.5 0-10-4.5-10-10V20z" fill="#fff"/>
    <circle cx="58" cy="18" r="4" fill="#FF7F00"/>
    <path d="M25 27h23M25 33h15" stroke="#0a376c" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await forgotPassword({ email })
      localStorage.setItem('resetEmail', email)
      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/reset-password')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isButtonDisabled = !email || isLoading

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Forgot Password Form */}
      <div className="w-[514px] flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-[374px] flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="mb-2">
            <CPSLogo />
          </div>

          {/* Title */}
          <h1 className="text-[20px] font-bold text-[#0a0a0a] text-center leading-9">
            Forgot Password
          </h1>

          {/* Description */}
          <p className="text-sm text-[#45556c] text-center">
            Enter your registered email address and we'll send you a code.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 text-sm text-green-800">
                Reset code sent! Check your email.
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#0a0a0a] leading-5">
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

            {/* Send Reset Link Button */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`h-[34px] text-sm font-medium rounded-md transition-colors ${
                isButtonDisabled
                  ? 'bg-[#0a376c] opacity-50 text-[#62748e] cursor-not-allowed'
                  : 'bg-[#0a376c] text-white hover:bg-[#082d58]'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back to Login Link */}
          <Link
            href="/auth/sign-in"
            className="text-sm text-[#0a376c] hover:underline"
          >
            Back to Log In
          </Link>
        </div>
      </div>

      {/* Right Panel - Background Image */}
      <div className="flex-1 relative overflow-hidden">
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
