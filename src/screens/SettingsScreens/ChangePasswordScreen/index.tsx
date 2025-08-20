import BackHeader from "@/components/atoms/BackHeader";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import FullScreenLoader from "@/components/atoms/FullScreenLoader";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { useHeader } from "@/context/HeaderProvider/Header";
import { useChangeUserPassword } from "@/services/user";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
type NavigationProp = StackNavigationProp<RootStackParamList, "Settings">;

const UserPasswordChangeScreen = () => {
  const { goBack, navigate } = useNavigation<NavigationProp>();
  const { changeHeaderShownStatus } = useHeader();
  const {
    mutate,
    error,
    isPending: isPendingChangeApi,
    isSuccess,
  } = useChangeUserPassword();
  const [showLoader, setShowLoader] = useState(false);

  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm();

  const newPassword = watch("newPassword");

  //   useFocusEffect(
  //     useCallback(() => {
  //       changeHeaderShownStatus(false);

  //       return () => {
  //         changeHeaderShownStatus(true);
  //       };
  //     }, []),
  //   );

  const onSubmit = (data: any) => {
    setShowLoader(true);
    mutate(
      { ...data },
      {
        onSuccess: () => {
          reset();
          Toast.show("Password changed successfully");

          setShowLoader(false);
        },
        onError: () => {
          setShowLoader(false);
        },
      }
    );
  };

  if (showLoader) {
    return <FullScreenLoader message="Changing Password..." />;
  }

  return (
    // <SafeAreaView style={styles.containerMain}>
    <View style={styles.containerMain}>
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
            {/* <Title>University Verification</Title> */}
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.desc}>
              A strong password prevents your account from getting your account
              compromised.
            </Text>

            <View style={styles.inputContainer}>
              {/* password  */}
              <View>
                <FormInputPassword
                  isPasswordStrengthVisible={false}
                  label="Current Password"
                  placeholder="*********"
                  name="currentPassword"
                  control={control}
                  isError={!!errors.currentPassword}
                  errorMessage={errors.currentPassword?.message?.toString()}
                  rules={rules}
                />
                <TouchableOpacity
                  onPress={() =>
                    navigate("ForgetPassword", {
                      backTo: "ChangePasswordScreen",
                    })
                  }
                >
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* password  */}
              <FormInputPassword
                isPasswordStrengthVisible={true}
                isInfoVisible={!newPassword}
                label="New Password"
                placeholder="*********"
                name="newPassword"
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
                    value === newPassword || "Passwords do not match",
                }}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <ReusableButton
              onPress={handleSubmit(onSubmit)}
              buttonText="Change Password"
              variant="primary"
              height="large"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default UserPasswordChangeScreen;

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
  },
  paddingContainer: {
    padding: 16,
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

  inputContainer: {
    marginTop: 32,
    display: "flex",
    gap: 16,
  },

  buttonContainer: {
    marginTop: 64,
    paddingBottom: 36,
    paddingHorizontal: 16,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: 500,

    color: "#6744FF",
    marginBottom: 16,
  },
});
