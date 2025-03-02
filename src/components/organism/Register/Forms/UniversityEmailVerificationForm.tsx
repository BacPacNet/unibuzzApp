import React, { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import CustomTextInput from "@/components/atoms/CustomTextInput";

import { OtpInput } from "react-native-otp-entry";
import { CheckCircleSolid } from "iconoir-react-native";

import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import { useHandleUniversityEmailVerificationGenerate } from "@/services/auth";
import { storeRegisterData } from "@/storage/register";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
import { ScrollView } from "react-native";

type Props = {
  onSubmit: (data: any) => Promise<void>;
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
  isVerificationSuccess: boolean;
  isPending: boolean;
};

const UniversityVerificationForm = ({
  onSubmit,
  setStep,
  setSubStep,
  isPending: verificationIsPending,
  isVerificationSuccess,
}: Props) => {
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const {
    register,
    formState: { errors: UniversityVerificationFormErrors },
    control,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
  } = useFormContext();

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

  const handleNext = () => {
    setStep(3);
    setSubStep(0);
    storeRegisterData({ ...all, step: 3, subStep: 0 });
    // localStorage.setItem('registerData', JSON.stringify({ ...all, step: 3, subStep: 0 }))
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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1  items-center text-center  py-4 ">
        <Title>University Verification</Title>
        <SupportingText>
          Do you have a email provided by your university?
        </SupportingText>
      </View>
      {FeatureList()}
      <View
        style={{ marginLeft: 5 }}
        className="flex-1 flex-row items-center gap-2    py-4"
      >
        {/* <Image style={{width:40,height:40,backgroundColor:"white"}} resizeMode="cover"   source={universityLogoPlaceHolder} /> */}
        <UniversityLogoPlaceHolder className="w-10 h-10 p-4 bg-white " />
        <Text
          style={{ marginLeft: 2 }}
          className="text-md text-neutral-900 font-semibold "
        >
          {univeristyName}
        </Text>
      </View>
      <View className="w-full flex  my-4">
        <View>
          <FormInput
            label=" Email Address"
            disabled={true}
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
      <View>
        <View className="my-4">
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

        <ReusableButton
          onPress={() => handleNext()}
          buttonText="Skip University Verification"
          variant="shade"
          activityIndicatorColor="#6744FF"
          textStyle="text-primary-500"
        />

        <ReusableButton
          onPress={handleSubmit(onSubmit)}
          buttonText="Confirm"
          variant="primary"
          disabled={verificationIsPending}
          isLoading={verificationIsPending}
        />
      </View>
    </ScrollView>
  );
};

export default UniversityVerificationForm;

const FeatureList = () => {
  return (
    <View className="flex gap-2 my-2 flex-1">
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
