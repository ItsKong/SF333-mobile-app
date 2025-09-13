import { use, useEffect } from 'react';
import { View, Text , StyleSheet, Image, ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthProvider';

export default function AppIndex() {
  const { userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get the user role from wherever you stored it
    // const userRole = "caregiver"; // Replace with actual logic
    const timer = setTimeout(() => {
      if (userRole === "caregiver") {
        router.replace('/(app)/giver');
      } else {
        router.replace('/(app)/taker');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while redirecting
  return (
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/fantistic-high-resolution-logo-transparent.png')} // ใส่ path ของรูปโลโก้คุณ
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DBE8F5', 
  },
  logo: {
    width: 200,
    height: 200,
  },
});