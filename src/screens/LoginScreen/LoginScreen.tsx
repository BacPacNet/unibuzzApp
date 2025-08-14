import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginForm } from "@/models/auth";
import { useHandleLogin } from "@/services/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import { SafeScreen } from "@/components/template";
import { FONTS } from "@/constants/fonts";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: mutateLogin, error, isPending, isError } = useHandleLogin();
  const {
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    control,
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    mutateLogin(data);
  };

  return (
    <SafeScreen>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View
            style={styles.container}
            className="flex-1 p-4 bg-white justify-between h-full"
          >
            <View></View>
            <View>
              <Text style={styles.title}>Sign In</Text>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <FormInput
                    isLabelShown={true}
                    label="  Email Address/Username"
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
                    isError={!!loginErrors.email}
                    errorMessage={
                      loginErrors.email
                        ? loginErrors.email.message?.toString()
                        : "email  is required"
                    }
                  />

                  <View style={styles.passwordContainer}>
                    <FormInputPassword
                      label="Password"
                      placeholder="*********"
                      name="password"
                      control={control}
                      rules={{
                        required: "Password is required!",
                      }}
                      isInfoVisible={false}
                      isPasswordStrengthVisible={false}
                      isError={!!loginErrors.password}
                      errorMessage={loginErrors.password?.message?.toString()}
                    />

                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgetPassword")}
                      style={styles.forgotPasswordContainer}
                    >
                      <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {/* </Card> */}

            <View className="flex gap-4">
              <ReusableButton
                onPress={handleSubmitLogin(onSubmit)}
                buttonText="Log in"
                variant="primary"
                disabled={isPending}
                isLoading={isPending}
                height="large"
              />
              <ReusableButton
                onPress={() => navigation.navigate("RegisterScreen")}
                buttonText="Create Account"
                variant="border"
                disabled={isPending}
                height="large"
              />
              {isError && (
                <Text className="text-red-500 text-sm mt-4 text-center">
                  {error?.response?.data.message || "Something went wrong!"}
                </Text>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeScreen>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,

    lineHeight: 36,
    color: "#3A3B3C",
    fontFamily: FONTS.poppins.bold,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formContainer: {
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  passwordContainer: {
    marginBottom: 16,
  },

  forgotPasswordContainer: {
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#6744FF",
    fontFamily: FONTS.inter.regular,
  },
});
