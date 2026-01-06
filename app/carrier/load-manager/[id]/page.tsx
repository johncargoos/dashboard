'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'
import { useRouter, useParams } from 'next/navigation'
import { getLoadById, deleteLoad, type Load } from '@/lib/api/loads'

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4L6 8L10 12" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 2.00001C11.5084 1.8249 11.7163 1.68601 11.9447 1.59124C12.1731 1.49647 12.4173 1.44775 12.6638 1.44775C12.9103 1.44775 13.1545 1.49647 13.3829 1.59124C13.6113 1.68601 13.8192 1.8249 13.9943 2.00001C14.1694 2.17512 14.3083 2.38301 14.4031 2.61141C14.4979 2.83981 14.5466 3.08401 14.5466 3.33051C14.5466 3.57701 14.4979 3.82121 14.4031 4.04961C14.3083 4.27801 14.1694 4.4859 13.9943 4.66101L5.32434 13.331L1.33334 14.6667L2.669 10.6757L11.3333 2.00001Z" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33334 13.687 3.33334 13.3333V4M5.33334 4V2.66667C5.33334 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66667 1.33334H9.33334C9.68696 1.33334 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#dc2626" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PendingIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="#737373" strokeWidth="1.25" fill="none"/>
    <path d="M6 3V6L8 8" stroke="#737373" strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
)

const LoaderIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="#e17100" strokeWidth="1.25" fill="none"/>
  </svg>
)

const CircleCheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="#00a63e" strokeWidth="1.25" fill="none"/>
    <path d="M4 6L5.5 7.5L8 5" stroke="#00a63e" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function ViewLoadPage() {
  const router = useRouter()
  const params = useParams()
  const loadId = params?.id as string
  const [load, setLoad] = useState<Load | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', 'carrier')
      document.cookie = 'userType=carrier; path=/; max-age=31536000'
    }
  }, [])

  useEffect(() => {
    const fetchLoad = async () => {
      if (!loadId) return
      
      try {
        setIsLoading(true)
        const response = await getLoadById(loadId)
        setLoad(response.load)
      } catch (error) {
        console.error('Error fetching load:', error)
        setError('Failed to load load details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoad()
  }, [loadId])

  const handleEdit = () => {
    router.push(`/carrier/load-manager/edit/${loadId}`)
  }

  const handleDelete = async () => {
    if (!loadId) return
    
    if (confirm(`Are you sure you want to delete load ${load?.loadNo}?`)) {
      try {
        await deleteLoad(loadId)
        router.push('/carrier/load-manager')
      } catch (error) {
        console.error('Error deleting load:', error)
        alert('Failed to delete load. Please try again.')
      }
    }
  }

  const handleBack = () => {
    router.push('/carrier/load-manager')
  }

  const formatDate = (date?: string | Date) => {
    if (!date) return 'N/A'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (time?: string) => {
    if (!time) return 'N/A'
    return time
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="bg-white border border-[#737373] rounded-md px-2 py-0.5 flex items-center gap-1 inline-flex">
            <PendingIcon />
            <span className="text-xs font-semibold text-[#0a0a0a]">Pending</span>
          </div>
        )
      case 'in-transit':
        return (
          <div className="bg-white border border-[#e17100] rounded-md px-2 py-0.5 flex items-center gap-1 inline-flex">
            <LoaderIcon />
            <span className="text-xs font-semibold text-[#0a0a0a]">In Transit</span>
          </div>
        )
      case 'completed':
        return (
          <div className="bg-white border border-[#00a63e] rounded-md px-2 py-0.5 flex items-center gap-1 inline-flex">
            <CircleCheckIcon />
            <span className="text-xs font-semibold text-[#0a0a0a]">Completed</span>
          </div>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
        <Sidebar userType="carrier" />
        <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden">
          <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100">
            <Header userType="carrier" />
          </div>
          <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="text-lg text-gray-600">Loading load details...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !load) {
    return (
      <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
        <Sidebar userType="carrier" />
        <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden">
          <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100">
            <Header userType="carrier" />
          </div>
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error || 'Load not found'}</p>
            </div>
            <button
              onClick={handleBack}
              className="mt-4 bg-[#eef6ff] h-9 px-4 py-2 rounded-md flex items-center gap-2"
            >
              <ChevronLeftIcon />
              <span className="text-sm font-medium text-[#0a376c]">Back</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#0A376C' }}>
      <Sidebar userType="carrier" />
      <div className="flex-1 bg-white rounded-tl-[40px] rounded-bl-[40px] min-h-screen overflow-hidden shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-slate-50">
        <div className="w-full h-16 pl-6 pr-8 py-4 border-b-2 border-slate-100 inline-flex flex-col justify-center items-end gap-2.5">
          <Header userType="carrier" />
        </div>
        
        <div className="p-8">
          <div className="flex flex-col gap-3 w-full">
            {/* Back Button and Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="bg-[#eef6ff] h-9 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <ChevronLeftIcon />
                <span className="text-sm font-medium text-[#0a376c]">Back</span>
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="bg-[#0a376c] h-9 px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <EditIcon />
                  <span className="text-sm font-medium text-white">Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 h-9 px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <DeleteIcon />
                  <span className="text-sm font-medium text-white">Delete</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[18px] font-bold text-[#1f1e1e] tracking-[-0.36px]">Load Details</h1>

            {/* Load Information */}
            <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-5 flex flex-col gap-4">
              <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Load Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Load No.</label>
                  <p className="text-sm text-black mt-1">{load.loadNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="text-sm text-black mt-1">{load.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(load.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rate Confirmation No.</label>
                  <p className="text-sm text-black mt-1">{load.rates?.rateConfirmationNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Driver</label>
                  <p className="text-sm text-black mt-1">{load.driver || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Score</label>
                  <p className="text-sm text-black mt-1">{load.score !== null && load.score !== undefined ? load.score : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
              <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Pickup Location</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-sm text-black mt-1">{load.pickupLocation}</p>
                </div>
                {load.pickup?.state && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="text-sm text-black mt-1">{load.pickup.state}</p>
                  </div>
                )}
                {load.pickup?.city && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-sm text-black mt-1">{load.pickup.city}</p>
                  </div>
                )}
                {load.pickup?.zip && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">ZIP</label>
                    <p className="text-sm text-black mt-1">{load.pickup.zip}</p>
                  </div>
                )}
                {load.pickup?.address && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-sm text-black mt-1">{load.pickup.address}</p>
                  </div>
                )}
                {load.pickup?.contact && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact</label>
                    <p className="text-sm text-black mt-1">{load.pickup.contact}</p>
                  </div>
                )}
                {load.pickup?.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm text-black mt-1">{load.pickup.phone}</p>
                  </div>
                )}
                {load.pickup?.date && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-sm text-black mt-1">{formatDate(load.pickup.date)}</p>
                  </div>
                )}
                {load.pickup?.time && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time</label>
                    <p className="text-sm text-black mt-1">{formatTime(load.pickup.time)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Location */}
            <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
              <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Delivery Location</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-sm text-black mt-1">{load.deliveryLocation}</p>
                </div>
                {load.delivery?.state && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="text-sm text-black mt-1">{load.delivery.state}</p>
                  </div>
                )}
                {load.delivery?.city && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-sm text-black mt-1">{load.delivery.city}</p>
                  </div>
                )}
                {load.delivery?.zip && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">ZIP</label>
                    <p className="text-sm text-black mt-1">{load.delivery.zip}</p>
                  </div>
                )}
                {load.delivery?.address && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-sm text-black mt-1">{load.delivery.address}</p>
                  </div>
                )}
                {load.delivery?.contact && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact</label>
                    <p className="text-sm text-black mt-1">{load.delivery.contact}</p>
                  </div>
                )}
                {load.delivery?.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm text-black mt-1">{load.delivery.phone}</p>
                  </div>
                )}
                {load.delivery?.date && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-sm text-black mt-1">{formatDate(load.delivery.date)}</p>
                  </div>
                )}
                {load.delivery?.time && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time</label>
                    <p className="text-sm text-black mt-1">{formatTime(load.delivery.time)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipment Details */}
            <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
              <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Shipment Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {load.shipment?.pieces && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pieces</label>
                    <p className="text-sm text-black mt-1">{load.shipment.pieces}</p>
                  </div>
                )}
                {load.shipment?.weight && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Weight</label>
                    <p className="text-sm text-black mt-1">{load.shipment.weight} lbs</p>
                  </div>
                )}
                {load.shipment?.commodity && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Commodity</label>
                    <p className="text-sm text-black mt-1">{load.shipment.commodity}</p>
                  </div>
                )}
                {load.equipmentType && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Equipment Type</label>
                    <p className="text-sm text-black mt-1">{load.equipmentType}</p>
                  </div>
                )}
                {load.shipment?.specialInstructions && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Special Instructions</label>
                    <p className="text-sm text-black mt-1">{load.shipment.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rates */}
            {(load.rates?.totalRate || load.rates?.fuelSurcharge) && (
              <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
                <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Rates</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {load.rates?.totalRate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Total Rate</label>
                      <p className="text-sm text-black mt-1">${load.rates.totalRate.toLocaleString()}</p>
                    </div>
                  )}
                  {load.rates?.fuelSurcharge && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fuel Surcharge</label>
                      <p className="text-sm text-black mt-1">${load.rates.fuelSurcharge.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

