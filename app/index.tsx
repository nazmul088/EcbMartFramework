import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import { environment } from './environments/environment';

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
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Enter 11-digit phone number"
        keyboardType="number-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={11}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <Button title="Request OTP" onPress={handleRequestOtp} />
    </View>
  );
}
