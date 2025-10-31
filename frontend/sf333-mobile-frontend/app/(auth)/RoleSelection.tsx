import { View, Text, Pressable, Animated } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { loginStyles } from "@/styles/login.style";
import { useLoginLayout } from "@/contexts/LoginLayoutProvider";
import { router, useFocusEffect } from "expo-router";

export default function RoleSelection() {
  // const [selectedRole, setSelectedRole] = useState<string>("none");
  const { setUserRole } = useAuth();
  // const [hasSelected, setHasSelected] = useState(false);
  const { setOnBackPress, setShowBackButton } = useLoginLayout();

  useFocusEffect(
    useCallback(() => {
      setOnBackPress(() => {
        console.log("Back!");
        //animation goes here!
        setShowBackButton(false);
        router.back();
      });
      return () => {
        setOnBackPress(() => undefined);
      };
    }, [])
  );

  const handleSelected = (role: string) => {
    //animation goes here!
    setUserRole(role);
    router.push("/(auth)/SignupForm");
    // setSelectedRole(role);
    // setHasSelected(true);
  };

  return (
    <View style={loginStyles.selectRoleContent}>
      <Animated.View style={[loginStyles.button, { opacity: 1 }]}>
        <Pressable
          style={({ pressed }) => [
            loginStyles.button,
            { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
          ]}
          onPress={() => handleSelected("caretaker")}
        >
          <Text style={loginStyles.text}>Individual with a disability</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={[loginStyles.line, { opacity: 1 }]} />

      <Animated.View style={[loginStyles.button, { opacity: 1 }]}>
        <Pressable
          style={({ pressed }) => [
            loginStyles.button,
            { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
          ]}
          onPress={() => handleSelected("caregiver")}
        >
          <Text style={loginStyles.text}>Supervisor</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
