import React from "react";
import { View, StyleSheet } from "react-native";
import { useFormContext } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import Title from "@/components/atoms/Title";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import { Text } from "react-native";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { TRACK_EVENT } from "@/content/constant";

type Props = {
  isPending: boolean;
  onSubmit: (data: any) => Promise<void>;
};

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RegisterScreen"
>;
const AccountCreationForm = ({ isPending, onSubmit }: Props) => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const {
    formState: { errors },
    watch,
    handleSubmit,
    control,
    getValues
  } = useFormContext();

  const password = watch("password");
  useTimeTracking(TRACK_EVENT.ACCOUNT_CREATION_STEP_VIEW_DURATION, {
    email: getValues('email'),
  });
  return (
    <View style={styles.main}>
      <View className="flex w-full justify-center items-center  bg-white">
        <View style={styles.titlemargin} className=" w-full">
          <Title className="text-start">Create Account</Title>
        </View>

        <View style={styles.mainContainer} className="w-full">
          {/* Email Input */}

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

          {/* Username Input */}

          <FormInput
            label="Username"
            placeholder="Enter Username"
            isLabelShown={true}
            name="userName"
            control={control}
            isError={!!errors.userName}
            rules={{
              required: "Please enter your username!",
            }}
            errorMessage={
              errors.userName
                ? errors.userName.message?.toString()
                : "Please enter your username!"
            }
          />

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
          />

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

          <View style={styles.buttonContainer}>
            <ReusableButton
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              buttonText="Next Step"
              variant="primary"
              isLoading={isPending}
              height="large"
            />

            <ReusableButton
              onPress={() => navigation.navigate("LoginScreen")}
              disabled={isPending}
              buttonText="Sign In"
              variant="border"
              height="large"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AccountCreationForm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
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
});
