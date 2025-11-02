import { SplashScreen, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthProvider";


export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    Inconsolata_Light: require('@/assets/fonts/Inconsolata_Expanded-Light.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)"  />
      </Stack>
    </AuthProvider>
  );
}
