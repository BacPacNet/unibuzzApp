import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import ReusableButton from "@/components/atoms/ReusableButton";
import { Eye, EyeClosed } from "iconoir-react-native";
import { useUserPasswordReset } from "@/context/UserPasswordResetProvider/UserPasswordResetProvider";
import { useResetPassword } from "@/services/auth";

interface SetPasswordFormProps {
  navigation: any;

  setIsVerified: (value: boolean) => void;
}

const SetResetPassword: React.FC<SetPasswordFormProps> = ({
  navigation,
  setIsVerified,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { resetEmail, resetToken } = useUserPasswordReset();
  const password = watch("password");
  const confirmPassword = watch("confirmpassword");
  const {
    mutateAsync: ResetPassword,
    isSuccess: isResetPasswordSuccess,
    isPending: isResetPasswordLoading,
    isError: isResetPasswordError,
  } = useResetPassword();

  useEffect(() => {
    register("password", {
      required: "Password is required",
      minLength: {
        value: 8,
        message:
          "Password must have at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      },
      pattern: {
        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
        message:
          "Password must have at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      },
    });

    register("confirmpassword", {
      required: "Please confirm your password",
      validate: (val) => val === password || "Passwords do not match",
    });
  }, [register, password]);

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

  const handleResetPassword = async () => {
    const data = {
      email: resetEmail,
      resetToken: resetToken,
      newPassword: confirmPassword,
    };

    await ResetPassword(data, {
      onSuccess: () => {
        navigation.navigate("LoginScreen");
        setIsVerified(false);
      },
    });
  };

  return (
    <View className="w-full space-y-6">
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

      {/* Confirm Password Field */}
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
        onPress={handleSubmit(handleResetPassword)}
        buttonText="Reset Password"
        variant="primary"
        disabled={isResetPasswordLoading}
        isLoading={isResetPasswordLoading}
      />
    </View>
  );
};

export default SetResetPassword;
