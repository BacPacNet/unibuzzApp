import { Controller } from "react-hook-form";
import { Text, TextInput, View, StyleSheet } from "react-native";

interface FormInputProps {
  label: string;
  placeholder: string;
  required?: boolean;

  control: any;
  name: string;
  isError?: boolean;
  errorMessage?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

export function FormInput({
  label,
  placeholder,
  required = false,

  name,
  control,
  isError,
  errorMessage,
  secureTextEntry,
  keyboardType = "default",
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <Controller
        control={control}
        name={name}
        rules={{ required }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, isError && styles.inputError]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            placeholderTextColor="#9CA3AF"
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
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
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
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
});
