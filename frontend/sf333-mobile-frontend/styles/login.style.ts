import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 233,
    height: 112,
  },
  content: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
  signUpContent: {
    width: "100%",
    alignItems: "center",
  },
  selectRoleContent: {
    width: "100%",
    alignItems: "center",
    marginTop: 100,
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
    borderRadius: 20,
    width: 210,
    height: 30,
    marginTop: 30,
  },
  dropdownContainer: {
    marginTop: 8,
    marginBottom:8,
    paddingHorizontal: 60,
    zIndex: 1000,
  },
  genderDropdown: {
    borderColor: '#DBE8F5',
    backgroundColor: '#DBE8F5',
    borderRadius: 20,
  },
  formInput: {
    backgroundColor: '#DBE8F5',
    width: '70%',
    height: 45,
    borderRadius: 20,
    marginTop:8,
    paddingTop: 12,
    padding: 10,
    marginBottom:8,
  },
  loginContent: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 233,
    height: 112,
    marginTop: 50,
  },
  loginForm: {
    backgroundColor: '#DBE8F5',
    width: '150%',
    height: '50%',
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
  },
  loginButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    width: '150%',
    height: '50%',
    borderRadius: 20,
  },
  loginSideButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    width: '150%',
    height: '50%',
    borderRadius: 20,
  },
  loginSideButtonText: {
     color: "black",
    fontSize: 14,
  }
});
