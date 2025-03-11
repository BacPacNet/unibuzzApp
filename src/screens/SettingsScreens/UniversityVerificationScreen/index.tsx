import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import CustomTextInput from "@/components/atoms/CustomTextInput";

import { OtpInput } from "react-native-otp-entry";
import { CheckCircleSolid, NavArrowLeft } from "iconoir-react-native";

import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import { useHandleUniversityEmailVerificationGenerate } from "@/services/auth";
import { storeRegisterData } from "@/storage/register";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useHeader } from "@/context/HeaderProvider/Header";

const UniversityVerificationScreen = () => {
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const { goBack } = useNavigation();
  const {
    formState: { errors: UniversityVerificationFormErrors },
    control,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm();
  const { changeHeaderShownStatus } = useHeader();
  const otp = getValues("UniversityOtp");
  const univeristyName = getValues("universityName");
  const all = getValues();
  const otpRef = useRef<any>(null);
  const { mutate: generateUniversityEmailOTP, isPending } =
    useHandleUniversityEmailVerificationGenerate();

  const handleUniversityEmailSendCode = () => {
    const email = getValues("universityEmail");
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

  useFocusEffect(
    useCallback(() => {
      changeHeaderShownStatus(false);

      return () => {
        changeHeaderShownStatus(true);
      };
    }, [])
  );

  const onSubmit = (data: any) => {
    console.log("data", data);
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
          <NavArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.paddingContainer} className="flex   ">
            {/* <Title>University Verification</Title> */}
            <Text style={styles.title}>University Verification</Text>
            <Text style={styles.desc}>
              Verify your account through your university email to unlock full
              features:
            </Text>
          </View>
          {FeatureList()}

          <View style={styles.paddingContainer} className="w-full flex  ">
            <View>
              <FormInput
                label=" Email Address"
                placeholder="Email Address"
                name="universityEmail"
                control={control}
                keyboardType="email-address"
                isError={!!UniversityVerificationFormErrors.email}
                errorMessage={
                  UniversityVerificationFormErrors.email
                    ? UniversityVerificationFormErrors.email.message?.toString()
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
              <TouchableOpacity
                disabled={isCounting}
                className={`border border-primary-500  py-3 rounded-lg w-full mb-2`}
                onPress={() => handleUniversityEmailSendCode()}
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
          <View style={styles.paddingContainer}>
            <View className="">
              <Text className="font-medium text-neutral-900 mb-2">
                Input Verification Code
              </Text>

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <OtpInput
                    ref={otpRef}
                    type="numeric"
                    numberOfDigits={6}
                    onTextChange={(text) => onChange(text)}
                    focusColor="#6744FF"
                    autoFocus={false}
                    theme={{
                      containerStyle: { width: 300, gap: 10 },
                      pinCodeContainerStyle: { height: 50 },
                    }}
                  />
                )}
                name="UniversityOtp"
                rules={{
                  required: "Please enter your OTP!",
                  minLength: { value: 6, message: "OTP must be 6 digits!" },
                }}
              />
              {UniversityVerificationFormErrors.UniversityOtp && (
                <Text className="text-red-500 text-md mt-1">
                  {UniversityVerificationFormErrors.UniversityOtp.message?.toString()}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <ReusableButton
              onPress={handleSubmit(onSubmit)}
              buttonText="Confirm"
              variant="primary"
              //   disabled={verificationIsPending}
              //   isLoading={verificationIsPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UniversityVerificationScreen;

const FeatureList = () => {
  return (
    <View style={styles.paddingContainer} className="flex gap-2   ">
      {/* First Feature */}
      <View className="flex-row gap-2 items-center">
        <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
        <Text className="text-md text-neutral-600 text-center">
          Can join private groups in university community
        </Text>
      </View>

      {/* Second Feature */}
      <View className="flex-row gap-2 items-center">
        <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
        <Text className="text-md text-neutral-600 text-center">
          Can join more than 1 university community
        </Text>
      </View>

      {/* Third Feature */}
      <View className="flex-row gap-2 items-center">
        <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
        <Text className="text-md text-neutral-600 text-center">
          Can create groups in university community
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    // padding: 16,
  },
  paddingContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#3A3B3C",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    fontWeight: 500,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 4,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D1D5DB",
  },
});
