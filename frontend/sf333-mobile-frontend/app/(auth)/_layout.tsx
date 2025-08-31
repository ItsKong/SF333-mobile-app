import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function AuthScreen() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }}/>
      {/* <Stack.Screen name="signup" /> */}
    </Stack>
  );
}
