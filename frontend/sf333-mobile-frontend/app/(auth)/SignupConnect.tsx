import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { loginStyles } from "@/styles/login.style";
import { useAuth } from "@/contexts/AuthProvider";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useLoginLayout } from "@/contexts/LoginLayoutProvider";

export default function SignupConnect() {
  const { userRole } = useAuth();
  const { setOnBackPress, setShowBackButton } = useLoginLayout();
  const isSupervisor = userRole === "caregiver";
  useFocusEffect(
    useCallback(() => {
      setOnBackPress(() => {
        console.log("Back!");
        //animation goes here!
        setShowBackButton(true);
        router.back();
      });
      return () => {
        setOnBackPress(() => undefined);
      };
    }, [])
  );
  const handleConnect = () => {
    router.replace("/(app)");
  };
  return (
    <Animated.View style={[loginStyles.content, { opacity: 1 }]}>
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
            <Text>{"Random code here!"}</Text>
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
}
