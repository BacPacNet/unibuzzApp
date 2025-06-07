import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import { Eye, EyeClosed } from "iconoir-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";

import ReusableButton from "@/components/atoms/ReusableButton";
import { FormInput } from "@/components/atoms/FormInput";
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

        <FormInput
          isLabelShown={false}
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
          isError={!!errors.email}
          errorMessage={
            errors.email
              ? errors.email.message?.toString()
              : "email  is required"
          }
        />

        {/* Username Input */}

        <FormInput
          label="Username"
          placeholder="Enter Username"
          isLabelShown={false}
          required
          name="userName"
          control={control}
          isError={!!errors.userName}
          errorMessage={
            errors.userName
              ? errors.userName.message?.toString()
              : "Please enter your username!"
          }
        />

        {/* Password Input */}
        <View className="mb-4">
          <View className="relative">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="*********"
                  secureTextEntry={!showPassword}
                  className={`border    rounded-lg  ${errors.password ? "border-red-500" : "border-neutral-300"}`}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  style={{ padding: 12, fontSize: 14, height: 40 }}
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
              className="absolute right-2 top-1"
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
            <Text className="text-red-500 text-[12px] mt-1">
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
                  className={`border rounded-lg  ${errors.password ? "border-red-500" : "border-neutral-300"}`}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  style={{ padding: 12, fontSize: 14, height: 40 }}
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
              className="absolute right-2 top-1"
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
            <Text className="text-red-500 text-[12px] mt-1">
              {errors.confirmpassword.message?.toString()}
            </Text>
          )}
        </View>

        <ReusableButton
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          buttonText="Create an account"
          variant="primary"
          isLoading={isPending}
        />

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
