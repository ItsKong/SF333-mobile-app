import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { loginStyles } from "@/styles/login.style";
import { useEffect, useState } from "react";
import { useLoginLayout } from "@/contexts/LoginLayoutProvider";
import { useRouter } from "expo-router";


export default function LoginForm () {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const {setShowBackButton} = useLoginLayout();

  const handleLogin = (state: string) => {
    if (state === "confirm") {
      console.log("confirm");
      null;
    }

    if (state === "create") {
      console.log("create");
      setShowBackButton(true);
      router.push('/(auth)/RoleSelection');
    }

    if (state === "forgot") {
      console.log("forgot");
      setShowBackButton(true);
      router.push('/(auth)/ForgotPassword');
    }
  };
  return (
    <View style={[loginStyles.selectRoleContent, { marginTop: 100 }]}>
      <Animated.View style={[loginStyles.loginContent, { opacity: 1 }]}>
        <TextInput
          style={loginStyles.loginForm}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={loginStyles.loginForm}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          style={({ pressed }) => [
            loginStyles.loginButton,
            { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
          ]}
          onPress={() => handleLogin("confirm")}
        >
          <Text style={loginStyles.text}>Confirm</Text>
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "150%",
            marginTop: 20,
            alignSelf: "center",
          }}
        >
          <Pressable onPress={() => handleLogin("create")}>
            <Text style={loginStyles.loginSideButtonText}>
              Create an Account
            </Text>
          </Pressable>
          <Pressable onPress={() => handleLogin("forgot")}>
            <Text style={loginStyles.loginSideButtonText}>
              Forgot Password?
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};
