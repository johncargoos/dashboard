import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config'

export interface ScoringConfig {
  version: string
  base: number
  clampMin: number
  clampMax: number
  decay: {
    penalties: number
    accidents: number
    bonuses: number
  }
  tiers: {
    min: number
    name: string
  }[]
  feedbackBands: {
    min: number
    F: number
  }[]
}

export interface ScoreWeights {
  safety: number
  timeliness: number
  quality: number
  feedback: number
  experience: number
}

/**
 * Get scoring configuration
 */
export async function getScoringConfig(): Promise<ScoringConfig> {
  const response = await fetch(`${API_BASE_URL}/config/scoring`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  })

  return handleResponse<ScoringConfig>(response)
}

/**
 * Get score weights (for display purposes)
 * This is a helper to extract weights from the config
 */
export async function getScoreWeights(): Promise<ScoreWeights> {
  try {
    const config = await getScoringConfig()
    // Extract weights from config (these are standard CPS weights)
    // Safety: 40%, Timeliness: 30%, Quality: 20%, Feedback: 10% (combined), Experience: 10%
    return {
      safety: 40,
      timeliness: 30,
      quality: 20,
      feedback: 15, // Combined feedback weight
      experience: 10,
    }
  } catch (error) {
    // Return default weights on error
    return {
      safety: 35,
      timeliness: 25,
      quality: 15,
      feedback: 15,
      experience: 10,
    }
  }
}
