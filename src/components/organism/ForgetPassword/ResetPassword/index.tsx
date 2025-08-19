import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm } from "react-hook-form";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useUserPasswordReset } from "@/context/UserPasswordResetProvider/UserPasswordResetProvider";
import { useResetPassword } from "@/services/auth";
import { ForgetPasswordStep } from "@/screens/ForgetPasswordScreen/ForgetPasswordScreen";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import Title from "@/components/atoms/Title";
interface SetPasswordFormProps {
  navigation: any;

  setCurrStage: (value: ForgetPasswordStep) => void;
  handleBack: () => void;
}

const SetResetPassword: React.FC<SetPasswordFormProps> = ({
  navigation,
  setCurrStage,
  handleBack,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });

  const { resetEmail, resetToken } = useUserPasswordReset();
  const password = watch("password");
  const confirmPassword = watch("confirmpassword");
  const {
    mutateAsync: ResetPassword,
    isSuccess: isResetPasswordSuccess,
    isPending: isResetPasswordLoading,
    isError: isResetPasswordError,
  } = useResetPassword();

  const handleResetPassword = async () => {
    const data = {
      email: resetEmail,
      resetToken: resetToken,
      newPassword: confirmPassword,
    };

    await ResetPassword(data, {
      onSuccess: () => {
        navigation.navigate("LoginScreen");
        setCurrStage(ForgetPasswordStep.Success);
      },
    });
  };

  useEffect(() => {
    if (resetToken?.length == 0) {
      setCurrStage(ForgetPasswordStep.EmailCheck);
      return;
    }
  }, [resetToken]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.main}>
        <View></View>
        {/* Password Input */}
        <View>
          <View style={styles.titlemargin} className=" w-full">
            <Title className="text-start">Reset Password</Title>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <FormInputPassword
              label="Password"
              placeholder="*********"
              name="password"
              control={control}
              rules={{
                required: "Password is required!",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                  message:
                    "Password must contain uppercase, lowercase, number, and special character",
                },
              }}
              isInfoVisible={password.length == 0}
              isError={!!errors.password}
              errorMessage={errors.password?.message?.toString()}
              isPasswordStrengthVisible={true}
            />

            {/* Confirm Password Field */}

            <FormInputPassword
              label="Confirm Password"
              placeholder="*********"
              name="confirmpassword"
              control={control}
              rules={{
                required: "Password is required",
                validate: (value: string) =>
                  value === password || "Passwords do not match",
              }}
              isPasswordStrengthVisible={false}
              isError={!!errors.confirmpassword}
              errorMessage={errors.confirmpassword?.message?.toString()}
            />
          </KeyboardAvoidingView>
        </View>
        <View style={styles.buttonContainer}>
          <ReusableButton
            onPress={handleSubmit(handleResetPassword)}
            buttonText="Reset Password"
            variant="primary"
            disabled={isResetPasswordLoading}
            isLoading={isResetPasswordLoading}
            height="large"
          />
          <ReusableButton
            onPress={handleBack}
            buttonText="Sign In"
            variant="border"
            height="large"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SetResetPassword;

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
