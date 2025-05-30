import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { onAuthStateChange } from './src/services/firebase/authService';
import LoadingSpinner from './src/components/common/LoadingSpinner';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Initializing app..." />;
  }

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator user={user} />
    </>
  );
}