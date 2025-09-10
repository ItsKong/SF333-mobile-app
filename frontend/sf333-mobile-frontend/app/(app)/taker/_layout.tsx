import { Stack } from "expo-router";

export default function TakerLayout() {
  // stack of taker page group
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
