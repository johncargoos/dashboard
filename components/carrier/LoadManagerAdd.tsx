'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createLoad, updateLoad, getLoadById, type CreateLoadRequest, type Load } from '@/lib/api/loads'
import { getDrivers, type Driver } from '@/lib/api/drivers'
import { Search } from 'lucide-react'

interface LoadManagerAddProps {
  onBack: () => void
  loadId?: string  // For edit mode
  initialData?: Load  // For edit mode
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

const PercentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" stroke="#0a376c" strokeWidth="1.33" fill="none"/>
    <path d="M5 5L11 11M11 5L5 11" stroke="#0a376c" strokeWidth="1.33" strokeLinecap="round"/>
  </svg>
)

// Default options for dropdowns
const CLIENT_NAMES = [
  'Condax',
  'Warephase',
  'Golddex',
  'Lexiqvolax',
  'Sumace',
  'Y-corporation',
  'Donquadtech',
  'Freight Masters LLC',
  'Swift Transport',
  'Global Logistics Inc'
]

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-transit', label: 'In Transit' },
  { value: 'completed', label: 'Completed' }
]

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

const CITIES_BY_STATE: Record<string, string[]> = {
  'Utah': ['Salt Lake City', 'Provo', 'Ogden', 'St. George', 'Logan', 'Orem', 'Layton', 'Sandy', 'Kent'],
  'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton', 'Edmond', 'Moore', 'Pasadena'],
  'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Elgin', 'Peoria', 'Lansing', 'Portland'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Corona'],
  'Connecticut': ['Bridgeport', 'New Haven', 'Hartford', 'Stamford', 'Waterbury', 'Norwalk', 'Syracuse'],
  'Virginia': ['Virginia Beach', 'Norfolk', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Coppell'],
  'Maryland': ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Annapolis', 'Great Falls'],
  'California': ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Lafayette'],
  'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'Queens']
}

const EQUIPMENT_TYPES = [
  'Dry Van',
  'Refrigerated',
  'Flatbed',
  'Step Deck',
  'Double Drop',
  'RGN (Removable Gooseneck)',
  'Lowboy',
  'Box Truck',
  'Hotshot',
  'Container'
]

const PIECES_OPTIONS = [
  '1', '2', '5', '10', '15', '20', '25', '30', '40', '50', '75', '100', '150', '200', '250', '500', '1000+'
]

export function LoadManagerAdd({ onBack, loadId, initialData }: LoadManagerAddProps) {
  const router = useRouter()
  const isEditMode = !!loadId
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false)
  const [isDriverDropdownOpen, setIsDriverDropdownOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoadingLoad, setIsLoadingLoad] = useState(isEditMode && !initialData)
  const [pickupStateSearch, setPickupStateSearch] = useState('')
  const [deliveryStateSearch, setDeliveryStateSearch] = useState('')
  
  // Initialize form data from initialData or load from API
  const [formData, setFormData] = useState({
    loadNo: '',
    clientName: '',
    rateConfirmationNo: '',
    status: 'pending',
    pickupState: '',
    pickupCity: '',
    pickupZip: '',
    pickupAddress: '',
    pickupContact: '',
    pickupPhone: '',
    pickupDate: '',
    pickupTime: '',
    deliveryState: '',
    deliveryCity: '',
    deliveryZip: '',
    deliveryAddress: '',
    deliveryContact: '',
    deliveryPhone: '',
    deliveryDate: '',
    deliveryTime: '',
    pieces: '',
    weight: '',
    commodity: '',
    specialInstructions: '',
    smartMatch: false,
    assignedDriver: '',
    driverPhone: '',
    equipmentType: '',
    totalRate: '',
    fuelSurcharge: '',
    document: null as File | null,
  })

  // Fetch load data if in edit mode
  useEffect(() => {
    if (isEditMode && loadId && !initialData) {
      const fetchLoad = async () => {
        try {
          setIsLoadingLoad(true)
          const response = await getLoadById(loadId)
          const load = response.load
          
          // Populate form with load data
          setFormData({
            loadNo: load.loadNo || '',
            clientName: load.company || '',
            rateConfirmationNo: load.rates?.rateConfirmationNo || '',
            status: load.status || 'pending',
            pickupState: load.pickup?.state || '',
            pickupCity: load.pickup?.city || '',
            pickupZip: load.pickup?.zip || '',
            pickupAddress: load.pickup?.address || '',
            pickupContact: load.pickup?.contact || '',
            pickupPhone: load.pickup?.phone || '',
            pickupDate: load.pickup?.date ? (typeof load.pickup.date === 'string' ? load.pickup.date.split('T')[0] : new Date(load.pickup.date).toISOString().split('T')[0]) : '',
            pickupTime: load.pickup?.time || '',
            deliveryState: load.delivery?.state || '',
            deliveryCity: load.delivery?.city || '',
            deliveryZip: load.delivery?.zip || '',
            deliveryAddress: load.delivery?.address || '',
            deliveryContact: load.delivery?.contact || '',
            deliveryPhone: load.delivery?.phone || '',
            deliveryDate: load.delivery?.date ? (typeof load.delivery.date === 'string' ? load.delivery.date.split('T')[0] : new Date(load.delivery.date).toISOString().split('T')[0]) : '',
            deliveryTime: load.delivery?.time || '',
            pieces: load.shipment?.pieces?.toString() || '',
            weight: load.shipment?.weight?.toString() || '',
            commodity: load.shipment?.commodity || '',
            specialInstructions: load.shipment?.specialInstructions || '',
            smartMatch: false,
            assignedDriver: load.driverId || '',
            driverPhone: '',
            equipmentType: load.equipmentType || '',
            totalRate: load.rates?.totalRate?.toString() || '',
            fuelSurcharge: load.rates?.fuelSurcharge?.toString() || '',
            document: null,
          })
        } catch (error) {
          console.error('Error fetching load:', error)
          setError('Failed to load load data')
        } finally {
          setIsLoadingLoad(false)
        }
      }
      fetchLoad()
    } else if (initialData) {
      // Use provided initial data
      setFormData({
        loadNo: initialData.loadNo || '',
        clientName: initialData.company || '',
        rateConfirmationNo: initialData.rates?.rateConfirmationNo || '',
        status: initialData.status || 'pending',
        pickupState: initialData.pickup?.state || '',
        pickupCity: initialData.pickup?.city || '',
        pickupZip: initialData.pickup?.zip || '',
        pickupAddress: initialData.pickup?.address || '',
        pickupContact: initialData.pickup?.contact || '',
        pickupPhone: initialData.pickup?.phone || '',
        pickupDate: initialData.pickup?.date ? (typeof initialData.pickup.date === 'string' ? initialData.pickup.date.split('T')[0] : new Date(initialData.pickup.date).toISOString().split('T')[0]) : '',
        pickupTime: initialData.pickup?.time || '',
        deliveryState: initialData.delivery?.state || '',
        deliveryCity: initialData.delivery?.city || '',
        deliveryZip: initialData.delivery?.zip || '',
        deliveryAddress: initialData.delivery?.address || '',
        deliveryContact: initialData.delivery?.contact || '',
        deliveryPhone: initialData.delivery?.phone || '',
        deliveryDate: initialData.delivery?.date ? (typeof initialData.delivery.date === 'string' ? initialData.delivery.date.split('T')[0] : new Date(initialData.delivery.date).toISOString().split('T')[0]) : '',
        deliveryTime: initialData.delivery?.time || '',
        pieces: initialData.shipment?.pieces?.toString() || '',
        weight: initialData.shipment?.weight?.toString() || '',
        commodity: initialData.shipment?.commodity || '',
        specialInstructions: initialData.shipment?.specialInstructions || '',
        smartMatch: false,
        assignedDriver: initialData.driverId || '',
        driverPhone: '',
        equipmentType: initialData.equipmentType || '',
        totalRate: initialData.rates?.totalRate?.toString() || '',
        fuelSurcharge: initialData.rates?.fuelSurcharge?.toString() || '',
        document: null,
      })
    }
  }, [isEditMode, loadId, initialData])

  // Fetch drivers on component mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setIsLoadingDrivers(true)
        const driversData = await getDrivers()
        setDrivers(driversData || [])
      } catch (error) {
        console.error('Error fetching drivers:', error)
        setDrivers([])
      } finally {
        setIsLoadingDrivers(false)
      }
    }

    fetchDrivers()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Smart Match algorithm
  const calculateDriverScore = (driver: Driver, loadData: typeof formData): number => {
    let score = 0
    
    // 1. Driver Score (0-1000 scale, normalized to 0-40 points)
    if (driver.score !== null && driver.score !== undefined) {
      score += (driver.score / 1000) * 40
    }
    
    // 2. Location/Region Match (0-30 points)
    const pickupState = loadData.pickupState?.toLowerCase() || ''
    const deliveryState = loadData.deliveryState?.toLowerCase() || ''
    const driverLocation = driver.location?.toLowerCase() || ''
    
    // Check if driver location matches pickup or delivery state
    if (pickupState && driverLocation.includes(pickupState)) {
      score += 15
    }
    if (deliveryState && driverLocation.includes(deliveryState)) {
      score += 15
    }
    
    // 3. Acceptance Rate (0-20 points)
    if (driver.acceptanceRate !== undefined) {
      score += (driver.acceptanceRate / 100) * 20
    }
    
    // 4. ETA to Pickup (0-10 points) - lower ETA is better
    if (driver.etaToPickup !== null && driver.etaToPickup !== undefined) {
      // Normalize: 0 hours = 10 points, 24+ hours = 0 points
      const etaScore = Math.max(0, 10 - (driver.etaToPickup / 24) * 10)
      score += etaScore
    } else {
      // If no ETA data, give neutral score
      score += 5
    }
    
    return score
  }

  // Handle Smart Match toggle
  useEffect(() => {
    if (formData.smartMatch && drivers.length > 0) {
      // Calculate scores for all drivers
      const driverScores = drivers.map(driver => ({
        driver,
        score: calculateDriverScore(driver, formData)
      }))
      
      // Sort by score (highest first)
      driverScores.sort((a, b) => b.score - a.score)
      
      // Select the best match
      if (driverScores.length > 0 && driverScores[0].score > 0) {
        const bestDriver = driverScores[0].driver
        setFormData(prev => ({
          ...prev,
          assignedDriver: bestDriver.id,
          driverPhone: bestDriver.phone || prev.driverPhone
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.smartMatch, formData.pickupState, formData.deliveryState, drivers.length])

  const handleDriverSelect = (driverId: string) => {
    const selectedDriver = drivers.find(d => d.id === driverId)
    // Use driver.id (which should be email) as driverId for API
    handleInputChange('assignedDriver', driverId) // driverId is email (primary identifier)
    if (selectedDriver?.phone) {
      handleInputChange('driverPhone', selectedDriver.phone)
    }
    setIsDriverDropdownOpen(false)
    // Disable Smart Match when manually selecting
    if (formData.smartMatch) {
      handleInputChange('smartMatch', false)
    }
  }

  const selectedDriver = drivers.find(d => d.id === formData.assignedDriver)
  const selectedDriverName = selectedDriver?.name || 'Select Driver'

  // Get cities for selected state
  const availableCities = formData.pickupState ? (CITIES_BY_STATE[formData.pickupState] || []) : []
  const availableDeliveryCities = formData.deliveryState ? (CITIES_BY_STATE[formData.deliveryState] || []) : []
  
  // Filter states based on search
  const filteredPickupStates = US_STATES.filter(state =>
    state.toLowerCase().includes(pickupStateSearch.toLowerCase())
  )
  const filteredDeliveryStates = US_STATES.filter(state =>
    state.toLowerCase().includes(deliveryStateSearch.toLowerCase())
  )

  // Toggle dropdown
  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
    // Reset search when opening/closing dropdowns
    if (dropdownName === 'pickupState') {
      setPickupStateSearch('')
    } else if (dropdownName === 'deliveryState') {
      setDeliveryStateSearch('')
    }
  }

  // Handle dropdown selection
  const handleDropdownSelect = (field: string, value: string) => {
    handleInputChange(field, value)
    setOpenDropdown(null)
    
    // Clear city when state changes
    if (field === 'pickupState') {
      handleInputChange('pickupCity', '')
    }
    if (field === 'deliveryState') {
      handleInputChange('deliveryCity', '')
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.loadNo || !formData.clientName) {
      setError('Load No. and Client Name are required')
      return
    }

    // Build pickup and delivery locations
    const pickupLocation = formData.pickupCity 
      ? `${formData.pickupCity}, ${formData.pickupState || ''}`.trim()
      : formData.pickupAddress || ''
    
    const deliveryLocation = formData.deliveryCity 
      ? `${formData.deliveryCity}, ${formData.deliveryState || ''}`.trim()
      : formData.deliveryAddress || ''

    if (!pickupLocation || !deliveryLocation) {
      setError('Pickup and Delivery locations are required')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const loadData: CreateLoadRequest = {
        loadNo: formData.loadNo,
        company: formData.clientName,
        driverId: formData.assignedDriver || undefined,
        pickupLocation,
        deliveryLocation,
        status: (formData.status || 'pending') as 'pending' | 'in-transit' | 'completed',
        pickupState: formData.pickupState || undefined,
        pickupCity: formData.pickupCity || undefined,
        pickupZip: formData.pickupZip || undefined,
        pickupAddress: formData.pickupAddress || undefined,
        pickupContact: formData.pickupContact || undefined,
        pickupPhone: formData.pickupPhone || undefined,
        pickupDate: formData.pickupDate || undefined,
        pickupTime: formData.pickupTime || undefined,
        deliveryState: formData.deliveryState || undefined,
        deliveryCity: formData.deliveryCity || undefined,
        deliveryZip: formData.deliveryZip || undefined,
        deliveryAddress: formData.deliveryAddress || undefined,
        deliveryContact: formData.deliveryContact || undefined,
        deliveryPhone: formData.deliveryPhone || undefined,
        deliveryDate: formData.deliveryDate || undefined,
        deliveryTime: formData.deliveryTime || undefined,
        pieces: formData.pieces ? parseInt(formData.pieces) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        commodity: formData.commodity || undefined,
        specialInstructions: formData.specialInstructions || undefined,
        equipmentType: formData.equipmentType || undefined,
        rateConfirmationNo: formData.rateConfirmationNo || undefined,
        totalRate: formData.totalRate ? parseFloat(formData.totalRate) : undefined,
        fuelSurcharge: formData.fuelSurcharge ? parseFloat(formData.fuelSurcharge) : undefined,
      }

      if (isEditMode && loadId) {
        await updateLoad(loadId, loadData)
      } else {
        await createLoad(loadData)
      }
      
      // Redirect to load manager page on success
      router.push('/carrier/load-manager')
    } catch (err: any) {
      console.error('Error creating load:', err)
      setError(err.message || 'Failed to create load. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-full">
      {/* Back Button */}
      <div className="flex flex-col gap-3 items-start w-full">
        <button
          onClick={onBack}
          className="bg-[#eef6ff] h-9 px-4 py-2 rounded-md flex items-center gap-2"
        >
          <ChevronLeftIcon />
          <span className="text-sm font-medium text-[#0a376c]">Back</span>
        </button>
      </div>

      {/* Title */}
      <h1 className="text-[18px] font-bold text-[#1f1e1e] tracking-[-0.36px]">
        {isEditMode ? 'Edit Load' : 'Create Load'}
      </h1>
      
      {/* Loading state for edit mode */}
      {isLoadingLoad && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-600">Loading load data...</p>
        </div>
      )}

      {/* Load Information Section */}
      <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-5 flex flex-col justify-between">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-4 items-end w-full">
            <div className="flex flex-col gap-2 flex-1 min-w-[149px]">
              <label className="text-sm font-medium text-black">Load No.</label>
              <input
                type="text"
                placeholder="Load No."
                value={formData.loadNo}
                onChange={(e) => handleInputChange('loadNo', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-[2] min-w-[200px] relative">
              <label className="text-sm font-medium text-black">Client Name</label>
              <button
                type="button"
                onClick={() => toggleDropdown('clientName')}
                className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
              >
                <span className={`text-sm ${formData.clientName ? 'text-black' : 'text-[#737373]'}`}>
                  {formData.clientName || 'Select'}
                </span>
                <ChevronDownIcon />
              </button>
              {openDropdown === 'clientName' && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {CLIENT_NAMES.map((client) => (
                    <button
                      key={client}
                      type="button"
                      onClick={() => handleDropdownSelect('clientName', client)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                    >
                      {client}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-black">Rate Confirmation No.</label>
              <input
                type="text"
                placeholder="Rate Confirmation No."
                value={formData.rateConfirmationNo}
                onChange={(e) => handleInputChange('rateConfirmationNo', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[120px] relative">
              <label className="text-sm font-medium text-black">Status</label>
              <button
                type="button"
                onClick={() => toggleDropdown('status')}
                className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
              >
                <span className={`text-sm ${formData.status ? 'text-black' : 'text-[#737373]'}`}>
                  {STATUS_OPTIONS.find(s => s.value === formData.status)?.label || STATUS_OPTIONS.find(s => s.value === 'pending')?.label || 'Select'}
                </span>
                <ChevronDownIcon />
              </button>
              {openDropdown === 'status' && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => handleDropdownSelect('status', status.value)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Location Section */}
      <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
        <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Pickup Location</h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 h-[58px] items-end w-full">
            <div className="flex flex-col gap-2 flex-1 min-w-[120px] relative">
              <label className="text-sm font-medium text-black">State</label>
              <button
                type="button"
                onClick={() => toggleDropdown('pickupState')}
                className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
              >
                <span className={`text-sm ${formData.pickupState ? 'text-black' : 'text-[#737373]'}`}>
                  {formData.pickupState || 'Select'}
                </span>
                <ChevronDownIcon />
              </button>
              {openDropdown === 'pickupState' && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search state..."
                        value={pickupStateSearch}
                        onChange={(e) => setPickupStateSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a376c] focus:border-[#0a376c]"
                        autoFocus
                      />
                    </div>
                  </div>
                  {/* States List */}
                  <div className="overflow-y-auto max-h-[200px]">
                    {filteredPickupStates.length > 0 ? (
                      filteredPickupStates.map((state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => handleDropdownSelect('pickupState', state)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                        >
                          {state}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">No states found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[140px] relative">
              <label className="text-sm font-medium text-black">City</label>
              <button
                type="button"
                onClick={() => toggleDropdown('pickupCity')}
                disabled={!formData.pickupState}
                className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={`text-sm ${formData.pickupCity ? 'text-black' : 'text-[#737373]'}`}>
                  {formData.pickupCity || (formData.pickupState ? 'Select' : 'Select State First')}
                </span>
                <ChevronDownIcon />
              </button>
              {openDropdown === 'pickupCity' && formData.pickupState && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {availableCities.length > 0 ? (
                    availableCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleDropdownSelect('pickupCity', city)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                      >
                        {city}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      <input
                        type="text"
                        placeholder="Enter city name"
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                        onBlur={(e) => {
                          if (e.target.value) {
                            handleDropdownSelect('pickupCity', e.target.value)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (e.currentTarget.value) {
                              handleDropdownSelect('pickupCity', e.currentTarget.value)
                            }
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
              <label className="text-sm font-medium text-black">ZIP</label>
              <input
                type="text"
                placeholder="ZIP Code"
                value={formData.pickupZip}
                onChange={(e) => handleInputChange('pickupZip', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-[2] min-w-[300px]">
              <label className="text-sm font-medium text-black">Address</label>
              <input
                type="text"
                placeholder="Address"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
          </div>

          <div className="flex gap-4 h-[58px] items-end w-full">
            <div className="flex flex-col gap-2 flex-[2] min-w-[200px]">
              <label className="text-sm font-medium text-black">Contact Person</label>
              <input
                type="text"
                placeholder="Contact Person"
                value={formData.pickupContact}
                onChange={(e) => handleInputChange('pickupContact', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-black">Phone No.</label>
              <input
                type="text"
                placeholder="Phone No."
                value={formData.pickupPhone}
                onChange={(e) => handleInputChange('pickupPhone', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
              <label className="text-sm font-medium text-black">Pickup Date</label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
              <label className="text-sm font-medium text-black">Time</label>
              <input
                type="time"
                value={formData.pickupTime}
                onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Location Section */}
      <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
        <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Delivery Location</h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 h-[58px] items-end w-full">
            <div className="flex flex-col gap-2 flex-1 min-w-[120px] relative">
              <label className="text-sm font-medium text-black">State</label>
              <button
                type="button"
                onClick={() => toggleDropdown('deliveryState')}
                className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
              >
                <span className={`text-sm ${formData.deliveryState ? 'text-black' : 'text-[#737373]'}`}>
                  {formData.deliveryState || 'Select'}
                </span>
                <ChevronDownIcon />
              </button>
              {openDropdown === 'deliveryState' && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search state..."
                        value={deliveryStateSearch}
                        onChange={(e) => setDeliveryStateSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a376c] focus:border-[#0a376c]"
                        autoFocus
                      />
                    </div>
                  </div>
                  {/* States List */}
                  <div className="overflow-y-auto max-h-[200px]">
                    {filteredDeliveryStates.length > 0 ? (
                      filteredDeliveryStates.map((state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => handleDropdownSelect('deliveryState', state)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                        >
                          {state}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">No states found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[140px] relative">
              <label className="text-sm font-medium text-black">City</label>
              <button
                type="button"
                onClick={() => toggleDropdown('deliveryCity')}
                disabled={!formData.deliveryState}
                className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={`text-sm ${formData.deliveryCity ? 'text-black' : 'text-[#737373]'}`}>
                  {formData.deliveryCity || (formData.deliveryState ? 'Select' : 'Select State First')}
                </span>
                <ChevronDownIcon />
              </button>
              {openDropdown === 'deliveryCity' && formData.deliveryState && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {availableDeliveryCities.length > 0 ? (
                    availableDeliveryCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleDropdownSelect('deliveryCity', city)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                      >
                        {city}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      <input
                        type="text"
                        placeholder="Enter city name"
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                        onBlur={(e) => {
                          if (e.target.value) {
                            handleDropdownSelect('deliveryCity', e.target.value)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (e.currentTarget.value) {
                              handleDropdownSelect('deliveryCity', e.currentTarget.value)
                            }
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
              <label className="text-sm font-medium text-black">ZIP</label>
              <input
                type="text"
                placeholder="ZIP Code"
                value={formData.deliveryZip}
                onChange={(e) => handleInputChange('deliveryZip', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-[2] min-w-[300px]">
              <label className="text-sm font-medium text-black">Address</label>
              <input
                type="text"
                placeholder="Address"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
          </div>

          <div className="flex gap-4 h-[58px] items-end w-full">
            <div className="flex flex-col gap-2 flex-[2] min-w-[200px]">
              <label className="text-sm font-medium text-black">Contact Person</label>
              <input
                type="text"
                placeholder="Contact Person"
                value={formData.deliveryContact}
                onChange={(e) => handleInputChange('deliveryContact', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-black">Phone No.</label>
              <input
                type="text"
                placeholder="Phone No."
                value={formData.deliveryPhone}
                onChange={(e) => handleInputChange('deliveryPhone', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
              <label className="text-sm font-medium text-black">Delivery Date</label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
              <label className="text-sm font-medium text-black">Time</label>
              <input
                type="time"
                value={formData.deliveryTime}
                onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Details Section */}
      <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
        <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Shipment Details</h3>
        
        <div className="flex gap-4 h-[58px] items-end w-full">
          <div className="flex flex-col gap-2 flex-1 min-w-[150px] relative">
            <label className="text-sm font-medium text-black">Number of Pieces / Units</label>
            <button
              type="button"
              onClick={() => toggleDropdown('pieces')}
              className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
            >
              <span className={`text-sm ${formData.pieces ? 'text-black' : 'text-[#737373]'}`}>
                {formData.pieces || 'Select'}
              </span>
              <ChevronDownIcon />
            </button>
            {openDropdown === 'pieces' && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {PIECES_OPTIONS.map((piece) => (
                  <button
                    key={piece}
                    type="button"
                    onClick={() => handleDropdownSelect('pieces', piece)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    {piece}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[120px]">
            <label className="text-sm font-medium text-black">Weight</label>
            <input
              type="text"
              placeholder="Weight"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
            <label className="text-sm font-medium text-black">Commodity</label>
            <input
              type="text"
              placeholder="Add"
              value={formData.commodity}
              onChange={(e) => handleInputChange('commodity', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
            />
          </div>
          <div className="flex flex-col gap-2 flex-[2] min-w-[300px]">
            <label className="text-sm font-medium text-black">Special Instructions</label>
            <input
              type="text"
              placeholder="Add Here"
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
            />
          </div>
        </div>
      </div>

      {/* Driver Information Section */}
      <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="smartMatch"
            checked={formData.smartMatch}
            onChange={(e) => handleInputChange('smartMatch', e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="smartMatch" className="text-sm font-medium text-black">Smart Match</label>
        </div>
        
        <h3 className="text-[16px] font-bold text-[#333333] tracking-[-0.32px]">Driver</h3>
        
        <div className="flex gap-4 h-[58px] items-end w-full">
          <div className="flex flex-col gap-2 flex-[2] min-w-[200px] relative">
            <label className="text-sm font-medium text-black">Assigned Driver</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDriverDropdownOpen(!isDriverDropdownOpen)}
                className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
              >
                <span className={`text-sm ${formData.assignedDriver ? 'text-black' : 'text-[#737373]'}`}>
                  {isLoadingDrivers ? 'Loading drivers...' : selectedDriverName}
                </span>
                <ChevronDownIcon />
              </button>
              
              {isDriverDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {drivers.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {isLoadingDrivers ? 'Loading...' : 'No drivers available'}
                    </div>
                  ) : (
                    drivers.map((driver) => (
                      <button
                        key={driver.id}
                        type="button"
                        onClick={() => handleDriverSelect(driver.id)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                          formData.assignedDriver === driver.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-black font-medium">{driver.name}</span>
                          {driver.score !== null && driver.score !== undefined && (
                            <span className="text-xs text-gray-500">Score: {driver.score}</span>
                          )}
                        </div>
                        {driver.email && (
                          <div className="text-xs text-gray-400 mt-0.5">{driver.email}</div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
            <label className="text-sm font-medium text-black">Driver Phone</label>
            <input
              type="text"
              placeholder="Driver Phone"
              value={formData.driverPhone}
              onChange={(e) => handleInputChange('driverPhone', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[140px] relative">
            <label className="text-sm font-medium text-black">Equipment Type</label>
            <button
              type="button"
              onClick={() => toggleDropdown('equipmentType')}
              className="h-9 px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center justify-between w-full text-left"
            >
              <span className={`text-sm ${formData.equipmentType ? 'text-black' : 'text-[#737373]'}`}>
                {formData.equipmentType || 'Select'}
              </span>
              <ChevronDownIcon />
            </button>
            {openDropdown === 'equipmentType' && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {EQUIPMENT_TYPES.map((equipment) => (
                  <button
                    key={equipment}
                    type="button"
                    onClick={() => handleDropdownSelect('equipmentType', equipment)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-black"
                  >
                    {equipment}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="bg-[#eef6ff] h-9 px-4 py-2 rounded-md flex items-center gap-2 mt-6 flex-shrink-0">
            <span className="text-sm font-medium text-[#0a376c]">Score</span>
            <PercentIcon />
          </button>
        </div>
      </div>

      {/* Rates Section */}
      <div className="bg-white border border-slate-200 rounded-lg w-full px-6 py-4 flex flex-col gap-3">
        <h3 className="text-[14px] font-bold text-[#333333] tracking-[-0.28px]">Rates</h3>
        
        <div className="flex gap-4 h-[58px] items-end w-full">
          <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
            <label className="text-sm font-medium text-black">Total Rate ($)</label>
            <input
              type="text"
              placeholder="Total Rate"
              value={formData.totalRate}
              onChange={(e) => handleInputChange('totalRate', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
            <label className="text-sm font-medium text-black">Fuel Surcharge ($)</label>
            <input
              type="text"
              placeholder="Fuel Surcharge"
              value={formData.fuelSurcharge}
              onChange={(e) => handleInputChange('fuelSurcharge', e.target.value)}
              className="h-9 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#737373] w-full"
            />
          </div>
          <div className="flex flex-col gap-2.5 flex-[2] min-w-[300px]">
            <label className="text-sm font-medium text-[#1f1e1e]">Upload Document</label>
            <div className="bg-[#eef6ff] h-[34px] px-3 py-1 border border-[#0a376c] rounded-md flex items-center gap-2 w-full">
              <button className="px-1.5 py-0.5 text-sm font-medium text-[#0a376c]">Choose file</button>
              <span className="flex-1 text-sm text-[#1f1e1e]">No file chosen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isDriverDropdownOpen || openDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsDriverDropdownOpen(false)
            setOpenDropdown(null)
          }}
        />
      )}

      {/* Save Button */}
      <div className="flex justify-end w-full">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#0a376c] h-9 px-4 py-2 rounded-md shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm font-medium text-white">
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Save')}
          </span>
        </button>
      </div>
    </div>
  )
}

