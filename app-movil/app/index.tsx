import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import AppNavigator from '@/components/navigation/AppNavigator';


export default function App() {
  return (
    <AuthProvider>
        <AppNavigator />
    </AuthProvider>
  );
}