import { Stack } from "expo-router";
import { TakerProvider } from "@/contexts/TakerContexts";

export default function AppLayout() {
  return (
    <TakerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(giver)" />
        <Stack.Screen name="(taker)" />
      </Stack>
    </TakerProvider>
  );
}
