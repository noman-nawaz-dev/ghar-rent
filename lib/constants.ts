// Activity System Constants
export const ACTIVITY_CONSTANTS = {
  // Maximum number of activities to keep per user
  MAX_ACTIVITIES_PER_USER: 10,
  
  // Number of recent activities to display in dashboard
  RECENT_ACTIVITIES_DISPLAY_COUNT: 3,
} as const

// Property Constants
export const PROPERTY_CONSTANTS = {
  MIN_PRICE: 0,
  MAX_IMAGES: 10,
} as const

// Rental Request Constants
export const RENTAL_REQUEST_CONSTANTS = {
  MIN_DURATION: 1,
  MAX_DURATION: 36, // 3 years
} as const
