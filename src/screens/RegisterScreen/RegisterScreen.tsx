import { getRegisterData } from "@/storage/register";
import { getLoginData } from "@/storage/login";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import FormContainer from "@/components/organism/Register/FormContainer/FormContainer";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { SafeScreen } from "@/components/template";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoginForm from "@/components/organism/Register/Forms/LoginForm";

const progressBarData = [
  { title: "Select Universities", des: "Choose universities to explore" },
  { title: "Account Creation", des: "Login Information" },
  { title: "Profile Setup", des: "User Information" },
  { title: "User Verification", des: "Sync personal email" },
];

const TOTAL_STEPS = 4;

const RegisterScreen = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loginCredentials, setLoginCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const hasSyncedStepFromStorage = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        const registerData = await getRegisterData();
        if (!hasSyncedStepFromStorage.current) {
          if (registerData?.step != null) {
            setStep(registerData.step);
          }
          hasSyncedStepFromStorage.current = true;
        }
      } catch (error) {
        console.error("Error loading register data:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (step === 4) {
      const credentials = getLoginData();
      if (credentials) {
        setLoginCredentials(credentials);
      }
    }
  }, [step]);

  if (step === 4) {
    return (
      <SafeScreen>
        <LoginForm
          email={loginCredentials?.email || ""}
          password={loginCredentials?.password || ""}
        />
      </SafeScreen>
    );
  }

  if (loading) {
    return (
      <SafeScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6744FF" />
        </View>
      </SafeScreen>
    );
  }

  const progressIndex = Math.min(step, TOTAL_STEPS - 1);
  const progressLabel = progressBarData[progressIndex];

  return (
    <SafeScreen>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ paddingHorizontal: 32 }} className="flex-1 bg-white">
            <View className="py-8 flex flex-row items-center w-full gap-4">
              <View style={{ position: "relative" }}>
                <AnimatedCircularProgress
                  size={64}
                  width={6}
                  fill={((Math.min(step, 3) + 1) / TOTAL_STEPS) * 100}
                  tintColor="#6744FF"
                  backgroundColor="#F3F2FF"
                  rotation={0}
                />
                <Text
                  style={styles.progressCount}
                  className="text-3xs font-bold text-neutral-700"
                >
                  {Math.min(step, 3) + 1} of {TOTAL_STEPS}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-neutral-700 font-medium">
                  {progressLabel.title}
                </Text>
                <Text className="text-neutral-500 text-xs">
                  {progressLabel.des}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 12 }} className="flex-1 mb-4">
              <FormContainer step={step} setStep={setStep} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeScreen>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressCount: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    textAlign: "center",
    transform: [{ translateY: -7 }],
  },
});
