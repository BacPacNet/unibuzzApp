import React, { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";

import { OtpInput } from "react-native-otp-entry";
import { useHandleLoginEmailVerificationGenerate } from "@/services/auth";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";

interface Props {
  isVerificationSuccess: boolean;
  isPending: boolean;
  onSubmit: (data: any) => Promise<void>;
}

const LoginVerificationForm = ({
  onSubmit,
  isPending: verificationIsPending,
}: Props) => {
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const {
    formState: { errors: VerificationFormErrors },
    control,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
  } = useFormContext();
  const otp = getValues("verificationOtp");
  const otpRef = useRef<any>(null);
  const email = getValues("email");
  const {
    mutate: generateLoginEmailOTP,
    isPending,
    isError,
  } = useHandleLoginEmailVerificationGenerate();

  const handleLoginEmailSendCode = () => {
    if (!email) {
      setError("email", {
        type: "manual",
        message: "Please enter your email!",
      });
      return;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i;
    if (!emailRegex.test(email)) {
      setError("email", { type: "manual", message: "Invalid email format" });
      return;
    }

    clearErrors("email");
    const data = { email };

    generateLoginEmailOTP(data);

    handleLoginEmailSendCodeCount();
  };

  const handleLoginEmailSendCodeCount = () => {
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

  return (
    <View className="w-full">
      <View className="flex  items-center text-center p-4 ">
        <Title>Verification</Title>
        <SupportingText>Verify your login credentials.</SupportingText>
      </View>

      <View className="w-full flex  mb-4">
        <View>
          <FormInput
            label=" Email Address"
            disabled={true}
            placeholder="Enter an email you would like to show others"
            name="email"
            control={control}
            keyboardType="email-address"
            isError={!!VerificationFormErrors.email}
            errorMessage={
              VerificationFormErrors.email
                ? VerificationFormErrors.email.message?.toString()
                : "email  is required"
            }
            rules={{
              required: "Please enter your email!",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email format",
              },
            }}
          />

          <ReusableButton
            onPress={() => handleLoginEmailSendCode()}
            buttonText="Send Code"
            variant="border_primary"
            activityIndicatorColor="#6744FF"
            disabled={isCounting}
            isLoading={isPending && !isError}
            textStyle="text-primary-500"
          />
          {isCounting && (
            <Text className="text-md text-neutral-500 text-center">
              Resend Available after {countdown}s
            </Text>
          )}
        </View>
      </View>
      {/* otp  */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className=""
      >
        <View className="">
          <View className="my-4">
            <Text className="font-medium text-neutral-900 mb-2">
              Input Verification Code
            </Text>

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
              <Text className="text-red-500 text-md mt-1">
                {VerificationFormErrors?.verificationOtp?.message?.toString()}
              </Text>
            )}
          </View>

          <ReusableButton
            onPress={handleSubmit(onSubmit)}
            buttonText="Confirm"
            variant="primary"
            disabled={verificationIsPending}
            isLoading={verificationIsPending}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginVerificationForm;
