import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useHandleUniversityEmailVerificationGenerate } from "@/services/auth";
import ReusableButton from "@/components/atoms/ReusableButton";
import { Controller } from "react-hook-form";
import BackHeader from "@/components/atoms/BackHeader";
import { FONTS } from "@/constants/fonts";

interface Props {
  control: any;
  email: string;
  otp: string;
  onOtpChange: (otp: string) => void;
  handleSubmit: any;
  onPrev: () => void;
  isPending: boolean;
  errors?: any;
  onValidSubmit: (data: any) => void;
  goBack: () => void;
  setError: (name: string, error: any) => void;
}

const UniversityOtpVerification = ({
  control,
  email,
  otp,
  onOtpChange,
  handleSubmit,
  onPrev,
  isPending,
  errors,
  onValidSubmit,
  goBack,
  setError,
}: Props) => {
  const [countdown, setCountdown] = useState(120);
  const [isCounting, setIsCounting] = useState(true);
  const [isResend, setIsResend] = useState(false);
  const otpRef = useRef<any>(null);

  const {
    mutate: generateUniversityEmailOTP,
    isPending: isResendPending,
    isError,
  } = useHandleUniversityEmailVerificationGenerate();

  const handleUniversityEmailSendCode = () => {
    const data = { email };
    handleUniversityEmailSendCodeCount();
    generateUniversityEmailOTP(data);
  };

  const handleUniversityEmailSendCodeCount = () => {
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
    <View style={styles.container}>
      <BackHeader label="Select University" onPress={goBack} />
      <View style={styles.paddingContainer}>
        <View>
          <Text style={styles.title}>University Verification</Text>
          <Text style={styles.desc}>
            We emailed you a six-digit code to {email}. Enter the code below to
            confirm your email address.
          </Text>
        </View>

        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View>
              <View style={styles.otpContainer}>
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
                  name="otp"
                  rules={{
                    required: "Please enter your verification OTP!",
                    minLength: { value: 6, message: "OTP must be 6 digits!" },
                  }}
                />
                {errors?.otp && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors?.otp?.message?.toString()}
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
                : "Resend Code"
            }
            variant="border_primary"
            activityIndicatorColor="#6744FF"
            disabled={isCounting}
            isLoading={isResendPending && !isError}
            textStyle="text-primary-500"
            height="large"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ReusableButton
          onPress={handleSubmit(onValidSubmit)}
          buttonText="Verify"
          variant="primary"
          disabled={isPending}
          isLoading={isPending}
          height="large"
        />
      </View>
    </View>
  );
};

export default UniversityOtpVerification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  paddingContainer: {
    padding: 16,
    // marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.poppins.bold,
    color: "#3A3B3C",
  },
  desc: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    marginTop: 8,
    color: "#6B7280",
  },
  otpContainer: {
    marginTop: 32,
    marginBottom: 32,
  },
  buttonContainer: {
    marginTop: 64,
    paddingBottom: "8%",
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
});
