// src/hooks/useNotification.js
import {
  getMessaging,
  getToken,
  requestPermission,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

// 1. Get the Messaging Instance
const messaging = getMessaging();

// 2. Request Permission
export async function requestUserPermission() {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Android Notification Permission granted");
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    // MODULAR SYNTAX CHANGE HERE:
    // Old: await messaging().requestPermission();
    // New: await requestPermission(messaging);
    const authStatus = await requestPermission(messaging);

    // Note: authStatus is likely an Enum number now, so check docs if boolean logic breaks,
    // but usually standard 1/2/3 checks work or checking if > 0.
    console.log("Authorization status:", authStatus);
  }
}

// 3. Get Token
export async function getFCMToken() {
  try {
    // MODULAR SYNTAX CHANGE HERE:
    // Old: await messaging().getToken();
    // New: await getToken(messaging);
    const token = await getToken(messaging);
    console.log("🔥 YOUR FCM TOKEN:", token);
    return token;
  } catch (error) {
    console.error("Failed to get token:", error);
  }
}

// 4. Background Handler
// (This logic usually stays simple, but we export the function for the main file to use)
export const onBackgroundMessage = async (remoteMessage: any) => {
  console.log("Message handled in the background!", remoteMessage);
};

// 5.Save token
export async function sendTokenToBackend(userId: string, token: string) {
  try {
    const API_URL = process.env.EXPO_PUBLIC_POST_SAVE_SOS_TOKEN as string;
    const dataform = {
      userId: userId,
      fcmToken: token,
    };

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataform),
    });

    const data = await response.json();
    console.log("Token saved to backend:", data);
  } catch (error) {
    console.error("Failed to send token to backend:", error);
  }
}

// 6.delete token
export async function removeTokenFromBackend(userId: any) {
  try {
    const API_URL = process.env.EXPO_PUBLIC_DELETE_SOS_TOKEN as string;
    await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    console.log("Token removed from backend for user:", userId);
  } catch (error) {
    console.error("Failed to remove token:", error);
  }
}
