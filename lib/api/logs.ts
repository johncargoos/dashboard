import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config';

export interface LogEntry {
  id: string;
  type: 'driver_created' | 'driver_updated' | 'driver_deleted' | 'load_created' | 'load_updated' | 'load_deleted' | 'system' | 'error';
  action: string;
  description: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  resourceType?: 'driver' | 'load' | 'system';
  resourceId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page?: number;
  limit?: number;
}

export interface GetLogsParams {
  limit?: number;
  offset?: number;
  type?: LogEntry['type'];
  severity?: LogEntry['severity'];
  startDate?: string;
  endDate?: string;
  search?: string;
}

/**
 * Get logs for the current carrier
 */
export async function getLogs(params: GetLogsParams = {}): Promise<LogsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());
  if (params.type) queryParams.append('type', params.type);
  if (params.severity) queryParams.append('severity', params.severity);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/logs${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse<LogsResponse>(response);
}
