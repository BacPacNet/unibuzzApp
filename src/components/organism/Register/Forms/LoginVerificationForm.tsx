import React, { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import CustomTextInput from "@/components/atoms/CustomTextInput";

import { OtpInput } from "react-native-otp-entry";
import { useHandleLoginEmailVerificationGenerate } from "@/services/auth";

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
    register,
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
  const { mutate: generateLoginEmailOTP, isPending } =
    useHandleLoginEmailVerificationGenerate();

  const setOtpValue = () => {
    if (otpRef.current?.setValue) {
      otpRef.current.setValue(otp);
    }
  };

  useEffect(() => {
    setOtpValue();
  }, []);

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
          <View className="my-4">
            <Text className="font-medium text-neutral-900 mb-2">
              Email Address
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  placeholder="john.dowry@example.com"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  error={!!VerificationFormErrors.email}
                  disable={true}
                />
              )}
              name="email"
              rules={{
                required: "Please enter your email!",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email format",
                },
              }}
            />
            {VerificationFormErrors.email && (
              <Text className="text-red-500 text-sm mt-1">
                {VerificationFormErrors.email.message?.toString()}
              </Text>
            )}
          </View>
          <TouchableOpacity
            disabled={isCounting}
            className={`border border-primary-500  py-3 rounded-lg w-full mb-2`}
            onPress={() => handleLoginEmailSendCode()}
          >
            {isPending ? (
              <ActivityIndicator color="#6744FF" />
            ) : (
              <Text className="text-center text-primary-500 font-bold">
                Send Code
              </Text>
            )}
          </TouchableOpacity>
          {isCounting && (
            <Text className="text-xs text-neutral-500 text-center">
              Resend Available after {countdown}s
            </Text>
          )}
        </View>
      </View>
      {/* otp  */}
      <View>
        <View className="my-4">
          <Text className="font-medium text-neutral-900 mb-2">
            Input Verification Code
          </Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <OtpInput
                  ref={otpRef}
                  type="numeric"
                  numberOfDigits={6}
                  onTextChange={(text) => onChange(text)}
                  focusColor="#6744FF"
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
          {VerificationFormErrors.verificationOtp && (
            <Text className="text-red-500 text-sm mt-1">
              {VerificationFormErrors.verificationOtp.message?.toString()}
            </Text>
          )}
        </View>
        <TouchableOpacity
          disabled={verificationIsPending}
          className={`bg-primary-500 py-3 rounded-lg w-full mb-4`}
          onPress={handleSubmit(onSubmit)}
        >
          {verificationIsPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-bold">Confirm</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginVerificationForm;
