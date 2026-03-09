import { FONTS } from "@/constants/fonts";
import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

interface ReusableButtonProps {
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonText?: string;
  buttonContent?: React.ReactNode;
  variant:
    | "primary"
    | "secondary"
    | "border"
    | "border_primary"
    | "danger"
    | "danger_outline"
    | "shade";
  containerStyle?: string;
  textStyle?: string;
  activityIndicatorColor?: string;
  size?: "w-full" | "w-1/2" | "small" | "fit" | number;
  isRounded?: boolean;
  height?: "small" | "medium" | "large" | "x-small";
  textSize?: "text-sm" | "text-2xs";
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
  isRounded = true,
  height = "small",
  buttonContent,
  textSize = "",
}) => {
  const variantClasses = {
    primary: "bg-primary-500 text-white",
    secondary: "bg-gray-500 text-white",
    border: "border border-neutral-200 text-neutral-700 bg-white",
    border_primary: "border border-primary text-primary",
    danger: "bg-red-500 text-white",
    danger_outline: "border border-[#FEE2E2]  bg-[#FEF2F2]",
    shade:
      "bg-secondary border border-[#E9E8FF] text-primary-500 drop-shadow-sm",
  };

  const textColor = {
    primary: "text-white",
    secondary: "text-white",
    border: "text-neutral-700 ",
    border_primary: "text-primary",
    danger: "text-white",
    danger_outline: "text-[#FEE2E2]",
    shade: "text-primary-500 ",
  };

  const getSizeStyle = (
    size?: "w-full" | "w-1/2" | "small" | "fit" | number
  ):
    | {
        width?: number | string;
        alignSelf?: string;
        paddingHorizontal?: number;
      }
    | {} => {
    switch (size) {
      case "w-full":
        return { width: "100%" };
      case "w-1/2":
        return { width: "50%" };
      case "small":
        return { width: 89 };
      case "fit":
        return { alignSelf: "flex-start", paddingHorizontal: 16 };
      default:
        if (typeof size === "number") return { width: size };
        return {};
    }
  };

  const variantClass = variantClasses[variant] || "";
  const textColorClass = textColor[variant] || "";

  return (
    <TouchableOpacity
      className={`flex items-center justify-center ${disabled ? "opacity-50" : "opacity-100"}   rounded-lg   ${variantClass} ${containerStyle} ${isLoading ? "opacity-50" : ""}`}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        isRounded ? styles.rounded : {},
        height === "large" ? styles.large : {},
        height === "medium" ? styles.medium : {},
        height === "small" ? styles.small : {},
        height === "x-small" ? styles.xSmall : {},
        getSizeStyle(size),
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={activityIndicatorColor} />
      ) : buttonContent ? (
        <>{buttonContent}</>
      ) : (
        <Text
          style={[styles.buttonText, { fontFamily: FONTS.inter.medium }]}
          className={`text-center font-medium  ${textSize} ${textColorClass}`}
        >
          {buttonText}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ReusableButton;

const styles = StyleSheet.create({
  rounded: {
    borderRadius: 200,
  },
  large: {
    height: 48,
  },
  medium: {
    height: 40,
  },
  small: {
    height: 36,
  },
  xSmall: {
    height: 28,
  },
  buttonText: {
    fontFamily: FONTS.inter.medium,
  },
});
