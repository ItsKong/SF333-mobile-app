import { Stack } from "expo-router";

export default function GiverLayout() {
  // stack of giver page group
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-task" />
    </Stack>
  );
}
