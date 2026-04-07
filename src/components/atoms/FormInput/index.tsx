import React, { forwardRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { FONTS } from "@/constants/fonts";

interface FormInputProps {
  label?: string;
  placeholder: string;
  required?: boolean;
  isLabelShown?: boolean;
  rules?: object;
  control: any;
  name: string;
  isError?: boolean;
  errorMessage?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  disabled?: boolean;
  isTextArea?: boolean;
  currentValue?: string;
  maxLength?: number;
}

export const FormInput = forwardRef<View, FormInputProps>(
  (
    {
      label,
      placeholder,
      required = false,
      rules,
      isLabelShown = true,
      name,
      control,
      isError,
      errorMessage,
      secureTextEntry,
      keyboardType = "default",
      disabled = false,
      isTextArea = false,
      currentValue,
      maxLength,
    },
    ref
  ) => {
    const effectiveMaxLength =
      keyboardType === "email-address" ? undefined : (maxLength ?? 50);

    return (
      // ✅ Single root native element with ref
      <View ref={ref} style={styles.container}>
        {isLabelShown && (
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{label}</Text>
            {required && <Text style={styles.required}>*</Text>}
          </View>
        )}

        <Controller
          control={control}
          name={name}
          // rules={rules}
          rules={{ ...rules, validate: (value) => {
            if (effectiveMaxLength && value.length > effectiveMaxLength) {
              return `This field must be less than ${effectiveMaxLength} characters`;
            }
            return true;
          } }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              editable={!disabled}
              style={[
                styles.input,
                isTextArea && styles.textArea,
                isError && styles.inputError,
                disabled && styles.disabledLabel,
              ]}
              placeholder={placeholder}
              value={
                currentValue && currentValue?.length > 0 ? currentValue : value
              }
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              placeholderTextColor="#9CA3AF"
              multiline={isTextArea}
              numberOfLines={isTextArea ? 4 : 1}
              textAlignVertical={isTextArea ? "top" : "center"}
              // maxLength={effectiveMaxLength}
            />
          )}
        />

        {isError && errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  disabledLabel: {
    backgroundColor: "#F9FAFB",
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: "#18191A",
  },
  required: {
    color: "#EF4444",
    marginLeft: 2,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1F2937",
    height: 40,
  },
  textArea: {
    height: 122,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
});
