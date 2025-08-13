import { FONTS } from "@/constants/fonts";
import { Controller } from "react-hook-form";
import { Text, TextInput, View, StyleSheet, PixelRatio } from "react-native";

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
}

export function FormInput({
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
}: FormInputProps) {
  return (
    <View style={styles.container}>
      {isLabelShown && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
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
          />
        )}
      />

      {isError && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
}

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
    color: "#3A3B3C",
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
