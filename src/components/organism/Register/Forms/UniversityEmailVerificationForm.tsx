import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";

import Title from "@/components/atoms/Title";
import { CheckCircleSolid } from "iconoir-react-native";

import {
  useHandleRegister_v2,
  useHandleUniversityEmailVerificationGenerate,
} from "@/services/auth";
import { getRegisterData, storeRegisterData } from "@/storage/register";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
import CommunityLogo from "@/components/atoms/LogoHolder";

type Props = {
  onSubmit: (data: any) => Promise<void>;
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
  isVerificationSuccess: boolean;
  isPending: boolean;
  logoUrl: string;
};

const UniversityVerificationForm = ({
  onSubmit,
  setStep,
  setSubStep,
  isPending: verificationIsPending,
  isVerificationSuccess,
  logoUrl,
}: Props) => {
  const [countdown, setCountdown] = useState(120);
  const [isCounting, setIsCounting] = useState(false);
  const {
    register,
    formState: { errors: UniversityVerificationFormErrors },
    control,
    getValues,
    setError,
  } = useFormContext();

  const univeristyName = getValues("universityName");

  const { mutateAsync: HandleRegister, isPending: registerIsPending } =
    useHandleRegister_v2();
  const { mutate: generateUniversityEmailOTP } =
    useHandleUniversityEmailVerificationGenerate();

  const handleskip = async () => {
    const data = await getRegisterData();
    const res = await HandleRegister(data);
    if (res?.isRegistered) {
      storeRegisterData({ ...data, step: 4, subStep: 0 });
      setStep(4);
      setSubStep(0);
    }
  };
  const handleNext = async () => {
    const storedData = await getRegisterData();
    const universityEmail = getValues("universityEmail");

    if (!universityEmail) {
      setError("universityEmail", {
        message: "Please enter your university email!",
      });
      return;
    }
    const data = {
      email: universityEmail,
    };
    generateUniversityEmailOTP(data, {
      onSuccess: () => {
        storeRegisterData({
          ...storedData,
          universityEmail: universityEmail,
          step: 3,
          subStep: 2,
        });

        setStep(3);
        setSubStep(2);
      },
    });
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
    <View style={styles.main}>
      <View style={styles.titlemargin} className=" w-full">
        <Title className="text-start">University Verification</Title>
      </View>
      {FeatureList()}
      <View style={styles.universityName}>
        <Text className=" text-xs text-neutral-700 mb-4">
          Verifying University
        </Text>
        <View className="flex-1 flex-row items-center gap-2    ">
          <CommunityLogo logoUrl={logoUrl} variant="large" />
          <Text
            style={{ marginLeft: 2 }}
            className="text-xs text-neutral-700 font-medium "
          >
            {univeristyName}
          </Text>
        </View>
      </View>
      <View className="w-full flex  my-4 flex-1">
        <View>
          <FormInput
            label="University Email"
            disabled={false}
            placeholder="Email Address"
            name="universityEmail"
            control={control}
            keyboardType="email-address"
            isError={!!UniversityVerificationFormErrors.universityEmail}
            errorMessage={
              UniversityVerificationFormErrors.universityEmail
                ? UniversityVerificationFormErrors.universityEmail.message?.toString()
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
        </View>
      </View>
      {/* otp  */}
      <View style={styles.buttonContainer}>
        <ReusableButton
          onPress={() => handleNext()}
          buttonText="Verify"
          variant="primary"
          disabled={verificationIsPending}
          isLoading={verificationIsPending}
          height="large"
        />
        <ReusableButton
          onPress={() => handleskip()}
          buttonText="Skip this step"
          variant="shade"
          activityIndicatorColor="#6744FF"
          textStyle="text-primary-500"
          height="large"
        />
      </View>
    </View>
  );
};

export default UniversityVerificationForm;

const FeatureList = () => {
  return (
    <View>
      <Text className=" text-sm text-neutral-500 mb-4">
        Verify your university email to unlock these exclusive benefits.
      </Text>

      <View className="flex gap-2 my-2 ">
        {/* First Feature */}
        <View className="flex-row gap-2 items-center">
          <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
          <Text className="text-xs text-neutral-600 ">
            Join multiple university communities.
          </Text>
        </View>

        {/* Second Feature */}
        <View className="flex-row gap-2 items-center">
          <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
          <Text className="text-xs text-neutral-600 ">
            Create your own groups within your university network.
          </Text>
        </View>

        {/* Third Feature */}
        <View className="flex-row gap-2 items-center">
          <CheckCircleSolid color={"#6744FF"} height={24} width={24} />
          <Text className="text-xs text-neutral-600 ">
            Get full access to private groups and exclusive discussions.
          </Text>
        </View>
      </View>
    </View>
  );
};

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
  universityName: {
    flex: 1,
    marginLeft: 5,
    marginTop: 32,
    marginBottom: 32,
    fontSize: 14,
    fontWeight: "500",
    color: "#3A3B3C",
  },
  marginTop: {
    marginTop: 32,
  },
});
