'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/api/auth'
import { Calendar, ChevronLeft, ChevronDown, MapPin, Upload } from 'lucide-react'

interface DriversAddProps {
  onBack: () => void
  driverId?: string // For edit mode
}


const CircleUserIcon = () => (
  <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25.5" cy="25.5" r="24" stroke="#6a7280" strokeWidth="2" fill="none"/>
    <circle cx="25.5" cy="19" r="7" stroke="#6a7280" strokeWidth="2" fill="none"/>
    <path d="M10 42C10 36.4772 14.4772 32 20 32H31C36.5228 32 41 36.4772 41 42" stroke="#6a7280" strokeWidth="2" fill="none"/>
  </svg>
)

// Default options for dropdowns
const DRIVER_TYPES = [
  'Owner Operator',
  'Company Driver',
  'Lease Operator',
  'Team Driver',
  'Local Driver',
  'Regional Driver',
  'OTR Driver'
]

const REGIONS = [
  'Northeast',
  'Southeast',
  'Midwest',
  'Southwest',
  'West Coast',
  'Pacific Northwest',
  'Mountain States',
  'Great Lakes',
  'Mid-Atlantic',
  'New England'
]

const PREFERRED_ROUTES = [
  'East Coast',
  'West Coast',
  'Cross Country',
  'Regional',
  'Local',
  'Interstate',
  'Intrastate',
  'Northeast Corridor',
  'Southern Route',
  'Midwest Route'
]

const LICENSE_CLASSES = [
  'Class A',
  'Class B',
  'Class C',
  'Class D',
  'Commercial Class A',
  'Commercial Class B',
  'Commercial Class C'
]

const HAZMAT_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'pending', label: 'Pending' }
]

export function DriversAdd({ onBack, driverId }: DriversAddProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    phoneNo: '',
    address: '',
    dateOfBirth: '',
    driverType: '',
    region: '',
    preferredRoutes: '',
    licenseNo: '',
    licenseExpiryDate: '',
    licenseClass: '',
    hazmatCertification: '',
    carrierIdNumber: '',
    document: null as File | null,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Toggle dropdown
  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  // Handle dropdown selection
  const handleDropdownSelect = (field: string, value: string) => {
    handleInputChange(field, value)
    setOpenDropdown(null)
  }

  const handleSave = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.password) {
      setError('First Name, Last Name, Email Address, and Password are required')
      return
    }

    if (!formData.licenseNo) {
      setError('License Number is required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      // Show loading overlay
      const loadingOverlay = document.getElementById('loading-overlay')
      if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden')
      }

      const signUpData = {
        email: formData.emailAddress,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(), // Combine firstName and lastName
        licenseNumber: formData.licenseNo,
        carrierIdNumber: formData.carrierIdNumber || undefined,
        group: 'driver', // Default group
      }

      await signUp(signUpData)
      
      // Hide loading overlay
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden')
      }
      
      // Redirect to drivers page on success
      // Use replace with a timestamp to force a fresh navigation
      router.replace(`/carrier/drivers?refresh=${Date.now()}`)
    } catch (err: any) {
      console.error('Error creating driver:', err)
      setError(err.message || 'Failed to create driver. Please try again.')
      
      // Hide loading overlay on error
      const loadingOverlay = document.getElementById('loading-overlay')
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="bg-[#eef6ff] rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2 w-[91px]"
      >
        <ChevronLeft className="w-4 h-4 text-[#0a376c]" />
        <span className="text-sm font-medium text-[#0a376c]">Back</span>
      </button>

      {/* Title */}
      <h2 className="text-[18px] font-bold text-[#333333] tracking-[-0.36px]">
        {driverId ? 'Edit Driver' : 'Add Driver'}
      </h2>

      {/* Avatar Section */}
      <div className="flex flex-col gap-4 items-center">
        <div className="bg-gray-50 rounded-full w-[100px] h-[100px] flex items-center justify-center">
          <CircleUserIcon />
        </div>
        <button className="bg-[#eef6ff] h-8 px-3 py-2 rounded-md">
          <span className="text-xs font-medium text-[#0a376c]">Upload Photo</span>
        </button>
      </div>

      {/* Driver Information Section */}
      <div className="bg-slate-50 border border-slate-200 rounded px-6 py-4 flex flex-col gap-3">
        <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Driver Information</h3>
        
        <div className="flex gap-4 h-[58px] items-end">
          <div className="flex flex-col gap-2 flex-1 min-w-[286px]">
            <label className="text-sm font-medium text-black">First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              required
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[286px]">
            <label className="text-sm font-medium text-black">Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              required
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[256px]">
            <label className="text-sm font-medium text-black">Phone No.</label>
            <input
              type="text"
              placeholder="Phone No."
              value={formData.phoneNo}
              onChange={(e) => handleInputChange('phoneNo', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[253px]">
            <label className="text-sm font-medium text-black">Address</label>
            <div className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md flex items-center gap-1 w-full">
              <MapPin className="w-4 h-4 text-[#737373]" />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="flex-1 text-sm text-[#737373] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 h-[58px] items-end">
          <div className="flex flex-col gap-2 flex-1 min-w-[286px]">
            <label className="text-sm font-medium text-black">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              required
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[256px]">
            <label className="text-sm font-medium text-black">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              required
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[256px]">
            <label className="text-sm font-medium text-black">Confirm Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              required
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[256px]">
            <label className="text-sm font-medium text-black">Date of Birth</label>
            <div className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md flex items-center gap-1 w-full">
              <Calendar className="w-4 h-4 text-[#737373]" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="flex-1 text-sm text-[#737373] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Driver Assignment Section */}
      <div className="bg-slate-50 border border-slate-200 rounded px-6 py-4 flex flex-col gap-3">
        <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Driver Assignment</h3>
        
        <div className="flex gap-4 h-[58px] items-end">
          <div className="flex flex-col gap-2 flex-1 min-w-[286px] relative">
            <label className="text-sm font-medium text-black">Driver Type</label>
            <button
              type="button"
              onClick={() => toggleDropdown('driverType')}
              className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
            >
              <span className={`text-sm ${formData.driverType ? 'text-black' : 'text-[#737373]'}`}>
                {formData.driverType || 'Select'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#737373]" />
            </button>
            {openDropdown === 'driverType' && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {DRIVER_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleDropdownSelect('driverType', type)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[259px] relative">
            <label className="text-sm font-medium text-black">Region</label>
            <button
              type="button"
              onClick={() => toggleDropdown('region')}
              className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
            >
              <span className={`text-sm ${formData.region ? 'text-black' : 'text-[#737373]'}`}>
                {formData.region || 'Select'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#737373]" />
            </button>
            {openDropdown === 'region' && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => handleDropdownSelect('region', region)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[235px] relative">
            <label className="text-sm font-medium text-black">Preferred Routes / Zones</label>
            <button
              type="button"
              onClick={() => toggleDropdown('preferredRoutes')}
              className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
            >
              <span className={`text-sm ${formData.preferredRoutes ? 'text-black' : 'text-[#737373]'}`}>
                {formData.preferredRoutes || 'Select'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#737373]" />
            </button>
            {openDropdown === 'preferredRoutes' && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {PREFERRED_ROUTES.map((route) => (
                  <button
                    key={route}
                    type="button"
                    onClick={() => handleDropdownSelect('preferredRoutes', route)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    {route}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* License & Compliance Section */}
      <div className="bg-slate-50 border border-slate-200 rounded px-6 py-4 flex flex-col gap-3">
        <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">License & Compliance</h3>
        
        <div className="flex gap-4 h-[58px] items-end">
          <div className="flex flex-col gap-2 flex-1 min-w-[286px]">
            <label className="text-sm font-medium text-black">License No <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="License No."
              value={formData.licenseNo}
              onChange={(e) => handleInputChange('licenseNo', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              required
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[259px]">
            <label className="text-sm font-medium text-black">Carrier ID Number</label>
            <input
              type="text"
              placeholder="Carrier ID Number"
              value={formData.carrierIdNumber}
              onChange={(e) => handleInputChange('carrierIdNumber', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[259px]">
            <label className="text-sm font-medium text-black">License Expiry Date</label>
            <div className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md flex items-center gap-1 w-full">
              <Calendar className="w-4 h-4 text-[#737373]" />
              <input
                type="date"
                value={formData.licenseExpiryDate}
                onChange={(e) => handleInputChange('licenseExpiryDate', e.target.value)}
                className="flex-1 text-sm text-[#737373] outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[235px] relative">
            <label className="text-sm font-medium text-black">License Class</label>
            <button
              type="button"
              onClick={() => toggleDropdown('licenseClass')}
              className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
            >
              <span className={`text-sm ${formData.licenseClass ? 'text-black' : 'text-[#737373]'}`}>
                {formData.licenseClass || 'Select'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#737373]" />
            </button>
            {openDropdown === 'licenseClass' && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {LICENSE_CLASSES.map((licenseClass) => (
                  <button
                    key={licenseClass}
                    type="button"
                    onClick={() => handleDropdownSelect('licenseClass', licenseClass)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    {licenseClass}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[247px] relative">
            <label className="text-sm font-medium text-black">Hazmat Certification?</label>
            <button
              type="button"
              onClick={() => toggleDropdown('hazmatCertification')}
              className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
            >
              <span className={`text-sm ${formData.hazmatCertification ? 'text-black' : 'text-[#737373]'}`}>
                {HAZMAT_OPTIONS.find(h => h.value === formData.hazmatCertification)?.label || 'Select'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#737373]" />
            </button>
            {openDropdown === 'hazmatCertification' && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {HAZMAT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleDropdownSelect('hazmatCertification', option.value)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents Upload Section */}
      <div className="bg-slate-50 border border-slate-200 rounded px-6 py-4 flex flex-col gap-3">
        <label className="text-sm font-medium text-[#1f1e1e]">
          Documents Upload <span className="font-normal">(Driver's License, Insurance, and Certificates)</span>
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2 h-9 px-3 bg-[#e4f1ff] border border-[#0a376c] rounded-md cursor-pointer hover:bg-[#d4e7ff] transition-colors">
            <Upload className="w-4 h-4 text-[#0a376c]" />
            <span className="text-sm font-medium text-[#0a376c]">Choose file</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                handleInputChange('document', file)
              }}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
          {formData.document && (
            <span className="text-sm text-[#1f1e1e] flex items-center">{formData.document.name}</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className="bg-[#0a376c] h-9 px-6 py-2 rounded-md flex items-center justify-center self-end disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-sm font-medium text-white">
          {isSubmitting ? 'Saving...' : 'Save'}
        </span>
      </button>

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  )
}

