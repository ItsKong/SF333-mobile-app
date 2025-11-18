import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthProvider";
import {
  requestUserPermission,
  getFCMToken,
  onBackgroundMessage,
  removeTokenFromBackend,
  sendTokenToBackend,
} from "@/hooks/useNotification";
import {
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

// THIS LOAD USER DATA
// IF NOT FOUND => LOGIN

// 👇 INITIALIZE INSTANCE
const messaging = getMessaging();

// 👇 MODULAR BACKGROUND HANDLER REGISTRATION
// Old: messaging().setBackgroundMessageHandler(...)
// New: setBackgroundMessageHandler(messaging, ...)
setBackgroundMessageHandler(messaging, onBackgroundMessage);

export default function AppIndex() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [minload, setminload] = useState(false);
  const { USER_DATA_KEY, setUserRole } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        let token = null;
        try {
          await requestUserPermission();
          token = await getFCMToken();
        } catch (e) {
          console.log("Firebase setup warning:", e);
        }

        const userDatacache = await AsyncStorage.getItem(USER_DATA_KEY);
        if (userDatacache) {
          const user = JSON.parse(userDatacache);

          // 👇 CRITICAL STEP: Send the token to the backend
          if (token && user?.docId) {
            // We don't await this because we don't want to block the user from entering the app
            sendTokenToBackend(user.docId, token);
          }

          setUserRole(user.userRole);
          router.replace("/(app)");
        } else {
          console.log("No user in storage.");
        }
      } catch (error) {
        console.log("Initialization Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 👇 MODULAR FOREGROUND LISTENER
    // Old: const unsubscribe = messaging().onMessage(...)
    // New: const unsubscribe = onMessage(messaging, ...)
    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification?.title || "New Message",
        remoteMessage.notification?.body || "You have a new notification"
      );
    });

    initializeApp();
    return unsubscribe;
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
