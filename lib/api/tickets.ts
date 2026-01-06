import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config'

export interface Ticket {
  id: string
  ticketNo: string
  title: string
  assignee: string
  status: 'open' | 'in-review' | 'resolved' | 'waiting'
  createdAt?: string
  updatedAt?: string
}

export interface TicketsResponse {
  tickets: Ticket[]
  total: number
}

/**
 * Get all tickets
 */
export async function getTickets(): Promise<TicketsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'GET',
      headers: getDefaultHeaders(),
    })

    // If endpoint doesn't exist or has CORS issues, return empty array
    if (!response || !response.ok) {
      return { tickets: [], total: 0 }
    }

    const tickets = await handleResponse<Ticket[]>(response)
    
    return {
      tickets: tickets || [],
      total: tickets?.length || 0,
    }
  } catch (error: any) {
    // Handle CORS errors and network failures gracefully
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      return { tickets: [], total: 0 }
    }
    // Re-throw other errors
    throw error
  }
}

/**
 * Get tickets summary (for overview)
 */
export async function getTicketsSummary(limit: number = 5): Promise<Ticket[]> {
  try {
    const data = await getTickets()
    return data.tickets.slice(0, limit)
  } catch (error: any) {
    // Silently handle errors - endpoint doesn't exist yet
    return []
  }
}
