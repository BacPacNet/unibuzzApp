import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "@/assets/onboarding/Unibuzz_Logo.svg";
import ReusableButton from "@/components/atoms/ReusableButton";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { SafeScreen } from "@/components/template";

type RootStackParamList = {
  LoginScreen: undefined;
};

type OnboardingMainProps = {
  setStartOnboarding: (startOnboarding: boolean) => void;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OnboardingMain: React.FC<OnboardingMainProps> = ({
  setStartOnboarding,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleGetStarted = () => setStartOnboarding(true);
  const handleLogin = () => navigation.navigate("LoginScreen");

  return (
    <SafeScreen style={styles.container}>
      <View style={styles.contentContainer}>
        <Logo width={220} height={51} />
        <View style={styles.buttonContainer}>
          <ReusableButton
            buttonText="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="w-full"
            height="large"
            containerStyle="mb-4"
          />
          <ReusableButton
            buttonText="I already have an account"
            onPress={handleLogin}
            variant="border"
            size="w-full"
            height="large"
          />
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F2FF",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  contentContainer: {
    height: 439,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    padding: 16,
  },
});

export default OnboardingMain;
