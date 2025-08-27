import { useState } from "react";
import { KeyboardAvoidingView, Platform, View} from "react-native";
import { Button, Checkbox, Text, TextInput} from "react-native-paper";
export default function AuthScreen() {
  const [isSelected, setSelection] = useState(false);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <Text>Create Account</Text>
        <TextInput
          label="Username"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@email.com"
          mode="outlined"
        />

        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@email.com"
          mode="outlined"
        />

        <TextInput
          label="Password"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
        />

        <TextInput
          label="Conferm password"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@email.com"
          mode="outlined"
        />

        <Checkbox
          status={isSelected ? "checked" : "unchecked"}
          onPress={() => {
            setSelection(!isSelected);
          }}
        />

        <Text>agree to Term of services</Text>

        <Button mode="contained">Sign Up</Button>

        <Button mode="text">Already have an Account</Button>
      </View>
    </KeyboardAvoidingView>
  );
}
