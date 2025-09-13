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
  View,
  Platform,
  Alert,
} from "react-native";

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<string>("none");
  const { setUserRole } = useAuth();
  const [hasSelected, setHasSelected] = useState(false);
  const [hasConfirm, setHasComfirm] = useState(false);
  const router = useRouter();
  
  //dropdown stuff
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ]);

  //date picker stuff
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(null);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;

    // On Android, the picker automatically closes after selection
    // On iOS, we need to handle it differently
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "set") {
      setDate(currentDate);
      // Format the date for display
      const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setDateOfBirth(formattedDate as any);

      // Close picker on iOS after selection
      if (Platform.OS === "ios") {
        setShowPicker(false);
      }
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  const confirmIOSDate = () => {
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setDateOfBirth(formattedDate as any);
    setShowPicker(false);
  };

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
    setOpen(false);
    animateBack(
      () => null,
      () => {
        setHasSelected(false);
        setSelectedRole("none");
        setValue(null);
        setDateOfBirth(null);
        setHasComfirm(false);
      }
    );
  };

  const handleConfirm = () => {
    Alert.alert(
      "Confirm Action",
      "Please confirm your infomation.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancle Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            console.log("Ok pressed");
            setUserRole(selectedRole);
            setHasComfirm(true);
          },
        },
      ],
      { cancelable: false } // This makes the alert non-cancelable by tapping outside
    );

    // setUserRole(selectedRole);
    // setHasComfirm(true);
    // router.replace("/index");
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
