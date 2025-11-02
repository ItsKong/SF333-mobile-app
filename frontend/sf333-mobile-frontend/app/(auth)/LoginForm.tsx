import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { loginStyles } from "@/styles/login.style";
import { useEffect, useState } from "react";
import { useLoginLayout } from "@/contexts/LoginLayoutProvider";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@/contexts/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { setShowBackButton } = useLoginLayout();
  const { setUserRole, USER_DATA_KEY } = useAuth();

  const handleLogin = async (state: string) => {
    if (state === "confirm") {
      console.log("confirm");
      if (!name || !password) {
        Alert.alert("Username or password missing.", "Please enter username and password");
      } else {
        const formdata = {username: name, password: password}
        console.log(formdata)
        try {
          const usernameResp = await fetch(
            process.env.EXPO_PUBLIC_POST_LOGIN as string,
            {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(formdata),
            }
          );

          const usernameData = await usernameResp.json();
          console.log("usernameData",usernameData.user)

          if (usernameResp.ok) {
            const docId = usernameData.token;
            console.log("Firestore document ID:", docId);
            console.log("usernameData", usernameData.user)

            await AsyncStorage.setItem(
              USER_DATA_KEY,
              JSON.stringify({
                userData: usernameData.user,
                userRole: usernameData.user.user_role,
              })
            );

            setUserRole(usernameData.user.user_role)
            router.replace('/(app)')

            // 3️⃣ Save it in state or localStorage for next screen
            // Example: router.push and pass params
          } else {
            console.log("Login error: ", usernameData);
          }
        } catch (error) {
          console.error("Error:", error);
          Alert.alert("Error", "Something went wrong. Please try again later.");
        }
      }
    }

    if (state === "create") {
      console.log("create");
      setShowBackButton(true);
      router.push("/(auth)/RoleSelection");
    }

    if (state === "forgot") {
      console.log("forgot");
      setShowBackButton(true);
      router.push("/(auth)/ForgotPassword");
    }
  };
  return (
    <View style={[loginStyles.selectRoleContent, { marginTop: 100 }]}>
      <Animated.View style={[loginStyles.loginContent, { opacity: 1 }]}>
        <TextInput
          style={loginStyles.loginForm}
          placeholder="Username"
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
}
