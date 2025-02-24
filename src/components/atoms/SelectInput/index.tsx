"use client";

import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { ArrowDown } from "iconoir-react-native";
import { type Control, Controller } from "react-hook-form";
import type { editProfileInputs, GenderOptions } from "@/types/Profile";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface SelectInputProps {
  label: string;
  placeholder: string;
  options: string[];
  name: keyof editProfileInputs;
  control: Control<editProfileInputs>;
  required?: boolean;
  rules?: object;
}

export function SelectInput({
  label,
  placeholder,
  options,
  name,
  control,
  required = false,
  rules,
}: SelectInputProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const selectedOption = options.find((option) => option === value);

          return (
            <>
              <TouchableOpacity
                style={[styles.selectButton, error && styles.selectButtonError]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={[styles.selectText, !value && styles.placeholder]}>
                  {selectedOption ? selectedOption : placeholder}
                </Text>
                <ArrowDown width={20} height={20} color="#9CA3AF" />
              </TouchableOpacity>

              {error && <Text style={styles.errorText}>{error.message}</Text>}
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setModalVisible(false)}
                >
                  <TouchableOpacity
                    style={styles.modalContent}
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                  >
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Select {label}</Text>
                    </View>
                    <FlatList
                      data={options}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.optionItem,
                            item === value && styles.selectedOption,
                          ]}
                          onPress={() => {
                            onChange(item);
                            setModalVisible(false);
                          }}
                        >
                          <Text style={styles.optionText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>
            </>
          );
        }}
      />
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
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
  },
  selectButtonError: {
    borderColor: "#EF4444",
  },
  selectText: {
    fontSize: 16,
    color: "#1F2937",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#1F2937",
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  selectedOption: {
    backgroundColor: "#F3F4F6",
  },
  optionText: {
    fontSize: 16,
    color: "#1F2937",
  },
});
