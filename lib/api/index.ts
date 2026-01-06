/**
 * API Module Exports
 * Central export for all API services
 */

// Configuration
export { API_BASE_URL, getAuthToken, getDefaultHeaders, handleResponse } from './config';

// Authentication
export {
  signUp,
  signIn,
  signOut,
  refreshToken,
  respondNewPassword,
  forgotPassword,
  confirmForgotPassword,
  isAuthenticated,
  getUserEmail,
  parseToken,
  type SignUpRequest,
  type SignUpResponse,
  type SignInRequest,
  type SignInResponse,
} from './auth';

// Drivers
export {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverStats,
  getDriverScore,
  type Driver,
  type DriverDetail,
  type CreateDriverRequest,
  type CreateDriverResponse,
} from './drivers';

// Loads
export {
  getLoads,
  getLoadById,
  createLoad,
  updateLoad,
  deleteLoad,
  getLoadsByDriver,
  type Load,
  type CreateLoadRequest,
  type LoadsResponse,
  type CreateLoadResponse,
} from './loads';

// CPS (Cargoos Performance Score)
export {
  // API Functions
  getDriverCPSScore,
  getDriverInfractions,
  getDriverScoreHistory,
  recalculateDriverScore,
  triggerMonthlyDecay,
  recalculateAllScores,
  getDriverWithCPS,
  // Helper Functions
  getTierInfo,
  getTierColorClasses,
  formatScore,
  getRecommendation,
  // Constants
  CPS_TIERS,
  CPS_WEIGHTS,
  DECAY_RATES,
  // Types
  type CPSScore,
  type CPSBreakdown,
  type CPSBreakdownComponent,
  type CPSStats,
  type Infraction,
  type InfractionsResponse,
  type ScoreHistoryEntry,
  type ScoreHistoryResponse,
} from './cps';
