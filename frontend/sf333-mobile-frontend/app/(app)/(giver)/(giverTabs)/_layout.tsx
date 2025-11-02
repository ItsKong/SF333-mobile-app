import { Tabs, useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GiverTabLayout() {
  const router = useRouter();
  // stack of giver page group
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
            console.log("User logged out");
            await AsyncStorage.clear()
            router.replace('/(auth)/LoginForm');
            // Example: clear auth tokens, navigate to login, etc.
          },
        },
      ]);
    } catch (error) {
      console.log("Error logout: ", error);
    }
  };
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "#5463a8ff" }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="tasks" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          tabBarLabel: "Logout",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="logout" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Tabs>
  );
}
