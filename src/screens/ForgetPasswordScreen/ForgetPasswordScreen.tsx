import { View, KeyboardAvoidingView, Platform } from "react-native";

import { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

import ForgetPasswordEmailCheck from "@/components/organism/ForgetPassword/EmailCheck";
import SetResetPassword from "@/components/organism/ForgetPassword/ResetPassword";
import ForgetPasswordOtpCheck from "@/components/organism/ForgetPassword/OtpCheck";

type ForgetPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForgetPassword"
>;

export enum ForgetPasswordStep {
  EmailCheck,
  OtpCheck,
  ResetPassword,
  Success,
}
function ForgetPasswordScreen({ route }: any) {
  const navigation = useNavigation<ForgetPasswordScreenNavigationProp>();
  const backTo = route.params?.backTo || "";

  const [currStage, setCurrStage] = useState<ForgetPasswordStep>(
    ForgetPasswordStep.EmailCheck,
  );

  const handleBack = () => {
    if (backTo) {
      navigation.navigate("SettingsStack", {
        screen: backTo,
      });
    } else {
      navigation.navigate("LoginScreen");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 p-4 bg-white justify-center">
        {currStage === ForgetPasswordStep.ResetPassword ? (
          <SetResetPassword
            navigation={navigation}
            setCurrStage={setCurrStage}
            handleBack={handleBack}
          />
        ) : currStage === ForgetPasswordStep.OtpCheck ? (
          <ForgetPasswordOtpCheck
            navigation={navigation}
            setCurrStage={setCurrStage}
          />
        ) : (
          <ForgetPasswordEmailCheck
            navigation={navigation}
            setCurrStage={setCurrStage}
            handleBack={handleBack}
            isFromSettings={backTo !== ""}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default ForgetPasswordScreen;
