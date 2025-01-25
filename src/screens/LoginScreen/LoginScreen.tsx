import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Card from "@/components/atoms/Card";
import LogoCircle from "@/assets/UnibuzzFullLogo.png";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { LoginForm } from "@/models/auth";
import { useHandleLogin } from "@/services/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { Eye, EyeClosed } from "iconoir-react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
//import { styles } from "./style";
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
        {/* <Card className="flex flex-col gap-2"> */}
        <View style={{ marginBottom: 50 }} className="flex items-center ">
          {/* <LogoCircle className="w-14 h-14" /> */}
          <Image source={LogoCircle} />
        </View>
        <Text className="text-md font-bold text-neutral-900 pt-2">
          Login to your account
        </Text>
        {/* <Text className="font-normal text-neutral-500">
            Enter your details to access your account
          </Text> */}

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
              rules={{
                required: "Password is required!",
              }}
            />

            <TouchableOpacity
              className="absolute right-2 top-3"
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
            <Text className="text-xs text-red-500 mt-1">
              {loginErrors.password.message}
            </Text>
          )}
          <TouchableOpacity className="mt-1 mb-4">
            <Text className="text-xs ">Forgot Password?</Text>
          </TouchableOpacity>

          <ReusableButton
            onPress={handleSubmitLogin(onSubmit)}
            buttonText="Log in"
            variant="primary"
            disabled={isPending}
            isLoading={isPending}
          />
        </View>
        {/* </Card> */}

        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterScreen")}
          disabled={isPending}
          className={`border border-neutral-300 py-3  rounded-lg ${isPending ? "opacity-50" : ""}`}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-neutral-900 font-bold">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>
        {isError && (
          <Text className="text-red-500 text-sm mt-4 text-center">
            {error?.response?.data.message || "Something went wrong!"}
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
