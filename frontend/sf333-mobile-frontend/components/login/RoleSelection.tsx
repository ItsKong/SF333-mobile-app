import { View, Text, Pressable, Animated } from "react-native";
import { loginStyles } from "@/styles/login.style";

interface RoleSelectionProps {
  fadeButton: Animated.Value;
  onSelectRole: (role: string) => void;
}

export const RoleSelection = ({ fadeButton, onSelectRole }: RoleSelectionProps) => (
  <View style={loginStyles.selectRoleContent}>
    <Animated.View style={[loginStyles.button, { opacity: fadeButton }]}>
      <Pressable
        style={({ pressed }) => [
          loginStyles.button,
          { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
        ]}
        onPress={() => onSelectRole("caretaker")}
      >
        <Text style={loginStyles.text}>Individual with a disability</Text>
      </Pressable>
    </Animated.View>

    <Animated.View style={[loginStyles.line, { opacity: fadeButton }]} />

    <Animated.View style={[loginStyles.button, { opacity: fadeButton }]}>
      <Pressable
        style={({ pressed }) => [
          loginStyles.button,
          { backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7" },
        ]}
        onPress={() => onSelectRole("caregiver")}
      >
        <Text style={loginStyles.text}>Supervisor</Text>
      </Pressable>
    </Animated.View>
  </View>
);