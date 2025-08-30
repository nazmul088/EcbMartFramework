import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, View, ActivityIndicator } from 'react-native';
import { environment } from './environments/environment';
import HomeScreen from './home';
import { useAuth } from './AuthContext';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // If not authenticated, redirect to sign-in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/sign-in');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#32CCBC" />
      </View>
    );
  }

  // If authenticated, show home screen
  if (isAuthenticated) {
    return <HomeScreen />;
  }

  return null; // This will show briefly before redirect
}
