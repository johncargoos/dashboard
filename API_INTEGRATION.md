# API Integration Guide - CPS Dashboard

This guide explains how the CPS Dashboard integrates with the Lambda API for managing loads and drivers.

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root of the CPS Dashboard project:

```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.execute-api.us-east-2.amazonaws.com/v1
```

Replace `your-api-gateway-url` with your actual API Gateway URL.

### 2. API Service Files

The API integration is organized in the `lib/api/` directory:

- **`config.ts`** - API configuration and helper functions
- **`loads.ts`** - Load management API functions
- **`drivers.ts`** - Driver management API functions

## API Functions

### Load Management

#### `getLoads(params?)`
Fetches all loads with optional filtering.

```typescript
import { getLoads } from '@/lib/api/loads'

// Get all loads
const { loads } = await getLoads()

// Get loads by status
const { loads } = await getLoads({ status: 'pending' })

// Get loads for a specific driver
const { loads } = await getLoads({ driverId: 'driver@email.com' })
```

#### `createLoad(data)`
Creates a new load.

```typescript
import { createLoad } from '@/lib/api/loads'

const load = await createLoad({
  loadNo: '1082302',
  company: 'Condax',
  driverId: 'driver@email.com',
  pickupLocation: 'Kent, Utah',
  deliveryLocation: 'Pasadena, Oklahoma',
  status: 'pending',
  // ... other fields
})
```

#### `updateLoad(id, data)`
Updates an existing load.

#### `deleteLoad(id)`
Deletes a load.

### Driver Management

#### `getDrivers()`
Fetches all drivers.

```typescript
import { getDrivers } from '@/lib/api/drivers'

const drivers = await getDrivers()
```

#### `createDriver(data)`
Creates a new driver.

```typescript
import { createDriver } from '@/lib/api/drivers'

const driver = await createDriver({
  name: 'John Driver',
  email: 'driver@email.com',
  phone: '+1-555-1234',
  location: 'Kent, Utah',
  // ... other fields
})
```

## Integration Points

### 1. Carrier Dashboard (`/carrier/dashboard`)

- **Fetches loads** on page load using `getLoads()`
- **Displays loads** in the `LoadsSection` component
- **Shows empty state** when no loads exist
- **Redirects to create load** when "Create Your First Load" is clicked

### 2. Load Manager (`/carrier/load-manager`)

- **Fetches all loads** on page load
- **Displays loads** in a table format
- **Shows empty state** when no loads exist

### 3. Create Load (`/carrier/load-manager/create`)

- **Form submission** calls `createLoad()` with form data
- **Validates required fields** before submission
- **Shows error messages** if submission fails
- **Redirects to load manager** on success

### 4. Drivers Page (`/carrier/drivers`)

- **Fetches all drivers** on page load using `getDrivers()`
- **Displays drivers** in table or grid view
- **Shows empty state** when no drivers exist

## Data Flow

### Creating a Load

1. User fills out form in `/carrier/load-manager/create`
2. Form submits → `createLoad()` API call
3. Lambda function creates load in MongoDB
4. Load is stored with status "pending" or "in-transit"
5. Mobile app can fetch this load via `/trips` endpoint (it appears as an assigned trip)

### Viewing Loads

1. Dashboard/Load Manager page loads
2. Calls `getLoads()` on component mount
3. Displays loads in UI
4. Loads are formatted to match component expectations

## Authentication

Currently, the API uses a simple token-based approach:

1. Token is stored in `localStorage` as `accessToken` or `authToken`
2. Token is automatically included in API request headers
3. Update `getAuthToken()` in `lib/api/config.ts` to match your auth system

For production, you may want to:
- Use NextAuth.js or similar
- Store tokens in httpOnly cookies
- Implement token refresh logic

## Error Handling

All API functions throw errors that can be caught:

```typescript
try {
  const load = await createLoad(data)
  // Success
} catch (error) {
  // Handle error
  console.error('Failed to create load:', error.message)
}
```

## Testing

1. Set your API Gateway URL in `.env.local`
2. Ensure your Lambda function is deployed
3. Test creating a load from the dashboard
4. Verify the load appears in the load manager
5. Check that the load appears as a trip in the mobile app

## Troubleshooting

### CORS Errors
- Ensure CORS is enabled in API Gateway
- Check that your API Gateway URL is correct

### 401 Unauthorized
- Check that your auth token is being sent
- Verify token format in request headers

### 404 Not Found
- Verify API Gateway routes are configured correctly
- Check that the Lambda function is deployed

### Data Not Appearing
- Check browser console for errors
- Verify API responses in Network tab
- Ensure MongoDB connection is working

