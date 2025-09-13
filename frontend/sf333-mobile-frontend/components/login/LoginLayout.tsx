// components/login/LoginLayout.tsx
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface LoginLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  fadeBackButton?: Animated.Value;
  fadeButton?: Animated.Value;
}
// await AntDesign.loadFont();
export function LoginLayout({
  children,
  showBackButton,
  onBackPress,
  fadeBackButton,
  fadeButton,
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
              <MaterialCommunityIcons
                name="arrow-left-circle"
                size={43}
                color="#5E6CA8"
              />
            </Pressable>
          )}
        </Animated.View>
      ) : (
       null
      )}

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/fantistic-high-resolution-logo-transparent.png")} // ใส่ path ของรูปโลโก้คุณ
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom */}

      <Animated.View style={[styles.bottom, {opacity:fadeButton}]}>
        {!showBackButton ? (
          <Text style={styles.termsText}>Term of service</Text>
        ):(
          null
        )}
      </Animated.View>
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
    marginTop: 50,
    marginBottom: 50,
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
  logo: {
    width: 200,
    height: 200,
  },
});
