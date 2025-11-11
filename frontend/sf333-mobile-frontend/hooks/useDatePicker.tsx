// components/login/SignupForm.tsx
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { iosDatePicker } from "@/styles/iosDatePicker";


export default function useDatePicker() {
  // Date picker state (internal to component)
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formatedDate, setFormatedDate] = useState("");

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
        month: "2-digit",
        year: "numeric",
      });
      setFormatedDate(formattedDate as any);
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
    setFormatedDate(formattedDate as any);
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
          minimumDate={new Date()}
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
            minimumDate={new Date()}
            style={iosDatePicker.iosPicker}
          />
        </View>
      </View>
    );
  };

  return {
    formatedDate,
    showPicker,
    date,
    setDate,
    toggleDatepicker,
    onChange,
    confirmIOSDate,
    renderDatePicker,
    setFormatedDate,
  };
}
