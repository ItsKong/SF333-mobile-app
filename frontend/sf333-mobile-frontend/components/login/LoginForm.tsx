import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { loginStyles } from "@/styles/login.style";

interface LoginFormProps {
  fadeLoginContent: Animated.Value;
  name: string;
  setName: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onLogin: (state: string) => void;
}

export const LoginForm = ({
  fadeLoginContent,
  name,
  setName,
  password,
  setPassword,
  onLogin,
}: LoginFormProps) => (
  <View style={[loginStyles.selectRoleContent, { marginTop: 100 }]}>
    <Animated.View
      style={[loginStyles.loginContent, { opacity: fadeLoginContent }]}
    >
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
        onPress={() => onLogin("confirm")}
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
        <Pressable onPress={() => onLogin("create")}>
          <Text style={loginStyles.loginSideButtonText}>Create an Account</Text>
        </Pressable>
        <Pressable onPress={() => onLogin("forgot")}>
          <Text style={loginStyles.loginSideButtonText}>Forgot Password?</Text>
        </Pressable>
      </View>
    </Animated.View>
  </View>
);
