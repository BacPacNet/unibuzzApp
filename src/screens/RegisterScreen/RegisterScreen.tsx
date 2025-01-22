import {
  getRegisterData,
  storeRegisterData,
  userTypeEnum,
} from "@/storage/register";
import React, { useEffect, useState } from "react";

import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import RegisterStepper from "@/components/organism/Register/Stepper/Stepper";
import FormContainer from "@/components/organism/Register/FormContainer/FormContainer";

const RegisterScreen = () => {
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(0);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 "
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 p-4  bg-white">
          <View className=" flex flex-row items-center justify-center w-full ">
            <View className="flex  items-center justify-center w-full">
              <RegisterStepper
                step={step}
                subStep={subStep}
                setStep={setStep}
                setSubStep={setSubStep}
              />
            </View>
          </View>

          <View className="flex-1  mt-10">
            <FormContainer
              step={step}
              setStep={setStep}
              subStep={subStep}
              setSubStep={setSubStep}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
