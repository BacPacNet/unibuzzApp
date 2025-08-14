import { getRegisterData } from "@/storage/register";
import React, { useEffect, useRef, useState } from "react";

import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import FormContainer from "@/components/organism/Register/FormContainer/FormContainer";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeScreen } from "@/components/template";

const RegisterScreen = () => {
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadRegisterData = async () => {
      try {
        const registerData = await getRegisterData();

        if (registerData) {
          setStep(registerData.step || 0);
          setSubStep(registerData.subStep || 0);
        }
      } catch (error) {
        console.error("Error loading register data:", error);
      }
    };
    loadRegisterData();
  }, []);

  const stepToShow = step == 2 ? 4 : step + 1;
  const subStepToShow = step !== 3 && subStep > 0 && subStep < 2 ? +1 : +0;

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 "
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollview}
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{ paddingHorizontal: 32 }}
              className="flex-1   bg-white"
            >
              {step !== 4 && (
                <View className=" py-8 flex flex-row items-center justify-center w-full ">
                  <View className="flex  items-end justify-end w-full ">
                    <View style={{ position: "relative" }} className="relative">
                      <AnimatedCircularProgress
                        size={48}
                        width={6}
                        fill={(stepToShow + subStepToShow) * 25}
                        tintColor="#6744FF"
                        backgroundColor="#F3F2FF"
                        rotation={0}
                      />
                      <Text
                        style={{
                          position: "absolute",
                          top: "50%",

                          transform: [{ translateX: -0 }, { translateY: -7 }],

                          width: 50,
                          textAlign: "center",
                        }}
                        className="text-3xs font-bold text-neutral-700"
                      >
                        {stepToShow + subStepToShow} of 4
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={{ marginTop: 12 }} className="flex-1 mb-4">
                <FormContainer
                  step={step}
                  setStep={setStep}
                  subStep={subStep}
                  setSubStep={setSubStep}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    width: "100%",
  },
});
