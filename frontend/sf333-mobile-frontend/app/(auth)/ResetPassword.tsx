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
  const [OTP, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmpass] = useState("");
  const { setShowBackButton, setOnBackPress } = useLoginLayout();
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

  const handleConfirm = () => {
    // if password match -> send through api
    if (newPassword === confirmPass) {
      // if send form correct -> back to login page
      const formData = { newPassword };
      const apiStatus = true; // return status from backend
      if (apiStatus) {
        // update success
        Alert.alert(
          "Password reset success",
          "Password has been change.",
          [
            {
              text: "OK",
              onPress: () => {
                console.log("OK");
                console.log(formData);
                setShowBackButton(false);
                router.dismissAll();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // update fail
        Alert.alert(
          "Password reset failed",
          "Something wrong.",
          [
            {
              text: "OK",
              onPress: () => {
                console.log("OK");
                console.log(formData);
                router.dismissAll();
              },
            },
          ],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        "Password not match",
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
        <Text>Please enter your new password:</Text>

        <TextInput
          style={loginStyles.loginForm}
          placeholder="New password"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={loginStyles.loginForm}
          placeholder="Confirm password"
          value={confirmPass}
          onChangeText={setConfirmpass}
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
