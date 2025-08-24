import { View, Text , StyleSheet} from "react-native";

export default function LoginScreen() {
    return (
        <View style={style.view}>
            <Text>This is login page</Text>
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