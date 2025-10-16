import { Stack } from "expo-router";
import { LoginLayout } from "@/components/login/LoginLayout";
import { LoginLayoutProvider } from "@/contexts/LoginLayoutProvider";
import { SignUpFormLayout } from "@/components/login/SignUpFormLayout";

export default function AuthLayout() {
  return (
    <LoginLayoutProvider>
      <LoginLayout>
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="LoginForm" />
          <Stack.Screen name="RoleSelection" />
          <Stack.Screen name="SignupForm" />
          <Stack.Screen name="SignupConnect" />
          <Stack.Screen name="ForgotPassword" />
          <Stack.Screen name="EnterOTP" />
          <Stack.Screen name="ResetPassword" />
        </Stack>
      </LoginLayout>
    </LoginLayoutProvider>
  );
}
