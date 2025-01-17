import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Eye, EyeClosed } from "iconoir-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import CustomTextInput from "@/components/atoms/CustomTextInput";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    control,
  } = useFormContext();

  const password = watch("password");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculateStrength = useCallback((password: string) => {
    if (password.length < 8) return 0;

    let score = 0;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }, []);

  useEffect(() => {
    setPasswordStrength(password ? calculateStrength(password) : 0);
  }, [password, calculateStrength]);

  return (
    <View className="flex w-full justify-center items-center px-4 bg-white">
      <View className="mb-4 w-full">
        <Title className="text-center">Join Our Community</Title>
        <SupportingText className="text-center text-gray-600">
          Enter your credentials to create an account
        </SupportingText>
      </View>

      <View className="w-full">
        {/* Email Input */}
        <View className="mb-4">
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

        {/* Username Input */}
        <View className="mb-4">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                error={!!errors.userName}
              />
            )}
            name="userName"
            rules={{
              required: "Please enter your username!",
            }}
          />
          {errors.userName && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.userName.message?.toString()}
            </Text>
          )}
        </View>

        {/* Password Input */}
        <View className="mb-4">
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
          </View>
          {password?.length ? (
            <View className="flex flex-row justify-between mt-2">
              {[1, 2, 3, 4].map((item) => (
                <View
                  key={item}
                  className={`h-1 flex-1 mx-0.5 rounded-full ${
                    passwordStrength >= item ? "bg-green-500" : "bg-neutral-300"
                  }`}
                />
              ))}
            </View>
          ) : null}
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.password.message?.toString()}
            </Text>
          )}
        </View>

        {/* Confirm Password Input */}
        <View className="mb-4">
          <View className="relative">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="*********"
                  secureTextEntry={!showConfirmPassword}
                  className={`border rounded-lg p-3 ${errors.password ? "border-red-500" : "border-neutral-300"}`}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
              )}
              name="confirmpassword"
              rules={{
                required: "Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
            />

            <TouchableOpacity
              className="absolute right-2 top-3"
              onPress={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <Eye height={30} width={30} color={"#d4d4d4"} />
              ) : (
                <EyeClosed height={30} width={30} color={"#d4d4d4"} />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmpassword && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.confirmpassword.message?.toString()}
            </Text>
          )}
        </View>

        <TouchableOpacity
          disabled={isPending}
          className={`bg-primary-500 py-3 rounded-lg ${isPending ? "opacity-50" : ""}`}
          onPress={handleSubmit(onSubmit)}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-bold">
              Create an account
            </Text>
          )}
        </TouchableOpacity>

        {/* Google Signup
        <TouchableOpacity className="mt-4 py-3 border border-gray-300 rounded-lg flex flex-row justify-center items-center">
          <Text className="text-gray-700">Sign up with Google</Text>
        </TouchableOpacity> */}

        {/* Navigate to Login */}
        <View className="mt-4">
          <Text className="text-center">
            Already have an account?{" "}
            <Text
              className="text-blue-600"
              onPress={() => navigation.navigate("LoginScreen")}
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AccountCreationForm;
