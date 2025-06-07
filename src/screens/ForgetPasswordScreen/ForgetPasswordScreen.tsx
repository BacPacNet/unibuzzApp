import { View, Text, KeyboardAvoidingView, Platform } from "react-native";

import UnibuzzLogo from "@/assets/unibuzz_logo.svg";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginForm } from "@/models/auth";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

import ForgetPasswordEmailCheck from "@/components/organism/ForgetPassword/EmailCheck";
import SetResetPassword from "@/components/organism/ForgetPassword/ResetPassword";

type ForgetPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForgetPassword"
>;

function ForgetPasswordScreen() {
  const navigation = useNavigation<ForgetPasswordScreenNavigationProp>();
  const [isVerified, setIsVerified] = useState<null | boolean>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
    control,
    getValues,
    setError,
    clearErrors,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      password: "",
      verificationOtp: "",
      email: "",
      newPassword: "",
      confirmpassword: "",
    },
  });
  const email = watch("email");
  const verificationOtp = watch("verificationOtp");
  const confirmpassword = watch("confirmpassword");

  const onSubmit = async (data: LoginForm) => {
    // mutateLogin(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 p-4 bg-white justify-center">
        <View style={{ marginBottom: 50 }} className="flex items-center ">
          <UnibuzzLogo width={121} height={28} />
        </View>
        <Text className="text-xl font-bold text-neutral-900 pt-2">
          Reset Password
        </Text>

        {isVerified ? (
          <SetResetPassword
            navigation={navigation}
            setIsVerified={setIsVerified}
          />
        ) : (
          <ForgetPasswordEmailCheck
            navigation={navigation}
            setIsVerified={setIsVerified}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default ForgetPasswordScreen;
