import { useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import messaging from '@react-native-firebase/messaging';

const requestUserPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Noti permission granted");
    } else {
        console.log("Noti permission denied");
    }
}

const getToken = async() => {
    try {
        const token = await messaging().getToken();
        console.log('token', token)
    } catch (e) {
        console.log('Failed to get FCM Token: ', e);
    }
}

export const useNotification = () => {
    useEffect(() => {
        requestUserPermission();
        getToken;
    }, [])
}