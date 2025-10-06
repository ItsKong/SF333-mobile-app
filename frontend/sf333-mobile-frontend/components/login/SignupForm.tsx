// components/login/SignupForm.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { loginStyles } from "@/styles/login.style";
import { iosDatePicker } from "@/styles/iosDatePicker";

interface SignupFormProps {
  role: "caretaker" | "caregiver";
  fadeInputContent: Animated.Value;
  // Form data
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  emergency?: string;
  setEmergency?: (value: string) => void;
  diagnosis?: string;
  setDiagnosis?: (value: string) => void;
  onConfirm: () => void;
}

export const SignupForm = ({
  role,
  fadeInputContent,
  name,
  setName,
  phone,
  setPhone,
  emergency,
  setEmergency,
  diagnosis,
  setDiagnosis,
  onConfirm,
}: SignupFormProps) => {
  const isSupervisor = role === "caregiver";

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

  return (
    <Animated.View style={[loginStyles.content, { opacity: fadeInputContent }]}>
      <Text>You are:</Text>
      <Text style={{ fontWeight: "bold" }}>
        {isSupervisor ? "Supervisor" : "Individual with a disability"}
      </Text>

      {/* Name Input */}
      <TextInput
        style={loginStyles.formInput}
        placeholder="Name"
        value={name}
        onChangeText={setName}
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
            placeholder="(ADHD, Autism)"
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
            { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
          ]}
          onPress={onConfirm}
        >
          <Text>confirm</Text>
        </Pressable>
      </View>

      {/* Date Picker Modal */}
      {renderDatePicker()}
    </Animated.View>
  );
};
