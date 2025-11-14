import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { removeTokenFromBackend } from '@/hooks/useNotification'; 

type AuthContextType = {
  userRole: string ;
  setUserRole: (role: string) => void;
  username: string;
  setUsername: (username: string) => void;
  USER_DATA_KEY: string;
  handleLogout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string >("none");
  const [username, setUsername] = useState<string >("none");
  const USER_DATA_KEY = '@USER_DATA'
  const handleLogout = async () => {
    try{
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            // Add your logout logic here
            const userdata = await AsyncStorage.getItem(USER_DATA_KEY);
            if (userdata) {
              const user = JSON.parse(userdata);

              if (user?.docId) {
                await removeTokenFromBackend(user?.docId);
              }
            }
            console.log("User logged out");
            await AsyncStorage.clear()
            router.replace('/(auth)/LoginForm');
            // Example: clear auth tokens, navigate to login, etc.
          },
        },
      ]);
    } catch (error) {
      console.log("Failed to logout: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, username, setUsername, USER_DATA_KEY, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}