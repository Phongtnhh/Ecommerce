// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  FEATURED_PRODUCTS: '/products/featured',
  SEARCH_PRODUCTS: '/products/search',
  PRODUCT_REVIEWS: (id) => `/products/${id}/reviews`,
  RELATED_PRODUCTS: (id) => `/products/${id}/related`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  CATEGORY_TREE: '/categories/tree',
  POPULAR_CATEGORIES: '/categories/popular',

  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART_ITEM: (id) => `/cart/items/${id}`,
  REMOVE_FROM_CART: (id) => `/cart/items/${id}`,
  CLEAR_CART: '/cart/clear',

  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  CREATE_ORDER: '/orders',
  CANCEL_ORDER: (id) => `/orders/${id}/cancel`,

  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  USER_ORDERS: '/user/orders',
  USER_WISHLIST: '/user/wishlist',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_REPORTS: '/admin/reports'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.SHIPPING]: 'Đang giao hàng',
  [ORDER_STATUS.DELIVERED]: 'Đã giao hàng',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy',
  [ORDER_STATUS.REFUNDED]: 'Đã hoàn tiền'
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued'
};

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.ACTIVE]: 'Đang bán',
  [PRODUCT_STATUS.INACTIVE]: 'Ngừng bán',
  [PRODUCT_STATUS.OUT_OF_STOCK]: 'Hết hàng',
  [PRODUCT_STATUS.DISCONTINUED]: 'Ngừng kinh doanh'
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  E_WALLET: 'e_wallet'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: 'Thanh toán khi nhận hàng',
  [PAYMENT_METHODS.CREDIT_CARD]: 'Thẻ tín dụng',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
  [PAYMENT_METHODS.E_WALLET]: 'Ví điện tử'
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/csv', 'application/vnd.ms-excel']
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
  RECENT_SEARCHES: 'recentSearches',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  PASSWORD_MIN_LENGTH: 6,
  PRODUCT_NAME_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000
};

// Currency
export const CURRENCY = {
  SYMBOL: 'đ',
  CODE: 'VND',
  LOCALE: 'vi-VN'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  UNKNOWN_ERROR: 'Có lỗi xảy ra. Vui lòng thử lại.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  CREATE_SUCCESS: 'Tạo mới thành công!',
  UPLOAD_SUCCESS: 'Tải lên thành công!'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#007bff',
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40'
};

export default {
  API_ENDPOINTS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  PRODUCT_STATUS,
  PRODUCT_STATUS_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  USER_ROLES,
  PAGINATION,
  FILE_UPLOAD,
  STORAGE_KEYS,
  VALIDATION,
  CURRENCY,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  THEME_COLORS
};
