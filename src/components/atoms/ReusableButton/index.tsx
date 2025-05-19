import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ReusableButtonProps {
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonText: string;
  variant:
    | "primary"
    | "secondary"
    | "border"
    | "border_primary"
    | "danger"
    | "shade";
  containerStyle?: string;
  textStyle?: string;
  activityIndicatorColor?: string;
  size?: "w-full " | "w-1/2";
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
  buttonText = "Button",
  variant = "primary",
  containerStyle = "",
  textStyle = "",
  activityIndicatorColor = "#fff",
  size = "w-full",
}) => {
  const variantClasses = {
    primary: "bg-primary-500 text-white",
    secondary: "bg-gray-500 text-white",
    border: "border border-neutral-200 text-neutral-800 shadow-button",
    border_primary: "border border-primary text-primary",
    danger: "bg-red-500 text-white",
    shade:
      "bg-secondary border border-[#E9E8FF] text-primary-500 drop-shadow-sm",
  };

  const textColor = {
    primary: "text-white",
    secondary: "text-white",
    border: "text-neutral-800 shadow-button",
    border_primary: "text-primary",
    danger: "text-white",
    shade: "text-primary-500 ",
  };

  const variantClass = variantClasses[variant] || "";
  const textColorClass = textColor[variant] || "";

  return (
    <TouchableOpacity
      className={`py-3  rounded-lg ${size} mb-4 ${variantClass} ${containerStyle} ${isLoading ? "opacity-50" : ""}`}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={activityIndicatorColor} />
      ) : (
        <Text className={`text-center font-bold ${textColorClass}`}>
          {buttonText}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ReusableButton;
