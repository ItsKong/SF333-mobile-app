import { View, Text, Pressable, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
export default function AppHome() {
  const router = useRouter();
  const handleBackPress = () => {
    router.replace("/(auth)/login");
  };
  return (
    <View style={{flex: 1}}>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          console.log("back"), handleBackPress();
        }}
      >
        <AntDesign name="leftcircle" size={37} color="#5E6CA8" />
      </Pressable>
      <Text style={{alignSelf: 'center'}}>This is giver index page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: "7%",
    top: "5%",
  },
});
