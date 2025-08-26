import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const isAuth = false;
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.replace("/signup");
    }
  });

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </RouteGuard>
  );
}
