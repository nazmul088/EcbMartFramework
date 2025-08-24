import CryptoJS from 'crypto-js';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { environment } from './environments/environment';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const params = useLocalSearchParams();
  const encrypted = params.token as string || '';
  let mobile = '';
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, 'your-very-secret-key');
    mobile = bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    // handle error if needed
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert('OTP must be 6 digits');
      return;
    }
    try {
      const response = await fetch(`${environment.apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: mobile, Otp: otp }),
      });
      if (response.ok) {
        alert('OTP Verified!');
        // Optionally navigate to the next screen here
      } else {
        alert('Invalid OTP.');
      }
    } catch (error) {
      alert('Network error.');
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    try {
      const response = await fetch(`${environment.apiUrl}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: mobile }),
      });
      if (response.ok) {
        alert('OTP resent!');
      } else {
        alert('Failed to resend OTP.');
      }
    } catch (error) {
      alert('Network error.');
    }
    setTimeout(() => setResendDisabled(false), 30000); // 30s cooldown
  };

  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.label}>A 6-digit code has been sent to your mobile number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          value={otp}
          onChangeText={text => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
          maxLength={6}
        />
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resendRow}
          onPress={handleResend}
          disabled={resendDisabled}
        >
          <Text style={[styles.resendText, resendDisabled && { color: '#aaa' }]}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 32,
    width: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 26,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 18,
    color: '#222',
  },
  label: {
    color: '#888',
    fontSize: 16,
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    marginBottom: 18,
    color: '#222',
    letterSpacing: 8,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  resendText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
