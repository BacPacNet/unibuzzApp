import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";

interface RadioOption {
  label: string;
  value: string;
  details?: string;
}

interface RadioInputProps {
  name: string;
  control: any;
  options: RadioOption[];
  required?: boolean;
}

const RadioInput: React.FC<RadioInputProps> = ({
  name,
  control,
  options,
  required = false,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.radioOption}
              onPress={() => onChange(option.value)}
            >
              <View
                style={[
                  styles.radioOuter,
                  value === option.value && styles.radioOuterSelected,
                ]}
              >
                {value === option.value && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.label}>{option.label}</Text>
                <Text>{option?.details}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#9685FF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#9685FF",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default RadioInput;
