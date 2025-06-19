import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { LoginForm } from "@/models/auth";
import { useHandleLogin } from "@/services/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { Eye, EyeClosed } from "iconoir-react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";

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
            <View className="">
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
                <Text style={styles.passwordLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="*********"
                        secureTextEntry={!showPassword}
                        className={`border rounded-lg  ${loginErrors.password ? "border-red-500" : "border-neutral-300"}`}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}
                        style={styles.textInput}
                      />
                    )}
                    name="password"
                    rules={{
                      required: "Password is required!",
                    }}
                  />

                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye height={30} width={30} color={"#d4d4d4"} />
                    ) : (
                      <EyeClosed height={30} width={30} color={"#d4d4d4"} />
                    )}
                  </TouchableOpacity>
                </View>
                {loginErrors.password && (
                  <Text className="text-2xs text-red-500 mt-1">
                    {loginErrors.password.message}
                  </Text>
                )}
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
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
    color: "#3A3B3C",
    fontFamily: "font-poppins",
  },
  container: {
    paddingVertical: "8%",
  },
  formContainer: {
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  passwordContainer: {
    marginBottom: 16,
  },
  passwordLabel: {
    fontWeight: "500",
    color: "#171717",
    marginBottom: 8,
    fontSize: 14,
  },
  inputContainer: {
    position: "relative",
  },
  textInput: {
    padding: 12,
    fontSize: 14,
    height: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 8,
    top: 4,
  },
  forgotPasswordContainer: {
    marginTop: 4,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: "#6744FF",
  },
});
