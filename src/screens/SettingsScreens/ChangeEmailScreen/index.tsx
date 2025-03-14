import { FormInput } from "@/components/atoms/FormInput";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useHeader } from "@/context/HeaderProvider/Header";
import { useHandleLoginEmailVerificationGenerate } from "@/services/auth";
import { useChangeUserEmail, useChangeUserPassword } from "@/services/user";
import { getUserStore } from "@/storage/user";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Eye, EyeClosed, NavArrowLeft } from "iconoir-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";

type PasswordVisibilityState = {
  showPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
};

const UserEmailChangeScreen = () => {
  const { goBack } = useNavigation();
  const { changeHeaderShownStatus } = useHeader();
  const user = getUserStore();
  const {
    mutate: generateEmailOTP,
    data: otpData,
    isPending,
  } = useHandleLoginEmailVerificationGenerate();
  const {
    mutate,
    error,
    isPending: isPendingChangeApi,
    isSuccess,
  } = useChangeUserEmail();

  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibilityState>({
      showPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    });
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
    clearErrors,
    setError,
    getValues,
  } = useForm();
  const otpRef = useRef<any>(null);

  const togglePasswordVisibility = (field: keyof PasswordVisibilityState) => {
    setPasswordVisibility((prevState: any) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleUniveristyEmailSendCodeCount = () => {
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

  const handleEmailSendCode = () => {
    const email = getValues("newMail");
    if (!email) {
      setError("newMail", {
        type: "manual",
        message: "Please enter your email!",
      });
      return;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i;
    if (!emailRegex.test(email)) {
      setError("newMail", { type: "manual", message: "Invalid email format" });
      return;
    }

    clearErrors("newMail");
    const data = { email };

    generateEmailOTP(data);
  };

  const onSubmit = (data: any) => {
    console.log("data", data);
    // mutate(data)
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
          <NavArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
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
            <Text style={styles.title}>Change Email</Text>
            <Text style={styles.desc}>
              This is your recovery email you use for authentication.
            </Text>

            <View style={styles.inputContainer}>
              <View>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Current Email</Text>
                </View>
                <Text style={styles.dummyInput}>{user?.email}</Text>
              </View>
              {/* new email  */}
              <View>
                <FormInput
                  label=" Email Address"
                  placeholder="Email Address"
                  name="newMail"
                  control={control}
                  keyboardType="email-address"
                  isError={!!errors.newMail}
                  errorMessage={
                    errors.newMail
                      ? errors.newMail.message?.toString()
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
                  onPress={() => handleEmailSendCode()}
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
              {/* otp  */}
              <View className="my-4">
                <Text className="font-medium text-neutral-900 mb-2">
                  Input Verification Code
                </Text>

                <Controller
                  control={control}
                  render={({ field: { onChange } }) => {
                    return (
                      <OtpInput
                        ref={otpRef}
                        type="numeric"
                        numberOfDigits={6}
                        // onTextChange={(text) => onChange(text)}
                        placeholder="000000"
                        onTextChange={(text) => onChange(text || "")}
                        focusColor="#6744FF"
                        autoFocus={false}
                        theme={{
                          containerStyle: {
                            width: 300,
                            gap: 10,
                            marginBottom: 16,
                          },
                          pinCodeContainerStyle: { height: 50 },
                        }}
                      />
                    );
                  }}
                  name="verificationOtp"
                  rules={{
                    required: "Please enter your verification OTP!",
                    minLength: { value: 6, message: "OTP must be 6 digits!" },
                  }}
                />
                {errors?.verificationOtp && (
                  <Text className="text-red-500 text-md mt-1">
                    {errors?.verificationOtp?.message?.toString()}
                  </Text>
                )}

                <View className="relative mb-4">
                  <Text style={styles.label}>Enter Password</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="*********"
                        secureTextEntry={
                          !passwordVisibility.showConfirmPassword
                        }
                        className={`border    rounded-lg  ${errors.password ? "border-red-500" : "border-neutral-300"}`}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        style={{
                          padding: 12,
                          fontSize: 14,
                          height: 40,
                          paddingEnd: 50,
                        }}
                      />
                    )}
                    name="confirmPassword"
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
                  />

                  <TouchableOpacity
                    style={styles.passwordIcon}
                    onPress={() =>
                      togglePasswordVisibility("showConfirmPassword")
                    }
                  >
                    {passwordVisibility.showConfirmPassword ? (
                      <Eye height={30} width={30} color={"#d4d4d4"} />
                    ) : (
                      <EyeClosed height={30} width={30} color={"#d4d4d4"} />
                    )}
                  </TouchableOpacity>
                  {errors.confirmPassword && (
                    <Text className="text-red-500 text-[12px] mt-1">
                      {errors.confirmPassword.message?.toString()}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <ReusableButton
            onPress={handleSubmit(onSubmit)}
            buttonText="Push Changes"
            variant="primary"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserEmailChangeScreen;

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
    paddingHorizontal: 0,
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
  },
  paddingContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  passwordIcon: {
    position: "absolute",
    top: 35,
    zIndex: 40,
    right: 12,
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
    // color: "#3A3B3C",
  },

  inputContainer: {
    marginTop: 16,
    display: "flex",
    gap: 24,
  },

  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 4,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D1D5DB",
  },

  dummyInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1F2937",
    height: 40,
  },
  labelContainer: {
    flexDirection: "row",
  },
});
