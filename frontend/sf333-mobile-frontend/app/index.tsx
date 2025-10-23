import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// THIS LOAD USER DATA
// IF NOT FOUND => LOGIN

export default function AppIndex() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDatacache = await AsyncStorage.getItem("user");
        if (userDatacache) {
          // const userString = await AsyncStorage.getItem('user');
          // const user = userString ? JSON.parse(userString) : null;
          console.log("Loaded from cache");
          // router.replace('/(app)')
          setIsLoading(false);
          return;
        }

        // No cache, Fetching
        console.log("Fetching fresh data");
        // const userData = await fetch('api');
        // if (userData) {
        // store in aynceStorage
        // await AsyncStorage.setItem('user', JSON.stringify({ username: 'John', userRole: 'caretaker' }));
        // }
        // router.replace('/(app)')
        setIsLoading(false);
      } catch (error) {
        console.log("User fetching Error: ", error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/LoginForm");
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/fantistic-high-resolution-logo-transparent.png")} // ใส่ path ของรูปโลโก้คุณ
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DBE8F5",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
