import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import { useLoginAnimations } from "@/hooks/useLoginAnimations";
import { LoginLayout } from "@/components/login/LoginLayout";
import { loginStyles } from "@/styles/login.style";
import { iosDatePicker } from "@/styles/iosDatePicker";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<string>("none");
  const { setUserRole } = useAuth();
  const [hasSelected, setHasSelected] = useState(false);
  const [hasConfirm, setHasConfirm] = useState(false);
  const router = useRouter();

  //form stuff
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [phone, setPhone] = useState("");
  const [emergency, setEmergency] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [sendform, setSendform] = useState({});
  let formData = {};

  const handleFormSubmit = () => {
    // async function
    // create and send form api
    if (selectedRole === "caregiver") {
      formData = {
        name: name,
        gender: gender,
        dateOfBirth: dateOfBirth,
        phone: phone,
        emergency: emergency,
        diagnosis: diagnosis,
      };
    } else {
      formData = {
        name: name,
        gender: gender,
        dateOfBirth: dateOfBirth,
        phone: phone,
      };
    }
    setSendform(formData)
    console.log("Form data: ", sendform);
    formData = {}
  };

  //dropdown stuff
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ]);

  //date picker stuff
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

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
    animateToConnect,
    animateBack,
    fadeBackButton,
    fadeButton,
    fadeInputContent,
    fadeConnectContent,
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
        setGender(null);
        setDateOfBirth(null);
        setHasConfirm(false);
      }
    );
  };

  const handleFormConfirm = () => {
    Alert.alert(
      "Confirm Infomation",
      "Please confirm your information.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            console.log("Ok pressed");
            handleFormSubmit();
            animateToConnect(
              () => {
                setUserRole(selectedRole);
              },
              () => {
                setHasConfirm(true);
              }
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleConnect = () => {
    //do connect stuff then -> (app)
    router.navigate('/(app)')
  };

  const renderRoleSelection = () => (
    // Initial state: show role selection buttons
    <View style={loginStyles.selectRoleContent}>
      <Animated.View style={[loginStyles.button, { opacity: fadeButton }]}>
        <Pressable
          style={({ pressed }) => [
            loginStyles.button,
            {
              backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
            },
          ]}
          onPress={() => handleSelected("caretaker")}
        >
          <Text style={loginStyles.text}>Individual with a disability</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={[loginStyles.line, { opacity: fadeButton }]} />

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
          <Text style={loginStyles.text}>Supervisor</Text>
        </Pressable>
      </Animated.View>
    </View>
  );

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

    // iOS implementation with modal-like behavior
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

  const renderSupervisorInput = () => (
    <Animated.View style={[loginStyles.content, { opacity: fadeInputContent }]}>
      <Text>
        You are: <Text style={{ fontWeight: "bold" }}>Supervisor</Text>
      </Text>
      <TextInput
        style={loginStyles.formInput}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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

      <TextInput
        style={loginStyles.formInput}
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
      />
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
      <View>
        <Pressable
          style={({ pressed }) => [
            loginStyles.confirmbutt,
            {
              backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
            },
          ]}
          onPress={handleFormConfirm}
        >
          <Text>confirm</Text>
        </Pressable>
      </View>
      {renderDatePicker()}
    </Animated.View>
  );

  const renderSuperviseeInput = () => (
    <Animated.View style={[loginStyles.content, { opacity: fadeInputContent }]}>
      <Text>You are:</Text>
      <Text style={{ fontWeight: "bold" }}>Individual with a disability</Text>
      <TextInput style={loginStyles.formInput} placeholder="Name" />
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

      <TextInput
        style={loginStyles.formInput}
        placeholder="Phone number: +66"
      />
      <View>
        <Pressable
          style={({ pressed }) => [
            loginStyles.confirmbutt,
            {
              backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
            },
          ]}
          onPress={handleFormConfirm}
        >
          <Text>confirm</Text>
        </Pressable>
      </View>
      {renderDatePicker()}
    </Animated.View>
  );

  const renderSupervisorConnect = () => (
    <Animated.View
      style={[loginStyles.content, { opacity: fadeConnectContent }]}
    >
      <Text>
        Please connect your{" "}
        <Text style={{ fontWeight: "bold" }}>Supervisee</Text>
      </Text>
      <TextInput style={loginStyles.formInput} placeholder="connect code" />
      <View>
        <Pressable
          style={({ pressed }) => [
            loginStyles.confirmbutt,
            {
              backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
            },
          ]}
          onPress={handleConnect}
        >
          <Text>connect</Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderSuperviseeConnect = () => (
    <Animated.View
      style={[loginStyles.content, { opacity: fadeConnectContent }]}
    >
      <Text>
        Please give your connect code to your{" "}
        <Text style={{ fontWeight: "bold" }}>Supervisor</Text>
      </Text>
      <View style={loginStyles.formInput}>
        <Text>{"connect code here!"}</Text>
      </View>
      <View>
        <Pressable
          style={({ pressed }) => [
            loginStyles.confirmbutt,
            {
              backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
            },
          ]}
          onPress={handleConnect}
        >
          <Text>connect</Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderContent = () => {
    if (!hasSelected) {
      return renderRoleSelection();
    }

    if (hasSelected && !hasConfirm) {
      if (selectedRole === "caretaker") {
        return renderSuperviseeInput();
      } else {
        return renderSupervisorInput();
      }
    }

    if (hasSelected && hasConfirm) {
      if (selectedRole === "caretaker") {
        return renderSuperviseeConnect();
      } else {
        return renderSupervisorConnect();
      }
    }

    // Fallback or default rendering if none of the above conditions are met
    return null;
  };
  return (
    <LoginLayout
      showBackButton={hasSelected}
      onBackPress={handleBackPress}
      fadeBackButton={fadeBackButton}
      fadeButton={fadeButton}
    >
      {renderContent()}
    </LoginLayout>
  );
}
