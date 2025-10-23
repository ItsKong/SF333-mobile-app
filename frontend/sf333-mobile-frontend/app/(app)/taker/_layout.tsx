import { Stack } from "expo-router";
import { TakerProvider } from "@/contexts/TakerContexts";

export default function TakerLayout() {
  // stack of taker page group
  return (
    <TakerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="moodTracking" />
      </Stack>
    </TakerProvider>
  );
}
