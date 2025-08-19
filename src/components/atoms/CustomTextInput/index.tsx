import React from "react";
import { TextInput, TextInputProps } from "react-native";

type CustomTextInputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  error?: boolean;
  disable?: boolean;
  inputClassName?: string;
} & TextInputProps;

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder = "",
  value,
  onChangeText,
  onBlur,
  error,
  disable = false,
  inputClassName = "",
  ...rest
}) => {
  return (
    <TextInput
      className={`border rounded-lg text-neutral-500 p-3 text-base ${
        error ? "border-red-500" : "border-neutral-300"
      } ${inputClassName}`}
      placeholder={placeholder}
      onBlur={onBlur}
      onChangeText={onChangeText}
      value={value}
      editable={!disable}
      {...rest}
    />
  );
};

export default CustomTextInput;
