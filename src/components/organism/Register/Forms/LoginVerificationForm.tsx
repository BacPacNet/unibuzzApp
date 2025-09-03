import React, { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Title from "@/components/atoms/Title";
import { OtpInput } from "react-native-otp-entry";
import { useHandleLoginEmailVerificationGenerate } from "@/services/auth";
import ReusableButton from "@/components/atoms/ReusableButton";
import { ArrowLeft } from "iconoir-react-native";

interface Props {
  isVerificationSuccess: boolean;
  isPending: boolean;
  onSubmit: (data: any) => Promise<void>;
  handlePrev: () => void;
}

const LoginVerificationForm = ({
  onSubmit,
  isPending: verificationIsPending,
  handlePrev,
}: Props) => {
  const [countdown, setCountdown] = useState(120);
  const [isCounting, setIsCounting] = useState(true);
  const [isResend, setIsResend] = useState(false);
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

  return (
    <View style={styles.main}>
      <View>
        <View style={styles.titlemargin} className=" w-full">
          <Title className="text-start">Verification</Title>
        </View>
        <Text className=" text-sm text-neutral-500">
          We emailed you a six-digit code to {email}. Enter the code below to
          confirm your email address.
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
                            pinCodeTextStyle: { color: "#3A3B3C" },
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
              onPress={() => handleLoginEmailSendCode()}
              buttonText={
                isCounting
                  ? `Resend Available after ${countdown}s`
                  : isResend
                    ? "Resend Code"
                    : "Resend Code"
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
          onPress={handleSubmit(onSubmit)}
          buttonText="Confirm"
          variant="primary"
          disabled={verificationIsPending}
          isLoading={verificationIsPending}
          height="large"
        />

        <ReusableButton
          onPress={handlePrev}
          buttonContent={
            <View className="flex flex-row items-center justify-center gap-2">
              <ArrowLeft width={20} height={20} color="#6744FF" />
              <Text className="text-primary-500"> Review Account</Text>
            </View>
          }
          variant="shade"
          height="large"
        />
      </View>
    </View>
  );
};

export default LoginVerificationForm;

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
