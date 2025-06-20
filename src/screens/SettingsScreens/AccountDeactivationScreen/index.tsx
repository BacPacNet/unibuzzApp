import BackHeader from "@/components/atoms/BackHeader";
import { FormInput } from "@/components/atoms/FormInput";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useDeActivateUserAccount } from "@/services/user";
import { getUserStore } from "@/storage/user";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";

const rules = {
  required: "Password is required!",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  pattern: {
    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
    message:
      "Password must contain uppercase, lowercase, number, and special character",
  },
};

const UserAccountDeactivationScreen = () => {
  const { goBack } = useNavigation();
  const user = getUserStore();
  const {
    mutate,
    error,
    isPending: isPendingChangeApi,
    isSuccess,
    reset,
  } = useDeActivateUserAccount();

  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = (formData: any) => {
    const data = {
      Password: formData.password,
      email: user?.email,
      userName: user?.userName,
    };
    mutate(
      { ...data },
      {
        onSuccess: () => {
          reset();
          Toast.show("Account has been Deactivated");
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackHeader label="Settings" onPress={() => goBack()} />
          <View style={styles.paddingContainer} className="flex   ">
            <Text style={styles.title}>Account Deactivation</Text>
            <Text style={styles.desc}>
              Deactivating your Unibuzz account will permanently remove all
              public and private information associated with your profile.
            </Text>

            <View style={styles.inputContainer}>
              <FormInput
                label="Username"
                placeholder="Username"
                //   required
                name="userName"
                control={control}
                isError={!!errors.userName}
                disabled={true}
                errorMessage={
                  errors.userName
                    ? errors.userName.message?.toString()
                    : "Please enter your username!"
                }
                currentValue={user?.userName}
              />

              <FormInput
                label="Email"
                placeholder="Email"
                //   required
                name="userName"
                control={control}
                isError={!!errors.userName}
                disabled={true}
                errorMessage={
                  errors.userName
                    ? errors.userName.message?.toString()
                    : "Please enter your username!"
                }
                currentValue={user?.email}
              />

              {/* password  */}

              <FormInputPassword
                isPasswordStrengthVisible={false}
                label="Password"
                placeholder="*********"
                name="password"
                control={control}
                isError={!!errors.newPassword}
                errorMessage={errors.newPassword?.message?.toString()}
                rules={rules}
              />

              {/* password  */}
              <FormInputPassword
                isPasswordStrengthVisible={false}
                label="Confirm Password"
                placeholder="*********"
                name="confirmPassword"
                control={control}
                isError={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message?.toString()}
                rules={{
                  required: "Password is required",
                  validate: (value: string) =>
                    value === password || "Passwords do not match",
                }}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <ReusableButton
              onPress={handleSubmit(onSubmit)}
              buttonText="Deactivate Account"
              variant="danger"
              height="large"
              isLoading={isPendingChangeApi}
              disabled={isPendingChangeApi}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserAccountDeactivationScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },

  container: {
    backgroundColor: "white",
    justifyContent: "space-between",
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

  inputContainer: {
    marginTop: 32,
    display: "flex",
    gap: 16,
  },

  buttonContainer: {
    marginTop: 64,
    paddingBottom: "8%",
    paddingHorizontal: 16,
  },
});
