import { Stack } from "expo-router";

export default function TakerLayout() {
  // stack of taker page group
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="noti" />
    </Stack>
  );
}
