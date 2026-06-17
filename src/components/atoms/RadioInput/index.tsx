import React, { forwardRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { FONTS } from "@/constants/fonts";

interface RadioOption {
  label: string;
  value: string;
  details?: string;
  disabled?: boolean;
}

interface RadioInputProps {
  name: string;
  control: any;
  options: RadioOption[];
  required?: boolean;
  size?: "default" | "small";
}

const RadioInput = forwardRef<View, RadioInputProps>(
  ({ name, control, options, required = false, size = "default" }, ref) => {
    return (
      <Controller
        control={control}
        name={name}
        rules={{ required: required ? "This field is required" : false }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View ref={ref} style={styles.container}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radioOption,
                  option.disabled && styles.radioOptionDisabled,
                ]}
                onPress={() => !option.disabled && onChange(option.value)}
                disabled={option.disabled}
              >
                <View
                  style={[
                    styles.radioOuter,
                    value === option.value && styles.radioOuterSelected,
                    option.disabled && styles.radioOuterDisabled,
                  ]}
                >
                  {value === option.value && <View style={styles.radioInner} />}
                </View>
                <View>
                  <Text
                    style={[
                      size === "small" ? styles.smallLabel : styles.label,
                      option.disabled && styles.labelDisabled,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option?.details && (
                    <Text
                      style={[
                        styles.detailsText,
                        option.disabled && styles.labelDisabled,
                      ]}
                    >
                      {option?.details}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      />
    );
  }
);

RadioInput.displayName = "RadioInput";

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  radioOptionDisabled: {
    opacity: 0.5,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#6744FF",
  },
  radioOuterDisabled: {
    borderColor: "#E5E7EB",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#6744FF",
  },
  label: {
    fontSize: 14,
    color: "#18191A",
    fontFamily: FONTS.inter.medium,
  },
  labelDisabled: {
    color: "#9CA3AF",
  },
  smallLabel: {
    fontSize: 14,
    color: "#18191A",
    fontFamily: FONTS.inter.medium,
  },
  errorText: {
    color: "#EF4444",
    marginTop: 5,
  },
  detailsText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: FONTS.inter.medium,
  },
});

export default RadioInput;
