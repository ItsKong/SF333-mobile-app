import { use, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthProvider';

export default function AppIndex() {
  const { userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get the user role from wherever you stored it
    // const userRole = "caregiver"; // Replace with actual logic
    
    if (userRole === "caregiver") {
      router.replace('/(app)/giver');
    } else {
      router.replace('/(app)/taker');
    }
  }, []);

  // Show loading while redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}