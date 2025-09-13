import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="giver" />
      <Stack.Screen name="taker" />
    </Stack>
  );
}

// export default function AppLayout() {
//   const { user } = useAuth();

//   // Conditionally render the correct homepage based on the user type
//   if (user && user.userType === 'admin') {
//     return <AdminHomeScreen />;
//   }

//   // Default to the regular user home screen
//   return <UserHomeScreen />;
// }
