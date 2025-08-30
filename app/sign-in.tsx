import CryptoJS from 'crypto-js';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { environment } from './environments/environment';
import { requestOtp } from '../services/authApi';
import { useAuth } from './AuthContext';

export default function SignInScreen() {
  const [mobile, setMobile] = useState('');
  const { isAuthenticated } = useAuth();
  // Use a secret key (keep it consistent in both files, but don't expose in public repos)
  const SECRET_KEY = 'your-very-secret-key';

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (mobile.length !== 10) {
      alert('Mobile number must be 10 digits after +880');
      return;
    }
    const fullMobile = '+880' + mobile;
    try {
      await requestOtp(fullMobile);
      alert('OTP sent successfully!');
      const encrypted = CryptoJS.AES.encrypt(fullMobile, SECRET_KEY).toString();
      router.push({ pathname: '/otp-screen', params: { token: encrypted } });
    } catch (error: any) {
      console.error('Request OTP error:', error);
      alert('Failed to send OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Login to <Text style={{ fontWeight: 'bold' }}>EcbMart</Text></Text>
        <Text style={styles.label}>Enter Mobile Number</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <View style={{
            backgroundColor: '#f3f3f3',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRightWidth: 1,
            borderRightColor: '#ddd',
          }}>
            <Text style={{ color: '#888', fontSize: 16 }}>+880</Text>
          </View>
          <TextInput
            style={[styles.input, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginBottom: 0 }]}
            placeholder="1XXXXXXXXX"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={mobile}
            onChangeText={text => setMobile(text.replace(/[^0-9]/g, '').slice(0, 10))}
            maxLength={10}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Send OTP</Text>
        </TouchableOpacity>
        {/* <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/verify')}>
            <Text style={styles.signupLink}> Sign up</Text>
          </TouchableOpacity>
        </View> */}
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
    marginBottom: 28,
    color: '#222',
  },
  label: {
    color: '#888',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    color: '#222',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  eyeIcon: {
    marginLeft: -36,
    padding: 8,
    zIndex: 1,
  },
  loginButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    marginBottom: 18,
  },
  googleButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    color: '#444',
    fontSize: 15,
  },
  signupLink: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
