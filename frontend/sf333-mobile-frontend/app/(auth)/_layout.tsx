import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function AuthScreen() {
  return (
    <Stack screenOptions={{ headerShown: false}}>
      <Stack.Screen name="login" />
      {/* <Stack.Screen name="signup" /> */}
    </Stack>
  );
}
