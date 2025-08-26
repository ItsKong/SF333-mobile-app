import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={style.view}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})