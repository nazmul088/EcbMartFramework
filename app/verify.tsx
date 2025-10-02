import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import { environment } from './environments/environment';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(`${environment.apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, otp }),
      });

      if (response.ok) {
         const result = await response.json(); 
         await SecureStore.setItemAsync('authToken', result.token);
         
        router.replace('/home');
      } else {
        Alert.alert('Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Network error');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <Button title="Verify OTP" onPress={handleVerifyOtp} />
    </View>
  );
}
