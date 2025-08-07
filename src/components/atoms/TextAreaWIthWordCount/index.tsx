import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";

interface TextAreaWithWordCountProps {
  name: string;
  control: any;
  maxChars?: number;
  placeholder?: string;
  required?: boolean;
}

const TextAreaWithWordCount: React.FC<TextAreaWithWordCountProps> = ({
  name,
  control,
  maxChars = 50,
  placeholder = "Type here...",
  required = false,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? "This field is required" : false,
        validate: (value) => {
          const words = value?.trim();

          return words?.length == 0 || words == undefined
            ? "This field is required "
            : words?.length <= maxChars || `Max ${maxChars} Character allowed`;
        },
      }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        const words = value?.trim() || [];
        return (
          <View style={styles.container}>
            <TextInput
              style={[styles.textarea, error && styles.errorBorder]}
              multiline
              numberOfLines={4}
              onBlur={onBlur}
              //   onChangeText={onChange}
              onChangeText={(text) => {
                if (text.length <= maxChars) {
                  onChange(text);
                }
              }}
              value={value}
              placeholder={placeholder}
            />
            <Text style={styles.wordCount}>
              {words.length} / {maxChars}
            </Text>
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    maxHeight: 300,
    fontSize: 16,
    textAlignVertical: "top",
  },
  wordCount: {
    textAlign: "right",
    marginTop: 5,
    color: "#A3A3A3",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  errorBorder: {
    borderColor: "red",
  },
});

export default TextAreaWithWordCount;
