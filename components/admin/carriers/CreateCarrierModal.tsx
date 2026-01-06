'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/shared/Modal'
import { signUp } from '@/lib/api/auth'

interface CreateCarrierModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateCarrierModal({ isOpen, onClose, onSuccess }: CreateCarrierModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const generateTempPassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let pwd = ''
    // Ensure at least one of each: lowercase, uppercase, number, special char
    pwd += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)] // uppercase
    pwd += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)] // lowercase
    pwd += '0123456789'[Math.floor(Math.random() * 10)] // number
    pwd += '!@#$%^&*'[Math.floor(Math.random() * 8)] // special char
    // Fill the rest randomly
    for (let i = pwd.length; i < length; i++) {
      pwd += charset[Math.floor(Math.random() * charset.length)]
    }
    // Shuffle the password
    return pwd.split('').sort(() => Math.random() - 0.5).join('')
  }

  const [password, setPassword] = useState('')
  const [generatePassword, setGeneratePassword] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGeneratePassword = () => {
    setPassword(generateTempPassword())
  }

  // Generate password when modal opens
  useEffect(() => {
    if (isOpen && generatePassword) {
      handleGeneratePassword()
    }
  }, [isOpen, generatePassword])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.companyName.trim()) {
      setError('Company name is required')
      return
    }
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!generatePassword && !password.trim()) {
      setError('Password is required')
      return
    }

    setIsLoading(true)

    try {
      // Use sign-up endpoint with group='carrier'
      const finalPassword = generatePassword ? password : password.trim()
      
      await signUp({
        email: formData.email.trim().toLowerCase(),
        password: finalPassword,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        companyName: formData.companyName.trim(),
        group: 'carrier',
      })

      // Reset form
      setFormData({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      })
      setPassword('')
      handleGeneratePassword() // Generate new password for next time

      // Close modal and refresh list
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create carrier. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      })
      setPassword('')
      setError('')
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add a New Carrier">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A376C] focus:border-transparent"
            placeholder="Enter company name"
            required
            disabled={isLoading}
          />
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A376C] focus:border-transparent"
            placeholder="Enter first name"
            required
            disabled={isLoading}
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A376C] focus:border-transparent"
            placeholder="Enter last name"
            required
            disabled={isLoading}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A376C] focus:border-transparent"
            placeholder="Enter email address"
            required
            disabled={isLoading}
          />
        </div>

        {/* Phone (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A376C] focus:border-transparent"
            placeholder="Enter phone number"
            disabled={isLoading}
          />
        </div>

        {/* Password Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={generatePassword}
                onChange={(e) => {
                  setGeneratePassword(e.target.checked)
                  if (e.target.checked && !password) {
                    handleGeneratePassword()
                  }
                }}
                className="rounded border-gray-300 text-[#0A376C] focus:ring-[#0A376C]"
                disabled={isLoading}
              />
              <span>Auto-generate</span>
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setGeneratePassword(false)
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A376C] focus:border-transparent"
              placeholder="Temporary password for carrier"
              required
              disabled={isLoading || generatePassword}
            />
            {!generatePassword && (
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-4 py-2 text-sm font-medium text-[#0A376C] border border-[#0A376C] rounded-md hover:bg-[#0A376C] hover:text-white transition-colors"
                disabled={isLoading}
              >
                Generate
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            The carrier will need to change this password on first login.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[#0A376C] rounded-md hover:bg-[#082a56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Carrier'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
