import { useRouter } from "expo-router";
import { use, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthProvider";

// THIS LOAD USER DATA
// IF NOT FOUND => LOGIN

export default function AppIndex() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [minload, setminload] = useState(false);
  const { USER_DATA_KEY, setUserRole } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDatacache = await AsyncStorage.getItem(USER_DATA_KEY);
        if (userDatacache) {
          const user = await JSON.parse(userDatacache);
          console.log("Loaded from cache: ", user.userData);
          setUserRole(user.userRole)
          router.replace("/(app)");
          return;
        } else {
          // No cache, go log in page
          console.log("No user in storage.");
        }
      } catch (error) {
        console.log("User fetching Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setminload(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 2.
  useEffect(() => {
    if (!isLoading && minload) {
      router.replace("/(auth)/LoginForm");
    }
  }, [isLoading, minload, router]);

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
