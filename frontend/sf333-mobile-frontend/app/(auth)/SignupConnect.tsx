import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { loginStyles } from "@/styles/login.style";
import { useAuth } from "@/contexts/AuthProvider";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useLoginLayout } from "@/contexts/LoginLayoutProvider";
import * as Clipboard from "expo-clipboard";

export default function SignupConnect() {
  const { userRole } = useAuth();
  const [link_id, setLink_id] = useState("");
  const { setOnBackPress, setShowBackButton } = useLoginLayout();

  // ✅ Get docId from route.params
  const { docId } = useLocalSearchParams();
  console.log("Firestore document ID from signup:", docId);

  const isSupervisor = userRole === "caregiver";

  const copyToClipboard = async (textToCopy: string) => {
    // Use setStringAsync from expo-clipboard
    await Clipboard.setStringAsync(textToCopy);
    // Optional: Provide feedback to the user
    Alert.alert(
      "Copied!",
      `"${textToCopy}" has been copied to your clipboard.`
    );
  };

  useFocusEffect(
    useCallback(() => {
      setOnBackPress(() => {
        console.log("Back!");
        setShowBackButton(true);
        router.back();
      });
      return () => {
        setOnBackPress(() => undefined);
      };
    }, [])
  );

  const handleContinue = () => {
    Alert.alert(
      "Connected?",
      "Please make sure you and your supervisor is connected.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            router.replace("/(app)");
          },
        },
      ]
    );
  };

  const handleConnect = async () => {
    try {
      const body = { linked_to: link_id };
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_PUT_LINKED_TO}/${docId}/link`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const reqdata = await req.json();
      console.log("server response: ", reqdata);
      if (reqdata.success) {
        console.log("Link Success");
        router.replace("/(app)");
      } else {
        console.log("Link Error: ", reqdata.error);
      }
    } catch (e) {
      console.log("Connect page Error: ", e);
    }
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
          <TextInput
            style={loginStyles.formInput}
            placeholder="link code"
            value={link_id}
            onChangeText={setLink_id}
          />
          <View>
            <Pressable
              style={({ pressed }) => [
                loginStyles.confirmbutt,
                { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
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
            <Pressable onPress={() => copyToClipboard(docId as string)}>
              <Text style={loginStyles.docId}>{docId}</Text>
            </Pressable>
          </View>
          <Text>(Tab code to copy)</Text>
          <View>
            <Pressable
              style={({ pressed }) => [
                loginStyles.confirmbutt,
                { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
              ]}
              onPress={handleContinue}
            >
              <Text>connect</Text>
            </Pressable>
          </View>
        </>
      )}
    </Animated.View>
  );
}
