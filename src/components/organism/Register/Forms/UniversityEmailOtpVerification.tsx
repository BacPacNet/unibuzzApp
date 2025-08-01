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
import { useHandleUniversityEmailVerificationGenerate } from "@/services/auth";
import ReusableButton from "@/components/atoms/ReusableButton";
import { ArrowLeft } from "iconoir-react-native";

interface Props {
  isVerificationSuccess: boolean;
  isPending: boolean;
  onSubmit: (data: any) => Promise<void>;
  handlePrev: () => void;
  
}

const UniversityEmailOtpVerification = ({
  onSubmit,
  isPending: verificationIsPending,
  handlePrev,

}: Props) => {
  const [countdown, setCountdown] = useState(30);
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
  const otp = getValues("UniversityOtp");
  const otpRef = useRef<any>(null);

  const email = getValues("universityEmail");
  const {
    mutate: generateUniversityEmailOTP,
    isPending,
    isError,
  } = useHandleUniversityEmailVerificationGenerate();

  const handleUniversityEmailSendCode = () => {
    if (!email) {
      setError("universityEmail", {
        type: "manual",
        message: "please enter your email!",
      });
      return;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i;
    if (!emailRegex.test(email)) {
      setError("universityEmail", {
        type: "manual",

        message: "invalid email format",
      });
      return;
    }

    clearErrors("universityEmail");
    const data = { email };
    handleLoginEmailSendCodeCount();
    generateUniversityEmailOTP(data);
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
          <Title className="text-start">University Verification</Title>
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
                    name="UniversityOtp"
                    rules={{
                      required: "Please enter your verification OTP!",
                      minLength: { value: 6, message: "OTP must be 6 digits!" },
                    }}
                  />
                  {VerificationFormErrors?.UniversityOtp && (
                    <Text className="text-red-500 text-sm mt-1">
                      {VerificationFormErrors?.UniversityOtp?.message?.toString()}
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
                  : 
                    "Resend Code"
                  
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
          onPress={()=>{handlePrev();
            setError("UniversityOtp", {
              message: "",
            });
          }}
          buttonContent={
            <View className="flex flex-row items-center justify-center gap-2">
              <ArrowLeft width={20} height={20} color="#6744FF" />
              <Text className="text-primary-500"> Change Email</Text>
            </View>
          }
          variant="shade"
          height="large"
        />
      </View>
    </View>
  );
};

export default UniversityEmailOtpVerification;

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
