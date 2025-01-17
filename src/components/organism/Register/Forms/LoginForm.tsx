import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Eye, EyeClosed } from "iconoir-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import CustomTextInput from "@/components/atoms/CustomTextInput";
import LogoCircle from "@/assets/LogoCircle.svg";
import { useHandleLogin } from "@/services/auth";
import { LoginForm as LoginFormProp } from "@/models/auth";

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RegisterScreen"
>;
const LoginForm = ({ email }: { email: string }) => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const {
    mutate: mutateLogin,
    error,
    isPending,
    isError,
  } = useHandleLogin(true);
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    control,
    setValue,
  } = useForm<LoginFormProp>();

  useEffect(() => {
    setValue("email", email);
  }, []);

  const onSubmit = async (data: LoginFormProp) => {
    mutateLogin(data);
  };
  return (
    <View className="flex w-full justify-center items-center px-4 bg-white">
      <View className="my-4 w-full flex items-center gap-2">
        <LogoCircle className="w-14 h-14 " />
        <Title className="text-center">Congratulations</Title>
        <SupportingText className="text-center text-gray-600">
          Enter your details to access your account
        </SupportingText>
      </View>

      <View className="w-full my-4">
        {/* Email Input */}
        <View className="mb-4">
          <Text className="font-medium text-neutral-900 mb-2">
            Email Address
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                placeholder="john.dowry@example.com"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                error={!!errors.email}
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
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.email.message?.toString()}
            </Text>
          )}
        </View>
        {/* Password Input */}
        <View className="mb-4">
          <Text className="font-medium text-neutral-900 mb-2">Password</Text>
          <View className="relative">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="*********"
                  secureTextEntry={!showPassword}
                  className={`border rounded-lg p-3 ${errors.password ? "border-red-500" : "border-neutral-300"}`}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
              )}
              name="password"
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
              className="absolute right-2 top-3"
              onPress={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <Eye height={30} width={30} color={"#d4d4d4"} />
              ) : (
                <EyeClosed height={30} width={30} color={"#d4d4d4"} />
              )}
            </TouchableOpacity>
            <Text>Forgot Password?</Text>
          </View>

          {errors.password && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.password.message?.toString()}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        className={`bg-primary-500 py-3 rounded-lg w-full mb-4`}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-white font-bold">Log in</Text>
        )}
      </TouchableOpacity>
      {isError && (
        <Text className="text-red-500 text-sm mt-1">
          {error?.response?.data.message || "Something went wrong!"}
        </Text>
      )}
    </View>
  );
};

export default LoginForm;
