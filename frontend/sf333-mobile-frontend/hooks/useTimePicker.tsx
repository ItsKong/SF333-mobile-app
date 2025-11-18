// components/login/useTimePicker.tsx
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { iosDatePicker } from "@/styles/iosDatePicker";

export default function useTimePicker() {
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const toggleTimepicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    
    // On Android, the picker automatically closes after selection
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (event.type === "set") {
      setTime(currentTime);
      // Format the time for display (24-hour format)
      const formattedTime = currentTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setSelectedTime(formattedTime);
      
      // Close picker on iOS after selection
      if (Platform.OS === "ios") {
        setShowTimePicker(false);
      }
    } else if (event.type === "dismissed") {
      setShowTimePicker(false);
    }
  };

  const confirmIOSTime = () => {
    const formattedTime = time.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setSelectedTime(formattedTime);
    setShowTimePicker(false);
  };

  const renderTimePicker = () => {
    if (!showTimePicker) return null;

    if (Platform.OS === "android") {
      return (
        <DateTimePicker
          mode="time"
          display="default"
          value={time}
          onChange={onTimeChange}
        />
      );
    }
    
    // iOS implementation
    return (
      <View style={iosDatePicker.iosPickerContainer}>
        <View style={iosDatePicker.iosPickerContent}>
          <View style={iosDatePicker.iosPickerHeader}>
            <Pressable onPress={() => setShowTimePicker(false)}>
              <Text style={iosDatePicker.iosPickerButton}>Cancel</Text>
            </Pressable>
            <Pressable onPress={confirmIOSTime}>
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
            mode="time"
            display="spinner"
            value={time}
            onChange={onTimeChange}
            style={iosDatePicker.iosPicker}
          />
        </View>
      </View>
    );
  };

  return {
    selectedTime,
    showTimePicker,
    setSelectedTime,
    toggleTimepicker,
    onTimeChange,
    confirmIOSTime,
    renderTimePicker,
  };
}