import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import {
  useResetPasswordCodeGenerate,
  useVerifyResetPasswordOtp,
} from "@/services/auth";
import { OtpInput } from "react-native-otp-entry";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useUserPasswordReset } from "@/context/UserPasswordResetProvider/UserPasswordResetProvider";

interface Props {
  navigation: any;

  setIsVerified: (value: boolean) => void;
}

const ForgetPasswordEmailCheck: React.FC<Props> = ({
  navigation,

  setIsVerified,
}) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      verificationOtp: "",
    },
  });

  const email = watch("email");
  const verificationOtp = watch("verificationOtp");
  const [isCounting, setIsCounting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRef = useRef<any>(null);
  const { setResetPasswordEmail, resetToken } = useUserPasswordReset();

  const { mutate: generateResetPasswordOtp, isPending } =
    useResetPasswordCodeGenerate();
  const {
    mutate: verifyResetPasswordOtp,
    isSuccess: isVerifyResetPasswordSuccess,
  } = useVerifyResetPasswordOtp();

  const resetPasswordCodeGenerate = () => {
    const email = getValues("email");

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
    generateResetPasswordOtp({ email });
    handleLoginEmailSendCodeCount();
  };

  const handleLoginEmailSendCodeCount = () => {
    setIsCounting(true);
    setCountdown(30);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  const handleResetOtpCheck = () => {
    const data = {
      otp: verificationOtp,
      email,
    };
    setResetPasswordEmail(email);

    verifyResetPasswordOtp(data);
  };

  useEffect(() => {
    if (resetToken.length > 1 && !isVerifyResetPasswordSuccess) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [resetToken]);

  return (
    <>
      <View>
        <View className="my-4">
          <Text className="font-medium text-neutral-900 mb-2 text-md">
            Email Address
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Please enter your email!",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email format",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="john.dowry@example.com"
                autoCapitalize="none"
                className={`border rounded-lg p-3 ${
                  errors.email ? "border-red-500" : "border-neutral-300"
                }`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text className="text-md text-red-500 mt-1">
              {errors.email.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="border border-primary-500 py-3 rounded-lg w-full mb-2"
          disabled={isCounting}
          onPress={resetPasswordCodeGenerate}
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
          <Text className="text-md text-neutral-500 text-center">
            Resend Available after {countdown}s
          </Text>
        )}
      </View>

      <View className="mb-4">
        <View className="my-4">
          <Text className="font-medium text-neutral-900 mb-2">
            Input Verification Code
          </Text>
          <Controller
            control={control}
            name="verificationOtp"
            rules={{
              required: "Please enter your OTP!",
              minLength: { value: 6, message: "OTP must be 6 digits!" },
            }}
            render={({ field: { onChange } }) => (
              <OtpInput
                ref={otpRef}
                type="numeric"
                numberOfDigits={6}
                onTextChange={onChange}
                focusColor="#6744FF"
                autoFocus={false}
                theme={{
                  containerStyle: { width: 300, gap: 10 },
                  pinCodeContainerStyle: { height: 50 },
                }}
              />
            )}
          />
          {errors.verificationOtp && (
            <Text className="text-red-500 text-md mt-1">
              {errors.verificationOtp.message?.toString()}
            </Text>
          )}
        </View>

        <ReusableButton
          onPress={handleSubmit(handleResetOtpCheck)}
          buttonText="Reset Password"
          variant="primary"
        />
        <ReusableButton
          onPress={() => navigation.navigate("LoginScreen")}
          buttonText="Back to Login"
          variant="shade"
        />
      </View>
    </>
  );
};

export default ForgetPasswordEmailCheck;
