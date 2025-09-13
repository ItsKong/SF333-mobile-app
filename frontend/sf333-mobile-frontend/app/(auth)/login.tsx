import { useAuth } from "@/contexts/AuthProvider";
import { useLoginAnimations } from "@/hooks/useLoginAnimations";
import { loginStyles } from "@/styles/login.style";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<string>("none");
  const { setUserRole } = useAuth();
  const [hasSelected, setHasSelected] = useState(false);
  const router = useRouter();

  //anime stuff
  const {
    animateToSelection,
    animateBack,
    fadeBackButton,
    fadeTextArea,
    fadeText,
    fadeButton,
    fadeButtonText,
  } = useLoginAnimations();

  const handleSelected = (role: string) => {
    animateToSelection(
      () => {
        setSelectedRole(role);
      },
      () => {
        setHasSelected(true);
      }
    );
  };

  const handleBackPress = () => {
    animateBack(
      () => null,
      () => {
        setHasSelected(false);
        setSelectedRole("none");
      }
    );
  };

  const handleConfirm = () => {
    setUserRole(selectedRole);
    router.replace("/(app)");
  };
  return (
    <View style={loginStyles.container}>
      <Animated.View
        style={[
          loginStyles.backButton,
          { transform: [{ translateX: fadeBackButton }] },
        ]}
      >
        {hasSelected ? (
          //show back button
          <Pressable
            onPress={() => {
              console.log("back"), handleBackPress();
            }}
          >
            <AntDesign name="left-circle" size={37} color="#5E6CA8" />
          </Pressable>
        ) : null}
      </Animated.View>

      <View>
        <Text style={loginStyles.header}>Fantastic</Text>
      </View>

      <View style={loginStyles.content}>
        <Text style={loginStyles.youre}>You are:</Text>
        {hasSelected ? (
          // 1st() show role & name input
          <>
            <View style={[loginStyles.button, { backgroundColor: "#A7C7E7" }]}> 
              <Animated.View style={{ opacity: fadeText }}>
                <Text style={loginStyles.text}>
                  {selectedRole === "caretaker" ? "Care taker" : "Care giver"}
                </Text>
              </Animated.View>
            </View>

            <View style={loginStyles.line} />

            <Animated.View style={{ opacity: fadeTextArea }}>
              <View style={[loginStyles.button, { marginTop: 10 }]}> 
                <Text>Your name:</Text>
                <TextInput style={loginStyles.nameInput} placeholder="name" />
                <Pressable
                  style={({ pressed }) => [
                    loginStyles.confirmbutt,
                    {
                      backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
                    },
                  ]}
                  onPress={handleConfirm}
                >
                  <Text>confirm</Text>
                </Pressable>
              </View>
            </Animated.View>
          </>
        ) : (
          // Initial state: show role selection buttons
          <>
            <Pressable
              style={({ pressed }) => [
                loginStyles.button,
                {
                  backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
                },
              ]}
              onPress={() => handleSelected("caretaker")}
            >
              <Animated.View style={{ opacity: fadeButtonText }}>
                <Text style={loginStyles.text}>Care taker</Text>
              </Animated.View>
            </Pressable>

            <View style={loginStyles.line} />

            <Animated.View style={[loginStyles.button, { opacity: fadeButton }]}> 
              <Pressable
                style={({ pressed }) => [
                  loginStyles.button,
                  {
                    backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
                  },
                ]}
                onPress={() => handleSelected("caregiver")}
              >
                <Text style={loginStyles.text}>Care giver</Text>
              </Pressable>
            </Animated.View>
          </>
        )}
      </View>
    </View>
  ) 
}

