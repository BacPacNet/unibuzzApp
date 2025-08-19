import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm } from "react-hook-form";
import {
  useHandleUserEmailAvailability,
  useResetPasswordCodeGenerate,
} from "@/services/auth";

import ReusableButton from "@/components/atoms/ReusableButton";
import { useUserPasswordReset } from "@/context/UserPasswordResetProvider/UserPasswordResetProvider";
import { ForgetPasswordStep } from "@/screens/ForgetPasswordScreen/ForgetPasswordScreen";
import { FormInput } from "@/components/atoms/FormInput";
import Title from "@/components/atoms/Title";

interface Props {
  navigation: any;
  setCurrStage: (value: ForgetPasswordStep) => void;
  handleBack: () => void;
  isFromSettings: boolean;
}

const ForgetPasswordEmailCheck: React.FC<Props> = ({
  navigation,
  handleBack,
  setCurrStage,
  isFromSettings,
}) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      verificationOtp: "",
    },
  });

  const email = watch("email");

  const { setResetPasswordEmail } = useUserPasswordReset();
  const { mutate: generateResetPasswordOtp, isPending } =
    useResetPasswordCodeGenerate();

  const {
    mutateAsync: handleUserEmailAvailability,
    isPending: isUserEmailAvailabilityPending,
    isError,
    error: userEmailAvailabilityError,
  } = useHandleUserEmailAvailability();

  const handleEmailCheck = async () => {
    try {
      await handleUserEmailAvailability({ email: email });
      await generateResetPasswordOtp({ email: email });
      setResetPasswordEmail(email);
      setCurrStage(ForgetPasswordStep.OtpCheck);
    } catch (err: any) {
      setError("email", {
        type: "manual",
        message:
          err.response.data?.message?.toString() ||
          "Something went wrong while checking email.",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.main}>
        <View></View>
        <View style={styles.mainContainer}>
          <View style={styles.titlemargin} className="flex items-start  w-full">
            <Title>Reset Password</Title>
          </View>
          <View className="bg-green-600">
            <FormInput
              isLabelShown={true}
              label="Email Address"
              placeholder="john.dowry@example.com"
              name="email"
              control={control}
              keyboardType="email-address"
              rules={{
                required: "Please enter your email!",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email format",
                },
              }}
              isError={!!errors.email}
              errorMessage={
                errors.email
                  ? errors.email.message?.toString()
                  : "email  is required"
              }
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ReusableButton
            onPress={handleSubmit(handleEmailCheck)}
            buttonText="Reset Password"
            variant="primary"
            height="large"
          />
          <ReusableButton
            onPress={handleBack}
            buttonText={isFromSettings ? "Back to Settings" : "Back to Login"}
            variant="border"
            height="large"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgetPasswordEmailCheck;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
  titlemargin: {
    marginBottom: 32,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 48,
  },
});
