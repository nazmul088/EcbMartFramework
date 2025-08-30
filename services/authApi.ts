import { api } from './apiClient';

const BASE_URL = '/api/auth';

export const requestOtp = (phoneNumber: string) =>
  api.post(`${BASE_URL}/request-otp`, { phoneNumber });

export const verifyOtp = (phoneNumber: string, otp: string) =>
  api.post(`${BASE_URL}/verify-otp`, { phoneNumber, otp });
