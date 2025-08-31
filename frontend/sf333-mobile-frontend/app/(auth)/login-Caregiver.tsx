import { View, Text, Button, Pressable, StyleSheet } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Fantastic</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.youre}>You are:</Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? "darkblue" : "#F9EECF",
            },
          ]}
          onPress={() => console.log("Care taker")}
        >
          <Text style={styles.text}>Care taker</Text>
        </Pressable>
        <View style={styles.line} />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? "darkblue" : "lightblue",
            },
          ]}
          onPress={() => console.log("Care giver")}
        >
          <Text style={styles.text}>Care giver</Text>
        </Pressable>
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
    color: "white",
    fontSize: 18,
  },
  header: {
    fontSize: 46,
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
    // position: 'absolute',
    width: "60%",
    alignSelf: "center",
    backgroundColor: "grey",
    marginTop: 20,
    marginBottom: 20,
  },
});
