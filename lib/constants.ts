// ============================================
// CONSTANTS - Central configuration
// ============================================

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'MarketHub',
  DESCRIPTION: 'Your trusted multi-vendor marketplace',
  LOGO: '/logo.png',
  DEFAULT_PAGE_SIZE: 12,
  MAX_CART_QUANTITY: 99,
} as const;

// User Roles
export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  SELLER: 'seller',
  CUSTOMER: 'customer',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Product Sort Options
export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
] as const;

// Filter Options
export const PRICE_RANGES = [
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $25', min: 10, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500+', min: 500, max: 999999 },
] as const;

export const RATING_OPTIONS = [
  { label: '5 Stars', value: 5 },
  { label: '4 Stars & Up', value: 4 },
  { label: '3 Stars & Up', value: 3 },
  { label: '2 Stars & Up', value: 2 },
  { label: 'Any Rating', value: 1 },
] as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  CUSTOMER_DASHBOARD: '/dashboard/customer',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Seller routes
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_ORDERS: '/seller/orders',
  SELLER_ANALYTICS: '/seller/analytics',
} as const;

// Navigation Items
export const NAV_ITEMS = {
  PUBLIC: [
    { label: 'Products', href: ROUTES.PRODUCTS },
    { label: 'Categories', href: `${ROUTES.PRODUCTS}?view=categories` },
    { label: 'Deals', href: `${ROUTES.PRODUCTS}?discount=25` },
  ],
  CUSTOMER: [
    { label: 'My Orders', href: ROUTES.ORDERS },
    { label: 'My Profile', href: ROUTES.PROFILE },
    { label: 'Dashboard', href: ROUTES.CUSTOMER_DASHBOARD },
  ],
  SELLER: [
    { label: 'Dashboard', href: ROUTES.SELLER_DASHBOARD },
    { label: 'My Products', href: ROUTES.SELLER_PRODUCTS },
    { label: 'Orders', href: ROUTES.SELLER_ORDERS },
    { label: 'Analytics', href: ROUTES.SELLER_ANALYTICS },
  ],
  ADMIN: [
    { label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD },
    { label: 'Products', href: ROUTES.ADMIN_PRODUCTS },
    { label: 'Orders', href: ROUTES.ADMIN_ORDERS },
    { label: 'Users', href: ROUTES.ADMIN_USERS },
    { label: 'Analytics', href: ROUTES.ADMIN_ANALYTICS },
  ],
} as const;

// Status Badge Colors
export const STATUS_COLORS = {
  ORDER: {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  PAYMENT: {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  STOCK: {
    in_stock: 'bg-green-100 text-green-800 border-green-200',
    low_stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    out_of_stock: 'bg-red-100 text-red-800 border-red-200',
  },
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_PATTERN: /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  POSTAL_CODE_PATTERN: /^[0-9]{5}(-[0-9]{4})?$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  LOGOUT: 'Logged out successfully.',
  REGISTER: 'Account created successfully!',
  CART_ADD: 'Added to cart successfully.',
  CART_UPDATE: 'Cart updated successfully.',
  CART_REMOVE: 'Item removed from cart.',
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully.',
  PROFILE_UPDATE: 'Profile updated successfully.',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  PAGE_SIZES: [12, 24, 48, 96],
  DEFAULT_PAGE_SIZE: 12,
} as const;

// Image Placeholders
export const PLACEHOLDERS = {
  PRODUCT_IMAGE: '/placeholder-product.png',
  USER_AVATAR: '/placeholder-avatar.png',
  NO_IMAGE: '/no-image.png',
} as const;

// Contact Information
export const CONTACT = {
  EMAIL: 'support@markethub.com',
  PHONE: '+1 (555) 123-4567',
  ADDRESS: '123 Market Street, San Francisco, CA 94103',
  SUPPORT_HOURS: 'Mon-Fri: 9AM-6PM PST',
} as const;

// Social Media
export const SOCIAL = {
  FACEBOOK: 'https://facebook.com/markethub',
  TWITTER: 'https://twitter.com/markethub',
  INSTAGRAM: 'https://instagram.com/markethub',
  LINKEDIN: 'https://linkedin.com/company/markethub',
} as const;

// Feature Flags
export const FEATURES = {
  WISHLIST_ENABLED: false,
  REVIEWS_ENABLED: true,
  LIVE_CHAT_ENABLED: false,
  NOTIFICATIONS_ENABLED: true,
  ANALYTICS_ENABLED: true,
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
