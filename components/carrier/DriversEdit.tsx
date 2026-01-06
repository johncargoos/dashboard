'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDriverById, getDrivers, updateDriver } from '@/lib/api/drivers'
import { API_BASE_URL, getAuthToken } from '@/lib/api/config'

interface DriversEditProps {
  driverId: string
  onBack: () => void
}

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4L6 8L10 12" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="#737373" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2C6.34315 2 5 3.34315 5 5C5 7 8 12 8 12C8 12 11 7 11 5C11 3.34315 9.65685 2 8 2Z" stroke="#737373" strokeWidth="1.33" fill="none"/>
    <circle cx="8" cy="5" r="1.5" stroke="#737373" strokeWidth="1.33" fill="none"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="12" height="10" rx="1" stroke="#737373" strokeWidth="1.33" fill="none"/>
    <path d="M5 2V6M11 2V6" stroke="#737373" strokeWidth="1.33" strokeLinecap="round"/>
    <path d="M2 8H14" stroke="#737373" strokeWidth="1.33" strokeLinecap="round"/>
  </svg>
)

const CircleUserIcon = () => (
  <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25.5" cy="25.5" r="24" stroke="#6a7280" strokeWidth="2" fill="none"/>
    <circle cx="25.5" cy="19" r="7" stroke="#6a7280" strokeWidth="2" fill="none"/>
    <path d="M10 42C10 36.4772 14.4772 32 20 32H31C36.5228 32 41 36.4772 41 42" stroke="#6a7280" strokeWidth="2" fill="none"/>
  </svg>
)

const DRIVER_TYPES = [
  'Owner Operator',
  'Company Driver',
  'Lease Operator',
  'Team Driver',
  'Local Driver',
  'Regional Driver',
  'OTR Driver',
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
  'New England',
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
  'Midwest Route',
]

const LICENSE_CLASSES = [
  'Class A',
  'Class B',
  'Class C',
  'Class D',
  'Commercial Class A',
  'Commercial Class B',
  'Commercial Class C',
]

const HAZMAT_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'pending', label: 'Pending' },
]

type OpenDropdown =
  | 'driverType'
  | 'region'
  | 'preferredRoutes'
  | 'licenseClass'
  | 'hazmatCertification'
  | null

export function DriversEdit({ driverId, onBack }: DriversEditProps) {
  const router = useRouter()
  const [resolvedDriverId, setResolvedDriverId] = useState(driverId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
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
    location: '',
  })

  const fullName = useMemo(
    () => `${formData.firstName} ${formData.lastName}`.trim(),
    [formData.firstName, formData.lastName]
  )

  useEffect(() => {
    async function loadDriver() {
      try {
        setIsLoading(true)
        let driverDetail = null
        let resolvedIdLocal = driverId
        let licenseNumber: string | undefined
        let carrierIdNumber: string | undefined

        try {
          driverDetail = await getDriverById(driverId)
        } catch (primaryErr: any) {
          console.warn('Primary driver fetch failed, attempting fallback list lookup', primaryErr)
          try {
            const list = await getDrivers()
            const decodedId = decodeURIComponent(driverId)
            const fallback = list.find(
              (d) => d.id === driverId || d.id === decodedId || d.email === decodedId
            )
            if (fallback) {
              resolvedIdLocal = fallback.id
              // Minimal shape to hydrate form
              driverDetail = {
                driver: {
                  externalId: fallback.id,
                  name: fallback.name,
                  email: fallback.email ?? '',
                  phone: fallback.phone ?? '',
                  location: fallback.location ?? '',
                  score: {
                    current: fallback.score ?? 0,
                    tier: '',
                    breakdown: { S: 0, T: 0, Q: 0, E: 0, F: 0 },
                    updatedAt: '',
                    formulaVersion: '',
                  },
                  stats: {
                    completedDeliveries: 0,
                    totalMileage: 0,
                    onTimeStreak: 0,
                    avgStars: 0,
                    lastTripAt: null,
                    acceptanceRate: fallback.acceptanceRate ?? 0,
                  },
                  createdAt: '',
                  updatedAt: '',
                },
                latestScore: null,
              }
            }
          } catch (listErr) {
            console.error('Fallback driver list fetch failed', listErr)
          }

          // Final fallback: call /me like the mobile app to hydrate profile fields
          if (!driverDetail) {
            try {
              const token = getAuthToken()
              if (!token) {
                throw new Error('No auth token found')
              }
              const res = await fetch(`${API_BASE_URL}/me`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: token }),
              })
              if (!res.ok) {
                throw new Error(`ME endpoint failed (${res.status})`)
              }
              const data = await res.json()
              driverDetail = {
                driver: {
                  externalId: data.email ?? driverId,
                  name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || data.email || driverId,
                  email: data.email ?? '',
                  phone: '',
                  location: '',
                  score: {
                    current: data.score ?? 0,
                    tier: '',
                    breakdown: { S: 0, T: 0, Q: 0, E: 0, F: 0 },
                    updatedAt: '',
                    formulaVersion: '',
                  },
                  stats: {
                    completedDeliveries: 0,
                    totalMileage: 0,
                    onTimeStreak: 0,
                    avgStars: 0,
                    lastTripAt: null,
                    acceptanceRate: 0,
                  },
                  createdAt: '',
                  updatedAt: '',
                },
                latestScore: null,
              }
              licenseNumber = data.licenseNumber
              carrierIdNumber = data.carrierIdNumber
              resolvedIdLocal = data.email ?? driverId
            } catch (meErr) {
              console.error('Fallback /me fetch failed', meErr)
            }
          }
        }

        if (!driverDetail) {
          throw new Error('Driver not found')
        }

        const driver = driverDetail.driver
        const nameParts = driver.name?.split(' ') ?? []
        const firstName = nameParts[0] ?? ''
        const lastName = nameParts.slice(1).join(' ')

        setResolvedDriverId(resolvedIdLocal)
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          emailAddress: driver.email ?? '',
          phoneNo: driver.phone ?? '',
          location: driver.location ?? '',
          licenseNo: (driver as any).licenseNumber ?? licenseNumber ?? prev.licenseNo,
          carrierIdNumber: (driver as any).carrierIdNumber ?? carrierIdNumber ?? prev.carrierIdNumber,
        }))
      } catch (err: any) {
        console.error('Error loading driver', err)
        setError(err?.message || 'Failed to load driver')
      } finally {
        setIsLoading(false)
      }
    }

    loadDriver()
  }, [driverId])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleDropdown = (dropdownName: OpenDropdown) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const handleDropdownSelect = (field: keyof typeof formData, value: string) => {
    handleInputChange(field, value)
    setOpenDropdown(null)
  }

  const handleSave = async () => {
    if (isSubmitting) return

    if (!formData.firstName || !formData.lastName) {
      setError('First Name and Last Name are required')
      return
    }

    if (!formData.licenseNo) {
      setError('License Number is required')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await updateDriver(resolvedDriverId, {
        name: fullName,
        email: formData.emailAddress || undefined,
        phone: formData.phoneNo || undefined,
        location: formData.location || formData.address || undefined,
        licenseNumber: formData.licenseNo,
        carrierIdNumber: formData.carrierIdNumber || undefined,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        driverType: formData.driverType || undefined,
        region: formData.region || undefined,
        preferredRoutes: formData.preferredRoutes || undefined,
        licenseExpiryDate: formData.licenseExpiryDate || undefined,
        licenseClass: formData.licenseClass || undefined,
        hazmatCertification: formData.hazmatCertification || undefined,
      })

      router.push(`/carrier/drivers/${resolvedDriverId}`)
    } catch (err: any) {
      console.error('Error updating driver:', err)
      setError(err?.message || 'Failed to update driver. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={onBack}
        className="bg-[#eef6ff] rounded-md h-9 px-4 py-2 flex items-center justify-center gap-2 w-[91px]"
      >
        <ChevronLeftIcon />
        <span className="text-sm font-medium text-[#0a376c]">Back</span>
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#333333] tracking-[-0.36px]">Edit Driver</h2>
        <div className="text-sm text-[#737373]">
          Driver ID: <span className="font-medium text-[#1f1e1e]">{driverId}</span>
        </div>
      </div>

      {/* Avatar Section (static placeholder for now) */}
      <div className="flex flex-col gap-4 items-center">
        <div className="bg-gray-50 rounded-full w-[100px] h-[100px] flex items-center justify-center">
          <CircleUserIcon />
        </div>
        <button className="bg-[#eef6ff] h-8 px-3 py-2 rounded-md">
          <span className="text-xs font-medium text-[#0a376c]">Upload Photo</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-sm text-[#737373]">
          Loading driver details...
        </div>
      ) : (
        <>
          {/* Driver Information Section */}
          <div className="bg-slate-50 border border-slate-200 rounded px-6 py-4 flex flex-col gap-3">
            <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Driver Information</h3>

            <div className="flex gap-4 h-[58px] items-end">
              <div className="flex flex-col gap-2 flex-1 min-w-[286px]">
                <label className="text-sm font-medium text-black">
                  First Name <span className="text-red-500">*</span>
                </label>
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
                <label className="text-sm font-medium text-black">
                  Last Name <span className="text-red-500">*</span>
                </label>
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
                  <MapPinIcon />
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
                <label className="text-sm font-medium text-black">Email Address</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-[256px]">
                <label className="text-sm font-medium text-black">Date of Birth</label>
                <div className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md flex items-center gap-1 w-full">
                  <CalendarIcon />
                  <input
                    type="text"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="flex-1 text-sm text-[#737373] outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-[256px]">
                <label className="text-sm font-medium text-black">Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-[256px]">
                <label className="text-sm font-medium text-black">Preferred Routes / Zones</label>
                <button
                  type="button"
                  onClick={() => toggleDropdown('preferredRoutes')}
                  className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
                >
                  <span className={`text-sm ${formData.preferredRoutes ? 'text-black' : 'text-[#737373]'}`}>
                    {formData.preferredRoutes || 'Select'}
                  </span>
                  <ChevronDownIcon />
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
                  <ChevronDownIcon />
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
                  <ChevronDownIcon />
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
                  <ChevronDownIcon />
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
                <label className="text-sm font-medium text-black">
                  License No <span className="text-red-500">*</span>
                </label>
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
                  <CalendarIcon />
                  <input
                    type="text"
                    placeholder="Date"
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
                  <ChevronDownIcon />
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
                  <ChevronDownIcon />
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

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-[#0a376c] h-9 px-4 py-2 rounded-md flex items-center justify-center self-end disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm font-medium text-white">
              {isSubmitting ? 'Saving...' : 'Save'}
            </span>
          </button>
        </>
      )}

      {openDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  )
}


