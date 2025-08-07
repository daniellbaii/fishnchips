// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing', 
  READY: 'ready',
  COMPLETED: 'completed'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Order status display configuration
export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: '⏳ Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  [ORDER_STATUS.PREPARING]: {
    label: '👨‍🍳 Preparing', 
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  [ORDER_STATUS.READY]: {
    label: '✅ Ready',
    className: 'bg-green-100 text-green-800 border-green-200'  
  },
  [ORDER_STATUS.COMPLETED]: {
    label: '✅ Completed',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  }
} as const;

// API endpoints
export const API_ENDPOINTS = {
  ORDERS: '/api/orders',
  ANALYTICS: '/api/analytics', 
  INVENTORY: '/api/inventory',
  BUSINESS_HOURS: '/api/business-hours',
  RESTAURANT_STATUS: '/api/restaurant-status',
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_LOGOUT: '/api/admin/logout'
} as const;

// Timing constants
export const TIMING = {
  CART_ANIMATION_DELAY: 300,
  AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  TOKEN_EXPIRY: 2 * 60 * 60 * 1000, // 2 hours
  MAX_LOGIN_ATTEMPTS: 5
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  CART: 'fishandchips-cart',
  CUSTOMER_INFO: 'fishandchips-customer',
  ADMIN_TOKEN: 'admin-token'
} as const;

// Category IDs
export const CATEGORIES = {
  ALL: 'all',
  POPULAR: 'popular', 
  FISH: 'fish',
  SIDES: 'sides',
  SEAFOOD: 'seafood'
} as const;

// Tab names for admin panel
export const ADMIN_TABS = {
  ORDERS: 'orders',
  ANALYTICS: 'analytics', 
  INVENTORY: 'inventory',
  HOURS: 'hours'
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PHONE_LENGTH: 20,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254
} as const;

// Default values
export const DEFAULTS = {
  ADMIN_PASSWORD: 'admin123',
  JWT_SECRET: 'fallback-secret',
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_KEY: 'dummy-key-for-build',
  ORDERS_PER_PAGE: 50,
  ANALYTICS_DAYS: 7
} as const;