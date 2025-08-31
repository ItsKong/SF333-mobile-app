import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  TextInput,
  InteractionManager,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [hasSelected, setHasSelected] = useState(false);

  const fadeBackButton = useRef(new Animated.Value(-100)).current;
  const fadeButton = useRef(new Animated.Value(1)).current;
  const fadeTextArea = useRef(new Animated.Value(0)).current;
  const fadeText = useRef(new Animated.Value(0)).current;
  const fadeButtonText = useRef(new Animated.Value(1)).current;

  const handleSelected = (role: string) => {
    // setHasSelected(true);
    setSelectedRole(role);
    Animated.parallel([
      Animated.timing(fadeButton, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeButtonText, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      InteractionManager.runAfterInteractions(() => {
        setHasSelected(true);
        Animated.parallel([
          Animated.timing(fadeTextArea, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeBackButton, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeText, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    });
  };

  const handleBackPress = () => {
    Animated.parallel([
      Animated.timing(fadeTextArea, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeBackButton, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeText, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      InteractionManager.runAfterInteractions(() => {
        setHasSelected(false);
        setSelectedRole(null);

        Animated.parallel([
          Animated.timing(fadeButton, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeButtonText, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    });
  };
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backButton,
          { transform: [{ translateX: fadeBackButton }] },
        ]}
      >
        {hasSelected ? (
          <Pressable
            onPress={() => {
              console.log("back"), handleBackPress();
            }}
          >
            <AntDesign name="leftcircle" size={37} color="#5E6CA8" />
          </Pressable>
        ) : null}
      </Animated.View>

      <View>
        <Text style={styles.header}>Fantastic</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.youre}>You are:</Text>
        {hasSelected ? (
          // 1st() show role & name input
          <>
            <View style={[styles.button, { backgroundColor: "#A7C7E7" }]}>
              <Animated.View style={{ opacity: fadeText }}>
                <Text style={styles.text}>
                  {selectedRole === "caretaker" ? "Care taker" : "Care giver"}
                </Text>
              </Animated.View>
            </View>

            <View style={styles.line} />
            <Animated.View style={{ opacity: fadeTextArea }}>
              <View style={styles.button}>
                <Text>Your name:</Text>
                <TextInput style={styles.nameInput} placeholder="name" />
              </View>
            </Animated.View>
          </>
        ) : (
          // 2nd() show 2 button 2 role
          <>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
                },
              ]}
              onPress={() => {
                console.log("Care taker"), handleSelected("caretaker");
              }}
            >
              <Animated.View style={{ opacity: fadeButtonText }}>
                <Text style={styles.text}>Care taker</Text>
              </Animated.View>
            </Pressable>

            <View style={styles.line} />

            <Animated.View style={[styles.button, { opacity: fadeButton }]}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: pressed ? "#DBE8F5" : "#A7C7E7",
                  },
                ]}
                onPress={() => {
                  console.log("Care giver"), handleSelected("caregiver");
                }}
              >
                <Text style={styles.text}>Care taker</Text>
              </Pressable>
            </Animated.View>
          </>
        )}
      </View>
      <View style={styles.bottom}>
        <Text style={styles.termsText}>Term of service</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: 210,
    height: 90,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 18,
  },
  header: {
    fontSize: 46,
    fontFamily: "Inconsolata_Light",
    color: "black",
    marginTop: 150,
    marginBottom: 150,
  },
  youre: {
    alignSelf: "center",
    marginBottom: 40,
  },
  bottom: {
    position: "absolute",
    bottom: 60,
  },
  termsText: {
    fontSize: 20,
  },
  line: {
    height: 1,
    width: "60%",
    alignSelf: "center",
    backgroundColor: "grey",
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: "7%",
    top: "5%",
  },
  nameInput: {
    backgroundColor: "#DBE8F5",
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
  },
});
