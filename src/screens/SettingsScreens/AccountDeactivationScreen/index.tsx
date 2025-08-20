import BackHeader from "@/components/atoms/BackHeader";
import { FormInput } from "@/components/atoms/FormInput";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { useDeActivateUserAccount } from "@/services/user";
import { getUserStore } from "@/storage/user";
import { useNavigation } from "@react-navigation/native";
import { CheckSquareSolid } from "iconoir-react-native";
import React from "react";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
  const { goBack, navigate } = useNavigation<any>();
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
    register,
    setValue,
  } = useForm();

  const password = watch("password");
  const isSelected = watch("isSelected");
  const onSubmit = (formData: any) => {
    if (!isSelected) {
      Toast.show("Please select the checkbox", {
        placement: "top",
        type: "warning",
      });
      return;
    }
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
      }
    );
  };

  return (
    <View style={styles.containerMain}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <BackHeader label="Settings" onPress={() => goBack()} />
        <View style={styles.paddingContainer} className="flex   ">
          <Text style={styles.title}>Account Deactivation</Text>
          <Text style={styles.desc}>
            Deactivating your Unibuzz account will permanently remove all public
            and private information associated with your profile.
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
            <View>
              <FormInput
                label="Email"
                placeholder="Email"
                //   required
                name="email"
                control={control}
                isError={!!errors.email}
                disabled={true}
                errorMessage={
                  errors.email
                    ? errors.email.message?.toString()
                    : "Please enter your email!"
                }
                currentValue={user?.email}
              />
              <Text style={styles.info}>
                In case you change your mind, we will send a reactivation link
                valid for 30 days.
              </Text>
            </View>
            {/* password  */}
            <View>
              <FormInputPassword
                isPasswordStrengthVisible={false}
                label="Password"
                placeholder="*********"
                name="password"
                control={control}
                isError={!!errors.password}
                errorMessage={errors.password?.message?.toString()}
                rules={rules}
              />
              <TouchableOpacity
                onPress={() =>
                  navigate("ForgetPassword", {
                    backTo: "UserNameChangeScreen",
                  })
                }
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
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

            <View className="flex flex-row items-center gap-2 ">
              <View className="flex justify-center items-center">
                <TouchableOpacity
                  onPress={() => setValue("isSelected", !isSelected)}
                  style={styles.checkboxBox}
                >
                  {isSelected && (
                    <CheckSquareSolid width={20} height={20} color="#6744FF" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.checkText}>
                I am sure I want to deactivate my Unibuzz account.
              </Text>
            </View>
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
      </KeyboardAwareScrollView>
    </View>
  );
};

export default UserAccountDeactivationScreen;

const styles = StyleSheet.create({
  containerMain: {
    // flex: 1,
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
    fontFamily: FONTS.poppins.bold,
    color: "#3A3B3C",
  },
  desc: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: "#6B7280",
  },
  info: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#6B7280",
    marginBottom: 16,
  },

  inputContainer: {
    marginTop: 32,
    display: "flex",
    gap: 16,
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#6744FF",
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 64,
    paddingBottom: "8%",
    paddingHorizontal: 16,
  },
  checkText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#404040",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: "#0066CC",
  },

  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});
