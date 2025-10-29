import iconSet from "@expo/vector-icons/build/Fontisto";
import { Stack, Tabs } from "expo-router";

export default function GiverTabLayout() {
  // stack of giver page group
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="dashboard" />
    </Tabs>
  );
}
