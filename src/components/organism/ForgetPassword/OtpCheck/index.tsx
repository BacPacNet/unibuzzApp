import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Title from "@/components/atoms/Title";
import { OtpInput } from "react-native-otp-entry";

import ReusableButton from "@/components/atoms/ReusableButton";

import { ForgetPasswordStep } from "@/screens/ForgetPasswordScreen/ForgetPasswordScreen";
import { useUserPasswordReset } from "@/context/UserPasswordResetProvider/UserPasswordResetProvider";
import {
  useResetPasswordCodeGenerate,
  useVerifyResetPasswordOtp,
} from "@/services/auth";

interface Props {
  setCurrStage: (value: ForgetPasswordStep) => void;
  navigation: any;
}

const ForgetPasswordOtpCheck = ({ navigation, setCurrStage }: Props) => {
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const { resetEmail } = useUserPasswordReset();
  const {
    formState: { errors: VerificationFormErrors },
    control,
    getValues,
  } = useForm();
  const {
    mutate: generateResetPasswordOtp,
    isPending,
    isError,
  } = useResetPasswordCodeGenerate();
  const {
    mutateAsync: verifyResetPasswordOtp,
    isSuccess: isVerifyResetPasswordSuccess,
    isPending: verificationIsPending,
  } = useVerifyResetPasswordOtp();

  const otpRef = useRef<any>(null);

  const handleUniversityEmailSendCode = () => {
    generateResetPasswordOtp({ email: resetEmail });
    handleLoginEmailSendCodeCount();
  };

  const resetPasswordOtp = async () => {
    const data = {
      otp: getValues("verificationOtp"),
      email: resetEmail,
    };

    const res = await verifyResetPasswordOtp(data);
    if (res.message === "OTP verified") {
      setCurrStage(ForgetPasswordStep.ResetPassword);
    }
  };

  const handleLoginEmailSendCodeCount = () => {
    setIsResend(true);
    setIsCounting(true);
    setCountdown(30);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  const handleOtpCheck = () => {
    setCurrStage(ForgetPasswordStep.ResetPassword);
  };

  return (
    <View style={styles.main}>
      <View></View>
      <View>
        <View style={styles.titlemargin} className=" w-full">
          <Title className="text-start">Reset Password</Title>
        </View>
        <Text className=" text-sm text-neutral-500">
          We emailed you a six-digit code to {resetEmail}. Enter the code below
          to confirm your email address.
        </Text>
        <View className="w-full flex  mb-4">
          <View>
            {/* otp  */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className=""
            >
              <View className="">
                <View style={styles.marginTop}>
                  {/* <Text className="font-medium text-neutral-900 mb-2">
              Input Verification Code
            </Text> */}

                  <Controller
                    control={control}
                    render={({ field: { onChange } }) => {
                      return (
                        <OtpInput
                          ref={otpRef}
                          type="numeric"
                          numberOfDigits={6}
                          // onTextChange={(text) => onChange(text)}
                          placeholder="000000"
                          onTextChange={(text) => onChange(text || "")}
                          focusColor="#6744FF"
                          autoFocus={false}
                          theme={{
                            containerStyle: { width: 300, gap: 10 },
                            pinCodeContainerStyle: { height: 50 },
                          }}
                        />
                      );
                    }}
                    name="verificationOtp"
                    rules={{
                      required: "Please enter your verification OTP!",
                      minLength: { value: 6, message: "OTP must be 6 digits!" },
                    }}
                  />
                  {VerificationFormErrors?.verificationOtp && (
                    <Text className="text-red-500 text-sm mt-1">
                      {VerificationFormErrors?.verificationOtp?.message?.toString()}
                    </Text>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
            <ReusableButton
              onPress={() => handleUniversityEmailSendCode()}
              buttonText={
                isCounting
                  ? `Resend Available after ${countdown}s`
                  : isResend
                    ? "Resend Code"
                    : "Send Code"
              }
              variant="border_primary"
              activityIndicatorColor="#6744FF"
              disabled={isCounting}
              isLoading={isPending && !isError}
              textStyle="text-primary-500"
              height="large"
            />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ReusableButton
          onPress={resetPasswordOtp}
          buttonText="Confirm"
          variant="primary"
          disabled={verificationIsPending}
          isLoading={verificationIsPending}
          height="large"
        />
        <ReusableButton
          onPress={() => navigation.navigate("LoginScreen" as any)}
          buttonContent={
            <View className="flex flex-row items-center justify-center gap-2">
              <Text className="text-primary-500"> Sign In</Text>
            </View>
          }
          variant="border"
          height="large"
        />
      </View>
    </View>
  );
};

export default ForgetPasswordOtpCheck;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  titlemargin: {
    marginBottom: 32,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 48,
  },
  marginTop: {
    marginTop: 32,
    marginBottom: 32,
  },
});
