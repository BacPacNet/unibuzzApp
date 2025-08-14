import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Controller } from "react-hook-form";
import { Eye, EyeClosed } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";

interface PasswordInputProps {
  label?: string;
  placeholder: string;
  name: string;
  control: any;
  rules?: object;
  isError?: boolean;
  errorMessage?: string;
  isLabelShown?: boolean;
  required?: boolean;
  isPasswordStrengthVisible?: boolean;
  isInfoVisible?: boolean;
}

export function FormInputPassword({
  label,
  placeholder,
  name,
  control,
  rules,
  isError,
  errorMessage,
  isLabelShown = true,
  required = false,
  isPasswordStrengthVisible = true,
  isInfoVisible = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  return (
    <View style={styles.container}>
      {isLabelShown && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={placeholder}
              secureTextEntry={!showPassword}
              value={value}
              onChangeText={(val) => {
                setPassword(val);
                onChange(val);
              }}
              style={[styles.input, isError && styles.inputError]}
              placeholderTextColor="#9CA3AF"
            />
          )}
        />

        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.eyeIcon}
        >
          {showPassword ? (
            <Eye height={30} width={30} color={"#d4d4d4"} />
          ) : (
            <EyeClosed height={30} width={30} color={"#d4d4d4"} />
          )}
        </TouchableOpacity>
      </View>

      {isPasswordStrengthVisible && (
        <View style={styles.strengthBarContainer}>
          {[1, 2, 3, 4].map((item) => (
            <View
              key={item}
              style={[
                styles.strengthBar,
                {
                  backgroundColor:
                    passwordStrength >= item ? "#22C55E" : "#E5E7EB",
                },
              ]}
            />
          ))}
        </View>
      )}
      {isInfoVisible && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special
            (!@#$%^&*).
          </Text>
        </View>
      )}

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
    fontFamily: FONTS.inter.medium,
    color: "#3A3B3C",
  },
  required: {
    color: "#EF4444",
    marginLeft: 2,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
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
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 8,
  },
  strengthBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoText: {
    color: "#6B7280",
    fontSize: 12,
    fontFamily: FONTS.inter.regular,
  },
});
