// src/hooks/useNotification.js
import { 
  getMessaging, 
  getToken, 
  requestPermission 
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

// 1. Get the Messaging Instance
const messaging = getMessaging();

// 2. Request Permission
export async function requestUserPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Android Notification Permission granted');
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
    console.log('Authorization status:', authStatus);
  }
}

// 3. Get Token
export async function getFCMToken() {
  try {
    // MODULAR SYNTAX CHANGE HERE:
    // Old: await messaging().getToken();
    // New: await getToken(messaging);
    const token = await getToken(messaging);
    console.log('🔥 YOUR FCM TOKEN:', token);
    return token;
  } catch (error) {
    console.error('Failed to get token:', error);
  }
}

// 4. Background Handler
// (This logic usually stays simple, but we export the function for the main file to use)
export const onBackgroundMessage = async (remoteMessage: any) => {
  console.log('Message handled in the background!', remoteMessage);
};