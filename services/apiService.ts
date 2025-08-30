import { api, authenticatedFetch } from './apiClient';

// Types for better type safety
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  svgImage: string;
}

export interface OrderDetails {
  orderId: string;
  name: string;
  address: string;
  mobileNumber: string;
  paymentMethod: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: number;
  orderDate: string;
}

export interface OrderHistory {
  orderId: string;
  orderDate: string;
  orderStatus: string;
  orderTotal: string;
}

// Product APIs
export const productApi = {
  getAll: () => api.get<Product[]>('/api/product'),
  getById: (id: string) => api.get<Product>(`/api/product/${id}`),
};

// Order APIs
export const orderApi = {
  create: (orderData: Omit<OrderDetails, 'orderId' | 'orderDate'>) =>
    api.post('/api/order/add', orderData),
  
  getHistory: () => api.get<OrderHistory[]>('/api/order-history/all'),
  
  getById: (id: string) => api.get<OrderDetails>(`/api/order-history/${id}`),
};

// Auth APIs (using the existing authApi.ts)
export { requestOtp, verifyOtp } from './authApi';

// Legacy fetch methods for backward compatibility
export const legacyApi = {
  // Product endpoints
  fetchProducts: () => authenticatedFetch('/api/product'),
  
  // Order endpoints
  placeOrder: (orderData: any) => authenticatedFetch('/api/order/add', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getOrderHistory: () => authenticatedFetch('/api/order-history/all'),
  
  getOrderDetails: (id: string) => authenticatedFetch(`/api/order-history/${id}`),
  
  // Auth endpoints (these don't need auth token)
  requestOtp: (phoneNumber: string) => fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5266'}/api/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  }),
  
  verifyOtp: (phoneNumber: string, otp: string) => fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5266'}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, Otp: otp }),
  }),
}; 