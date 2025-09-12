import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
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
  confirmbutt: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: 210,
    height: 30,
    marginTop: 30,
  },
});
