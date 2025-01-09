import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Card from "@/components/atoms/Card";
import LogoCircle from "@/assets/LogoCircle.svg";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { LoginForm } from "@/models/auth";
import { useHandleLogin } from "@/services/auth";
//import { styles } from "./style";

function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: mutateLogin, error, isPending } = useHandleLogin();
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

  //  const onSubmit = async (data: LoginForm) => {
  //    mutateLogin(data, {
  //      onError: (err) => {
  //        if (isAxiosError(err)) {
  //          Alert.alert('Login Failed', err.response?.data?.message || 'Something went wrong.');
  //        }
  //      },
  //      onSuccess: () => {
  //        Alert.alert('Success', 'You are logged in!');
  //        router.push('/dashboard');
  //      },
  //    });
  //  };
  const onSubmit = async (data: LoginForm) => {
    mutateLogin(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 p-4 bg-white justify-center">
        <Card className="flex flex-col gap-2">
          <LogoCircle className="w-14 h-14" />
          <Text className="text-md font-bold text-neutral-900 pt-2">
            Login to your account
          </Text>
          <Text className="font-normal text-neutral-500">
            Enter your details to access your account
          </Text>

          <View>
            <View className="my-4">
              <Text className="font-medium text-neutral-900 mb-2">
                Email Address
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="john.dowry@example.com"
                    autoCapitalize="none"
                    className={`border rounded-lg p-3 ${loginErrors.email ? "border-red-500" : "border-neutral-300"}`}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="email"
                rules={{
                  required: "Please enter your email!",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email format",
                  },
                }}
              />
              {/*<TextInput
                placeholder="john.dowry@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`border rounded-lg p-3 ${loginErrors.email ? "border-red-500" : "border-neutral-300"}`}
                {...registerLogin("email", {
                  required: "Please enter your email!",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
              />*/}
              {loginErrors.email && (
                <Text className="text-xs text-red-500 mt-1">
                  {loginErrors.email.message}
                </Text>
              )}
            </View>
          </View>

          <View className="mb-4">
            <Text className="font-medium text-neutral-900 mb-2">Password</Text>
            <View className="relative">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="*********"
                    secureTextEntry={!showPassword}
                    className={`border rounded-lg p-3 ${loginErrors.password ? "border-red-500" : "border-neutral-300"}`}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="password"
                rules={{ required: "Please enter your password!" }}
              />
              {/*<TextInput
                placeholder="*********"
                secureTextEntry={!showPassword}
                className={`border rounded-lg p-3 ${loginErrors.password ? "border-red-500" : "border-neutral-300"}`}
                {...registerLogin("password", {
                  required: "Please enter your password!",
                })}
              />*/}
              {/*<TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <Entypo name="eye-with-line" size={20} color="gray" />
              ) : (
                <Entypo name="eye" size={20} color="gray" />
              )}
            </TouchableOpacity>*/}
            </View>
            {loginErrors.password && (
              <Text className="text-xs text-red-500 mt-1">
                {loginErrors.password.message}
              </Text>
            )}
            <TouchableOpacity className="my-4">
              <Text className="text-xs text-primary-500 text-right">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmitLogin(onSubmit)}
              disabled={isPending}
              className={`bg-primary-500 py-3 rounded-lg ${isPending ? "opacity-50" : ""}`}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-white font-bold">Log in</Text>
              )}
            </TouchableOpacity>
          </View>
        </Card>

        <TouchableOpacity className="mt-4" onPress={() => {}}>
          <Text className="text-center">
            No account yet?{" "}
            <Text className="text-primary-500 font-bold">
              Create an account
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
