import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { loginStyles } from "@/styles/login.style";
import { useCallback, useEffect, useState } from "react";
import { useLoginLayout } from "@/contexts/LoginLayoutProvider";
import { useFocusEffect, useRouter } from "expo-router";

export default function ForgotPassword() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const { setShowBackButton, setOnBackPress } = useLoginLayout();
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

  const handleConfirm = () => {
    // if phone number is in database send OTP otherwise ERROR
    if (phoneNumber) {
      router.push("/(auth)/EnterOTP");
    } else {
      Alert.alert(
        "Phone number not found.",
        "Please try again.",
        [
          {
            text: "Ok",
            onPress: () => console.log("cancel Pressed"),
          },
        ],
        { cancelable: false }
      );
    }
  };
  return (
    <View style={[loginStyles.selectRoleContent, { marginTop: 100 }]}>
      <Animated.View style={[loginStyles.loginContent, { opacity: 1 }]}>
        <Text>Please enter your phone number:</Text>

        <TextInput
          style={loginStyles.loginForm}
          placeholder="Phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <Pressable
          style={({ pressed }) => [
            loginStyles.loginButton,
            { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
          ]}
          onPress={() => handleConfirm()}
        >
          <Text style={loginStyles.text}>Confirm</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
