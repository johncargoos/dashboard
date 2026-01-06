/**
 * API Configuration
 * Set your API Gateway URL here
 */

// Get API URL from environment variable or use default
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ||
  'https://adkt395boj.execute-api.us-east-2.amazonaws.com/v1';

/**
 * Get authorization token from localStorage or session
 * In production, you would get this from your auth system
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken') || localStorage.getItem('authToken');
}

/**
 * Default headers for API requests
 */
export function getDefaultHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Handle API response
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: any = { error: 'Unknown error' };
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text);
      }
    } catch {
      errorData = { error: `API request failed: ${response.status} ${response.statusText}` };
    }
    
    // Provide more specific error messages
    if (response.status === 403) {
      throw new Error(errorData.error || 'Access forbidden. Please check your authentication or API Gateway configuration.');
    } else if (response.status === 401) {
      throw new Error(errorData.error || 'Unauthorized. Please check your authentication token.');
    } else {
      throw new Error(errorData.error || `API request failed: ${response.statusText}`);
    }
  }
  return response.json();
}

/**
 * Safe fetch that handles CORS and network errors gracefully
 * Returns null if the endpoint doesn't exist or has CORS issues
 */
export async function safeFetch(url: string, options: RequestInit = {}): Promise<Response | null> {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error: any) {
    // Handle CORS errors and network failures gracefully
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      // Endpoint likely doesn't exist or has CORS issues - return null
      return null;
    }
    // Re-throw other errors
    throw error;
  }
}

