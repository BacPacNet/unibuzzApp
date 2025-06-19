import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { useHandleUserEmailAvailability } from "@/services/auth";

import ReusableButton from "@/components/atoms/ReusableButton";
import { useUserPasswordReset } from "@/context/UserPasswordResetProvider/UserPasswordResetProvider";
import { ForgetPasswordStep } from "@/screens/ForgetPasswordScreen/ForgetPasswordScreen";
import { FormInput } from "@/components/atoms/FormInput";
import Title from "@/components/atoms/Title";

interface Props {
  navigation: any;
  setCurrStage: (value: ForgetPasswordStep) => void;
}

const ForgetPasswordEmailCheck: React.FC<Props> = ({
  navigation,

  setCurrStage,
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

  const {
    mutateAsync: handleUserEmailAvailability,
    isPending: isUserEmailAvailabilityPending,
    isError,
    error: userEmailAvailabilityError,
  } = useHandleUserEmailAvailability();

  const handleEmailCheck = async () => {
    try {
      await handleUserEmailAvailability({ email: email });

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

//   useEffect(() => {
//     if (resetToken.length > 1) {
//       setCurrStage(ForgetPasswordStep.ResetPassword);
//     } else {
//       setCurrStage(ForgetPasswordStep.EmailCheck);
//     }
//   }, [resetToken]);

  return (
    <View style={styles.main}>
      <View></View>
      <View style={styles.mainContainer}>
        <View style={styles.titlemargin} className="flex items-start  w-full">
          <Title>Reset Password</Title>
        </View>
        <View className="my-4">
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
          onPress={() => navigation.navigate("LoginScreen")}
          buttonText="Back to Login"
          variant="border"
          height="large"
        />
      </View>
    </View>
  );
};

export default ForgetPasswordEmailCheck;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
    marginTop: 64,
  },
});
