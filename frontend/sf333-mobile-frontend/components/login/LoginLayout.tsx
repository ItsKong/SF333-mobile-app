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
import { useLoginLayout } from "@/contexts/LoginLayoutProvider";

interface LoginLayoutProps {
  children: React.ReactNode;
}
// await AntDesign.loadFont();
export function LoginLayout({ children }: LoginLayoutProps) {
  const { showBackButton, onBackPress } = useLoginLayout();
  
  // use context to control property
  return (
    <View style={styles.container}>
      {/* Back Button */}
      {showBackButton ? (
        <Animated.View
          style={[styles.backButton, { transform: [{ translateX: 0 }] }]}
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
      ) : null}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    marginTop: -50,
  },
  header: {
    fontSize: 46,
    fontFamily: "Inconsolata_Light",
    color: "black",
    marginTop: 50,
    marginBottom: 50,
    alignItems: "center",
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
    alignItems: "center",
  },
});
