import {
  getRegisterData,
  storeRegisterData,
  userTypeEnum,
} from "@/storage/register";
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Button,
} from "react-native";
import {
  Iconoir,
  ArrowDownLeft,
  CalendarPlusSolid,
} from "iconoir-react-native";
import RegisterStepper from "@/components/organism/Register/Stepper/Stepper";
import FormContainer from "@/components/organism/Register/FormContainer/FormContainer";

const RegisterScreen = () => {
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");

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
      } finally {
        setLoading(false);
      }
    };
    loadRegisterData();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className=" p-4  ">
        <View className=" flex flex-row items-center justify-center w-full ">
          <View className="flex items-center justify-center ">
            <RegisterStepper
              step={step}
              subStep={subStep}
              setStep={setStep}
              setSubStep={setSubStep}
            />
          </View>
        </View>

        <View className="flex flex-col items-center">
          <FormContainer
            step={step}
            setStep={setStep}
            subStep={subStep}
            setSubStep={setSubStep}
            setUserType={setUserType}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
