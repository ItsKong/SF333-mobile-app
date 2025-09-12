import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export default function AppIndex() {
  const router = useRouter();

  useEffect(() => {
    
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/fantistic-high-resolution-logo-transparent copy.png')} // ใส่ path ของรูปโลโก้คุณ
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
