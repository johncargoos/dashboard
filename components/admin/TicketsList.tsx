'use client'

import { useEffect, useState } from 'react'
import { getTicketsSummary } from '@/lib/api/tickets'

interface Ticket {
  ticketNo: string
  title: string
  assignee: string
  status: string
}

interface TicketsListProps {
  className?: string
}

export function TicketsList({ className = '' }: TicketsListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true)
        const data = await getTicketsSummary(5)
        
        // Transform API data to match component interface
        const transformedTickets: Ticket[] = data.map((ticket) => ({
          ticketNo: ticket.ticketNo || `ST-${ticket.id}`,
          title: ticket.title,
          assignee: ticket.assignee,
          status: ticket.status === 'open' ? 'Open' : ticket.status === 'in-review' ? 'In Review' : ticket.status === 'waiting' ? 'Waiting' : 'Resolved',
        }))
        
        setTickets(transformedTickets)
      } catch (error) {
        // Silently handle errors - endpoint doesn't exist yet
        setTickets([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'text-orange-700 bg-orange-50'
      case 'waiting':
        return 'text-yellow-700 bg-yellow-50'
      case 'in review':
        return 'text-blue-700 bg-blue-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`} style={{ padding: '16px' }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`} style={{ padding: '16px' }}>
      <div className="flex items-start justify-between mb-4" style={{ marginBottom: '12px' }}>
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1 leading-5">Tickets to Handle</h2>
          <p className="text-sm text-gray-600 leading-5" style={{ marginTop: '4px' }}>Active tickets that may require action</p>
        </div>
        <a href="/admin/tickets" className="text-sm font-medium text-[#0a376c] hover:underline leading-5">
          See all
        </a>
      </div>

      <div className="space-y-3">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div 
              key={ticket.ticketNo} 
              className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ padding: '12px' }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 leading-5">{ticket.ticketNo}</span>
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="mb-1">
                <p className="text-sm font-medium text-gray-900 leading-4">{ticket.title}</p>
              </div>
              <p className="text-sm text-gray-600 leading-4">{ticket.assignee}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 py-8">
            No tickets to display
          </div>
        )}
      </div>
    </div>
  )
}
