import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ReusableButtonProps {
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonText?: string;
  variant?:
    | "primary"
    | "secondary"
    | "border"
    | "border_primary"
    | "danger"
    | "shade";
  containerStyle?: string;
  textStyle?: string;
  activityIndicatorColor?: string;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
  buttonText = "Button",
  variant = "primary",
  containerStyle = "",
  textStyle = "text-white",
  activityIndicatorColor = "#fff",
}) => {
  const variantClasses = {
    primary: "bg-primary-500 text-white",
    secondary: "bg-gray-500 text-white",
    border: "border border-neutral-200 text-neutral-800 shadow-button",
    border_primary: "border border-primary text-primary",
    danger: "bg-red-500 text-white",
    shade:
      "bg-secondary border border-shade-button-border text-primary-500 drop-shadow-sm",
  };

  const variantClass = variantClasses[variant] || "";

  return (
    <TouchableOpacity
      className={`py-3 rounded-lg w-full mb-4 ${variantClass} ${containerStyle} ${isLoading ? "opacity-50" : ""}`}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={activityIndicatorColor} />
      ) : (
        <Text className={`text-center font-bold ${textStyle}`}>
          {buttonText}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ReusableButton;
