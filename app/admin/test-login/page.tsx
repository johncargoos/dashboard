'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminTestLogin() {
  const router = useRouter()

  useEffect(() => {
    // Set up mock admin user credentials
    if (typeof window !== 'undefined') {
      // Set authentication tokens (mock)
      localStorage.setItem('accessToken', 'mock-admin-access-token')
      localStorage.setItem('idToken', 'mock-admin-id-token')
      localStorage.setItem('refreshToken', 'mock-admin-refresh-token')
      
      // Set user info
      localStorage.setItem('userEmail', 'admin@cargoos.com')
      localStorage.setItem('userName', 'Admin User')
      localStorage.setItem('userType', 'admin')
      
      // Set cookie
      document.cookie = 'userType=admin; path=/; max-age=31536000'
      
      // Redirect to admin overview (dashboard)
      router.replace('/admin/overview')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg text-gray-600">Setting up mock admin user...</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting to admin dashboard...</p>
      </div>
    </div>
  )
}
