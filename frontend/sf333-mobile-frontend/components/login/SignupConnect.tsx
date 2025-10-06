import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { loginStyles } from "@/styles/login.style";

interface SignupConnectProps {
  role: "caretaker" | "caregiver";
  connectCode: String | null;
  fadeConnectContent: Animated.Value;
  handleConnect: () => void;
}

export const SignupConnect = ({
  role,
  connectCode,
  fadeConnectContent,
  handleConnect,
}: SignupConnectProps) => {
  const isSupervisor = role === "caregiver";
  return (
    <Animated.View
      style={[loginStyles.content, { opacity: fadeConnectContent }]}
    >
      <Text>
        {isSupervisor
          ? "Please connect Your "
          : "Please give your code to your "}
        <Text style={{ fontWeight: "bold" }}>
          {isSupervisor ? "Supervisee" : "Supervisor"}
        </Text>
      </Text>
      {isSupervisor ? (
        <>
          <TextInput style={loginStyles.formInput} placeholder="connect code" />
          <View>
            <Pressable
              style={({ pressed }) => [
                loginStyles.confirmbutt,
                {
                  backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
                },
              ]}
              onPress={handleConnect}
            >
              <Text>connect</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <View style={loginStyles.formInput}>
            <Text>{"connect code here!"}</Text>
          </View>
          <View>
            <Pressable
              style={({ pressed }) => [
                loginStyles.confirmbutt,
                {
                  backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
                },
              ]}
              onPress={handleConnect}
            >
              <Text>connect</Text>
            </Pressable>
          </View>
        </>
      )}
    </Animated.View>
  );
};
