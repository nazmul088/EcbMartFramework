# API Service Documentation

This document explains how to use the centralized API service that automatically handles authentication tokens.

## Overview

The API service provides a scalable way to make authenticated API requests throughout your app. It automatically:

- ✅ Includes authentication tokens in all requests
- ✅ Handles 401/403 errors and redirects to login
- ✅ Provides both axios and fetch-based options
- ✅ Includes TypeScript types for better development experience

## Architecture

### Files Structure
```
services/
├── apiClient.ts      # Core axios instance with interceptors
├── apiService.ts     # Organized API endpoints with types
├── authService.ts    # Token storage utilities
└── authApi.ts        # Authentication-specific endpoints
```

## Usage Examples

### 1. Using the Modern API Service (Recommended)

```typescript
import { productApi, orderApi } from '../services/apiService';

// Get all products
const products = await productApi.getAll();

// Create an order
const orderData = {
  name: 'John Doe',
  address: '123 Main St',
  mobileNumber: '+8801234567890',
  paymentMethod: 'card',
  items: [{ productId: '1', quantity: 2, price: 100 }],
  total: 200
};
await orderApi.create(orderData);

// Get order history
const history = await orderApi.getHistory();
```

### 2. Using the Legacy Fetch Wrapper

```typescript
import { legacyApi } from '../services/apiService';

// Fetch products
const response = await legacyApi.fetchProducts();
const products = await response.json();

// Place order
const orderResponse = await legacyApi.placeOrder(orderData);
```

### 3. Direct API Client Usage

```typescript
import { api } from '../services/apiClient';

// Custom API calls
const response = await api.get('/api/custom-endpoint');
const data = await api.post('/api/custom-endpoint', { data: 'value' });
```

## Authentication Flow

1. **Token Storage**: After OTP verification, the token is stored using `storeToken()`
2. **Automatic Injection**: All API requests automatically include the token in the Authorization header
3. **Error Handling**: 401 errors automatically clear the token and redirect to login
4. **Token Retrieval**: Use `getToken()` to get the current token for custom logic

## API Endpoints

### Products
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get product by ID

### Orders
- `POST /api/order/add` - Create new order
- `GET /api/order-history/all` - Get order history
- `GET /api/order-history/:id` - Get order details

### Authentication
- `POST /api/auth/request-otp` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP

## Error Handling

The API client automatically handles:
- **401 Unauthorized**: Clears token and redirects to login
- **403 Forbidden**: Logs error for debugging
- **Network Errors**: Proper error propagation

## Migration Guide

### From Direct Fetch Calls

**Before:**
```typescript
const response = await fetch(`${environment.apiUrl}/api/product`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**After:**
```typescript
const response = await productApi.getAll();
```

### From Direct Axios Calls

**Before:**
```typescript
const response = await axios.get(`${environment.apiUrl}/api/product`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**After:**
```typescript
const response = await productApi.getAll();
```

## Best Practices

1. **Use TypeScript**: All API methods include proper TypeScript types
2. **Error Handling**: Always wrap API calls in try-catch blocks
3. **Loading States**: Use loading states for better UX
4. **Consistent Naming**: Follow the established naming conventions

## Adding New Endpoints

To add a new endpoint:

1. **Add to apiService.ts**:
```typescript
export const newApi = {
  getData: () => api.get<DataType>('/api/new-endpoint'),
  createData: (data: CreateDataType) => api.post('/api/new-endpoint', data),
};
```

2. **Add types**:
```typescript
export interface DataType {
  id: string;
  name: string;
  // ... other properties
}
```

3. **Use in components**:
```typescript
const data = await newApi.getData();
```

## Troubleshooting

### Common Issues

1. **Token not being sent**: Ensure the token is properly stored using `storeToken()`
2. **401 errors**: Check if the token is valid and not expired
3. **CORS issues**: Ensure your backend allows requests from your app's domain

### Debug Mode

Enable debug logging by adding this to your app:
```typescript
// In your app initialization
console.log('Current token:', await getToken());
```

## Security Notes

- Tokens are stored securely in AsyncStorage
- All requests include proper error handling
- 401 responses automatically clear invalid tokens
- No sensitive data is logged in production 