import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import { useLoginAnimations } from "@/hooks/useLoginAnimations";
import { LoginLayout } from "@/components/login/LoginLayout";
import { loginStyles } from "@/styles/login.style";
import { LoginForm } from "@/components/login/LoginForm";
import { RoleSelection } from "@/components/login/RoleSelection";
import { SignupForm } from "@/components/login/SignupForm";
import { SignupConnect } from "@/components/login/SignupConnect";

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<string>("none");
  const { setUserRole } = useAuth();
  const [hasSelected, setHasSelected] = useState(false);
  const [hasLogin, setHasLogin] = useState(false);
  const [hasConfirm, setHasConfirm] = useState(false);
  const router = useRouter();

  //form stuff
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [phone, setPhone] = useState("");
  const [emergency, setEmergency] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [sendform, setSendform] = useState({});
  const [password, setPassword] = useState("");

  const handleFormSubmit = () => {
    // async function
    // create and send to form api
    const formData =
      selectedRole === "caregiver"
        ? { name, password, gender, dateOfBirth, phone, emergency, diagnosis }
        : { name, password, gender, dateOfBirth, phone };
    setSendform(formData);
    console.log("Form data: ", sendform);
  };

  //anime stuff
  const {
    animateToSelection,
    animateToConnect,
    animateBack,
    animateToLogin,
    fadeBackButton,
    fadeButton,
    fadeInputContent,
    fadeConnectContent,
    fadeLoginContent,
  } = useLoginAnimations();

  const handleLogin = (state: string) => {
    if (state === "confirm") {
      null;
    }

    if (state === "create") {
      console.log("create");
      setHasLogin(true);
      animateToLogin(
        () => {
          setHasSelected(false);
        },
        () => {
          null;
        }
      );
    }

    if (state === "forgot") {
      null;
    }
  };

  const handleSelected = (role: string) => {
    animateToSelection(
      () => {
        setSelectedRole(role);
      },
      () => {
        setHasSelected(true);
      }
    );
  };

  const handleBackPress = () => {
    // setOpen(false); close date picker when press back button
    setHasLogin(false);
    animateBack(
      () => null,
      () => {
        setHasSelected(false);
        setSelectedRole("none");
        setGender(null);
        setDateOfBirth(null);
        setHasConfirm(false);
      }
    );
  };

  const handleStartOver = () => {
  setHasLogin(false);
  setHasSelected(false);
  setSelectedRole("none");
  setGender(null);
  setDateOfBirth(null);
  setHasConfirm(false);
  setName("");
  setPassword("");
  setPhone("");
  setEmergency("");
  setDiagnosis("");
};

  const handleFormConfirm = () => {
    Alert.alert(
      "Confirm Infomation",
      "Please confirm your information.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            console.log("Ok pressed");
            handleFormSubmit();
            animateToConnect(
              () => {
                setUserRole(selectedRole);
              },
              () => {
                setHasConfirm(true);
              }
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleConnect = () => {
    //do connect stuff then -> (app)
    router.navigate("/(app)");
  };

  const renderContent = () => {
    if (!hasLogin) {
      return (
        <LoginForm
          fadeLoginContent={fadeLoginContent}
          name={name}
          setName={setName}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
        />
      );
    }

    if (!hasSelected) {
      return (
        <RoleSelection fadeButton={fadeButton} onSelectRole={handleSelected} />
      );
    }

    if (hasSelected && !hasConfirm) {
      return (
        <SignupForm
          role={selectedRole as "caretaker" | "caregiver"}
          fadeInputContent={fadeInputContent}
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          emergency={emergency}
          setEmergency={setEmergency}
          diagnosis={diagnosis}
          setDiagnosis={setDiagnosis}
          onConfirm={handleFormConfirm}
        />
      );
    }

    if (hasSelected && hasConfirm) {
      return (
        <SignupConnect
          role={selectedRole as "caretaker" | "caregiver"}
          fadeConnectContent={fadeConnectContent}
          connectCode={null}
          handleConnect={handleConnect}
        />
      );
    }

    // Fallback or default rendering if none of the above conditions are met
    return null;
  };
  return (
    <LoginLayout
      showBackButton={hasLogin}
      onBackPress={handleBackPress}
      fadeBackButton={fadeBackButton}
      fadeButton={fadeButton}
    >
      {renderContent()}
    </LoginLayout>
  );
}
