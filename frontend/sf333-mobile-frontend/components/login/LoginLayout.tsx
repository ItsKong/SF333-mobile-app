// components/login/LoginLayout.tsx
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface LoginLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  fadeBackButton?: Animated.Value;
}

export function LoginLayout({ 
  children, 
  showBackButton, 
  onBackPress, 
  fadeBackButton 
}: LoginLayoutProps) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      {fadeBackButton ? (
        <Animated.View
          style={[
            styles.backButton,
            { transform: [{ translateX: fadeBackButton }] },
          ]}
        >
          {showBackButton && (
            <Pressable onPress={onBackPress}>
              <AntDesign name="leftcircle" size={37} color="#5E6CA8" />
            </Pressable>
          )}
        </Animated.View>
      ) : (
        <View style={styles.backButton}>
          {showBackButton && (
            <Pressable onPress={onBackPress}>
              <AntDesign name="leftcircle" size={37} color="#5E6CA8" />
            </Pressable>
          )}
        </View>
      )}

      {/* Header */}
      <View>
        <Text style={styles.header}>Fantastic</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <Text style={styles.termsText}>Term of service</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  header: {
    fontSize: 46,
    fontFamily: "Inconsolata_Light",
    color: "black",
    marginTop: 150,
    marginBottom: 150,
  },
  bottom: {
    position: "absolute",
    bottom: 60,
  },
  termsText: {
    fontSize: 20,
  },
  backButton: {
    position: "absolute",
    left: "7%",
    top: "5%",
  },
});