import { environment } from '@/app/environments/environment';
import axios from 'axios';

const BASE_URL = `${environment.apiUrl}/api/auth`;

export const requestOtp = (phoneNumber: string) =>
  axios.post(`${BASE_URL}/request-otp`, { phoneNumber });

export const verifyOtp = (phoneNumber: string, otp: string) =>
  axios.post(`${BASE_URL}/verify-otp`, { phoneNumber, otp });
