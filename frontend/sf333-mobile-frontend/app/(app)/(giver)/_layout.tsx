import { Stack } from "expo-router";
import React from "react";
import { GiverProvider } from "@/contexts/GiverContexts";

export default function GiverLayout() {
  return (
    <GiverProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(giverTabs)" />
        <Stack.Screen name="modifyTask" />
      </Stack>
    </GiverProvider>
  );
}
