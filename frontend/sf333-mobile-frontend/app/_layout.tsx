import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";



export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
  );
}
