import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { environment } from './environments/environment';
import HomeScreen from './home';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleRequestOtp = async () => {
    if (phone.length !== 11) {
      return Alert.alert('Error', 'Phone number must be 11 digits');
    }

    try {
      const response = await fetch(`${environment.apiUrl}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      if (response.ok) {
        router.push({ pathname: '/verify', params: { phone } });
      } else {
        Alert.alert('Error', 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  return (
      <HomeScreen />
  );
}
