// components/login/SignupForm.tsx
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  Platform,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { loginStyles } from "@/styles/login.style";
import { iosDatePicker } from "@/styles/iosDatePicker";
import { useAuth } from "@/contexts/AuthProvider";
import { useLoginLayout } from "@/contexts/LoginLayoutProvider";
import { Link, router, useFocusEffect } from "expo-router";

export default function SignupForm() {
  const { userRole } = useAuth();
  const isSupervisor = userRole === "caregiver";
  const { setOnBackPress, setShowBackButton } = useLoginLayout();

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

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emergency, setEmergency] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [password, setPassword] = useState("");

  // Gender dropdown state (internal to component)
  const [gender, setGender] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ]);

  // Date picker state (internal to component)
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

  const renderDatePicker = () => {
    if (!showPicker) return null;

    if (Platform.OS === "android") {
      return (
        <DateTimePicker
          mode="date"
          display="default"
          value={date}
          onChange={onChange}
          maximumDate={new Date()}
        />
      );
    }
    // iOS implementation
    return (
      <View style={iosDatePicker.iosPickerContainer}>
        <View style={iosDatePicker.iosPickerContent}>
          <View style={iosDatePicker.iosPickerHeader}>
            <Pressable onPress={() => setShowPicker(false)}>
              <Text style={iosDatePicker.iosPickerButton}>Cancel</Text>
            </Pressable>
            <Pressable onPress={confirmIOSDate}>
              <Text
                style={[
                  iosDatePicker.iosPickerButton,
                  iosDatePicker.confirmButton,
                ]}
              >
                Done
              </Text>
            </Pressable>
          </View>
          <DateTimePicker
            mode="date"
            display="spinner"
            value={date}
            onChange={onChange}
            maximumDate={new Date()}
            style={iosDatePicker.iosPicker}
          />
        </View>
      </View>
    );
  };

  const handleConfirm = () => {
    const formData = userRole === "caregiver"
      ? {
          username: name,
          password,
          gender,
          birth_date: dateOfBirth,
          phone_number: phone,
          emergency_contact: emergency,
          diagnosis,
          user_role: "caregiver",
        }
      : {
          username: name,
          password,
          gender,
          birth_date: dateOfBirth,
          phone_number: phone,
          user_role: "caretaker",
        };

    const apiUrl =
      userRole === "caregiver"
        ? "http://192.168.1.3:3000/disability"
        : "http://192.168.1.3:3000/disability";

    Alert.alert(
      "Confirm Information",
      "Please confirm your information.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // 1️⃣ Create user
              const createResp = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              });
              const createResult = await createResp.json();

              if (!createResp.ok) {
                Alert.alert("Error", createResult.error || "Signup failed");
                return;
              }

              console.log("User created:", createResult);

              // 2️⃣ Fetch the user by username to get the ID
              const usernameResp = await fetch(
                `http://192.168.1.3:3000/disability/username/${formData.username}`
              );
              const usernameData = await usernameResp.json();

              if (usernameResp.ok && usernameData.length > 0) {
                const docId = usernameData[0].id;
                console.log("Firestore document ID:", docId);

                // 3️⃣ Save it in state or localStorage for next screen
                // Example: router.push and pass params
                router.push({
                  pathname: "/(auth)/SignupConnect",
                  params: { docId: createResult.id  },
                });
              } else {
                console.log("User not found after signup", usernameData);
              }
            } catch (error) {
              console.error("Error:", error);
              Alert.alert(
                "Error",
                "Something went wrong. Please try again later."
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Animated.View style={[loginStyles.signUpContent, { opacity: 1 }]}>
      <Text>You are:</Text>
      <Text style={{ fontWeight: "bold" }}>
        {isSupervisor ? "Supervisor" : "Individual with a disability"}
      </Text>

      {/* Name Input */}
      <TextInput
        style={loginStyles.formInput}
        placeholder="Username"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={loginStyles.formInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      {/* Gender Dropdown */}
      <View style={loginStyles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={gender}
          items={items}
          setOpen={setOpen}
          setValue={setGender}
          setItems={setItems}
          placeholder="Gender"
          listMode="SCROLLVIEW"
          style={loginStyles.genderDropdown}
        />
      </View>

      {/* Date of Birth Input */}
      <View style={iosDatePicker.dateInputContainer}>
        <Pressable onPress={toggleDatepicker} style={loginStyles.formInput}>
          <Text
            style={[
              iosDatePicker.dateInputText,
              !dateOfBirth && iosDatePicker.placeholderText,
            ]}
          >
            {dateOfBirth || "Birth date"}
          </Text>
        </Pressable>
      </View>

      {/* Phone Input */}
      <TextInput
        style={loginStyles.formInput}
        placeholder={`Phone number${isSupervisor ? "" : ": +66"}`}
        value={phone}
        onChangeText={setPhone}
      />

      {/* Supervisor-only Fields */}
      {isSupervisor && (
        <>
          <TextInput
            style={loginStyles.formInput}
            placeholder="Emergency contact/number"
            value={emergency}
            onChangeText={setEmergency}
          />
          <Text>Main diagnosis for your Supervisee:</Text>
          <TextInput
            style={loginStyles.formInput}
            placeholder="ADHD, Autism"
            value={diagnosis}
            onChangeText={setDiagnosis}
          />
        </>
      )}

      {/* Confirm Button */}
      <View>
        <Pressable
          style={({ pressed }) => [
            loginStyles.confirmbutt,
            { marginTop: 10 },
            { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
          ]}
          onPress={() => handleConfirm()}
        >
          <Text>confirm</Text>
        </Pressable>
      </View>

      {/* TOS */}
      <Text style={{ fontSize: 16, marginTop: 20 }}>
        By signing up, I agree to Fantistic’s{" "}
        <Link href={"https://www.youtube.com/"}>
          <Text style={{ color: "#1261B1" }}>Term Of Service</Text>
        </Link>
      </Text>
      {/* Date Picker Modal */}
      {renderDatePicker()}
    </Animated.View>
  );
}
