import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config';

/**
 * CPS (Cargoos Performance Score) API Service
 * 
 * Formula: CPS = (Safety × 40%) + (Punctuality × 30%) + (Quality × 20%) + (Experience × 10%)
 * Score Range: 0-100 (percentage-based)
 */

// ===========================
// TYPES & INTERFACES
// ===========================

export interface CPSBreakdownComponent {
  raw: number;       // Raw percentage (0-100)
  weighted: number;  // After weight applied (e.g., 40 for safety at 100%)
  weight: number;    // Weight factor (e.g., 0.40 for safety)
  months?: number;   // Only for experience component
}

export interface CPSBreakdown {
  safety: CPSBreakdownComponent;
  punctuality: CPSBreakdownComponent;
  quality: CPSBreakdownComponent;
  experience: CPSBreakdownComponent;
}

export interface CPSScore {
  finalScore: number;        // 0-100
  tier: string;              // 'Exceptional' | 'Very Good' | 'Good' | 'Fair' | 'High Risk'
  tierColor: string;         // 'green' | 'yellow' | 'orange' | 'red'
  breakdown: CPSBreakdown;
  decayAdjustment: number;   // Points added/removed due to time decay
  baseCPS: number;           // Score before decay adjustment
  formulaVersion: string;    // '2.0'
  calculatedAt?: string;
  isNewDriver?: boolean;
  stats?: CPSStats;
  infractionsCount?: number;
}

export interface CPSStats {
  accidentFreeTrips: number;      // Percentage (0-100)
  onTimeDeliveries: number;       // Percentage (0-100)
  damageFreeDeliveries: number;   // Percentage (0-100)
  experienceMonths: number;
  totalDeliveries: number;
  totalMileage: number;
  avgRating: number;
}

export interface Infraction {
  _id: string;
  driverId: string;
  tripId?: string;
  type: 'minor_delay' | 'major_delay' | 'minor_accident' | 'major_incident' | 'complaint' | 'bonus';
  category: 'penalty' | 'bonus';
  originalPoints: number;
  currentPoints: number;
  decayRate: number;
  decayMonths: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  lastDecayAt: string;
  monthsSinceCreated?: number;
  decayApplied?: number;         // Percentage of decay applied
}

export interface InfractionsResponse {
  infractions: Infraction[];
  activeCount: number;
  totalPenalties: number;
  totalBonuses: number;
}

export interface ScoreHistoryEntry {
  _id: string;
  driverId: string;
  tripId?: string;
  trigger: 'trip_complete' | 'manual_recalculate' | 'monthly_decay';
  score: number;
  tier: string;
  breakdown: CPSBreakdown;
  stats: CPSStats;
  infractionsApplied?: number;
  createdAt: string;
  formulaVersion: string;
}

export interface ScoreHistoryResponse {
  history: ScoreHistoryEntry[];
  count: number;
}

// ===========================
// TIER CONFIGURATION
// ===========================

export const CPS_TIERS = [
  { min: 80, max: 100, name: 'Exceptional', color: 'green', bgColor: 'bg-green-500', textColor: 'text-green-500' },
  { min: 74, max: 79.99, name: 'Very Good', color: 'green', bgColor: 'bg-green-400', textColor: 'text-green-400' },
  { min: 67, max: 73.99, name: 'Good', color: 'yellow', bgColor: 'bg-yellow-500', textColor: 'text-yellow-500' },
  { min: 58, max: 66.99, name: 'Fair', color: 'orange', bgColor: 'bg-orange-500', textColor: 'text-orange-500' },
  { min: 0, max: 57.99, name: 'High Risk', color: 'red', bgColor: 'bg-red-500', textColor: 'text-red-500' },
];

export const CPS_WEIGHTS = {
  safety: { weight: 0.40, label: 'Safety', description: 'Accident-free trips percentage' },
  punctuality: { weight: 0.30, label: 'Punctuality', description: 'On-time deliveries percentage' },
  quality: { weight: 0.20, label: 'Quality', description: 'Damage-free deliveries percentage' },
  experience: { weight: 0.10, label: 'Experience', description: 'Months of driving experience (12 months = 100%)' },
};

export const DECAY_RATES = {
  regular: { rate: 0.80, label: '20% per month', description: 'Minor delays, complaints' },
  accident: { rate: 0.90, label: '10% per month', description: 'Accidents (slower decay)' },
  bonus: { rate: 0.70, label: '30% per month', description: 'Bonuses (faster decay)' },
};

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Get tier info based on score
 */
export function getTierInfo(score: number) {
  for (const tier of CPS_TIERS) {
    if (score >= tier.min && score <= tier.max) {
      return tier;
    }
  }
  return CPS_TIERS[CPS_TIERS.length - 1]; // Default to High Risk
}

/**
 * Get tier color classes for Tailwind
 */
export function getTierColorClasses(tier: string): { bg: string; text: string; border: string } {
  switch (tier.toLowerCase()) {
    case 'exceptional':
      return { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' };
    case 'very good':
      return { bg: 'bg-green-400', text: 'text-green-400', border: 'border-green-400' };
    case 'good':
      return { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' };
    case 'fair':
      return { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' };
    case 'high risk':
    default:
      return { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500' };
  }
}

/**
 * Format score as percentage string
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Get recommendation based on tier
 */
export function getRecommendation(tier: string): { message: string; action: string } {
  switch (tier.toLowerCase()) {
    case 'exceptional':
      return { message: 'Maintain top performance!', action: 'Consider leadership/training roles' };
    case 'very good':
      return { message: 'Keep up the great work!', action: 'Aim for 100% on-time and accident-free deliveries' };
    case 'good':
      return { message: 'Consistent performance!', action: 'Improve minor delays and maintain safety' };
    case 'fair':
      return { message: 'Focus on improvement!', action: 'Focus on reducing delays and improving safety' };
    case 'high risk':
    default:
      return { message: 'Urgent improvement needed!', action: 'Improve punctuality, safety, and quality immediately' };
  }
}

// ===========================
// API FUNCTIONS
// ===========================

/**
 * Get driver's CPS score with full breakdown
 */
export async function getDriverCPSScore(driverId: string): Promise<CPSScore> {
  const encodedId = encodeURIComponent(driverId);
  const response = await fetch(`${API_BASE_URL}/drivers/${encodedId}/score`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse<CPSScore>(response);
}

/**
 * Get driver's infractions (penalties and bonuses)
 */
export async function getDriverInfractions(driverId: string): Promise<InfractionsResponse> {
  const encodedId = encodeURIComponent(driverId);
  const response = await fetch(`${API_BASE_URL}/drivers/${encodedId}/infractions`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse<InfractionsResponse>(response);
}

/**
 * Get driver's score history
 */
export async function getDriverScoreHistory(driverId: string): Promise<ScoreHistoryResponse> {
  const encodedId = encodeURIComponent(driverId);
  const response = await fetch(`${API_BASE_URL}/drivers/${encodedId}/score-history`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse<ScoreHistoryResponse>(response);
}

/**
 * Force recalculate driver's CPS score
 */
export async function recalculateDriverScore(driverId: string): Promise<{ message: string; score: CPSScore; stats: CPSStats }> {
  const encodedId = encodeURIComponent(driverId);
  const response = await fetch(`${API_BASE_URL}/drivers/${encodedId}/recalculate`, {
    method: 'POST',
    headers: getDefaultHeaders(),
  });

  return handleResponse(response);
}

/**
 * Trigger monthly decay for all infractions (admin only)
 */
export async function triggerMonthlyDecay(driverId?: string): Promise<{ message: string; updatedCount: number }> {
  const response = await fetch(`${API_BASE_URL}/scores/decay`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify({ driverId }),
  });

  return handleResponse(response);
}

/**
 * Recalculate all driver scores (admin only)
 */
export async function recalculateAllScores(): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/scores/recalculate`, {
    method: 'POST',
    headers: getDefaultHeaders(),
  });

  return handleResponse(response);
}

/**
 * Get driver with full CPS data (score, stats, history, infractions)
 */
export async function getDriverWithCPS(driverId: string): Promise<{
  driver: any;
  score: CPSScore;
  stats: CPSStats;
  infractions: Infraction[];
  scoreHistory: ScoreHistoryEntry[];
}> {
  const encodedId = encodeURIComponent(driverId);
  const response = await fetch(`${API_BASE_URL}/drivers/${encodedId}`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return handleResponse(response);
}

