import {
  ArrowDown,
  NavArrowDown,
  UserBadgeCheck,
  UserCircle,
  Xmark,
} from "iconoir-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SelectInputProps {
  label?: string;
  placeholder: string;
  options: string[];
  name: string;
  control: any;
  required?: boolean;
  isLabelShown?: boolean;
  rules?: object;
  search?: boolean;
  showLabel?: boolean;
  onChange?: (value: string) => void;
  desc?: string;
  isMarginBottom?: boolean;
}

const icons = [UserCircle, UserBadgeCheck];

export function SelectInputWithSearch({
  label,
  isLabelShown = true,
  placeholder,
  options,
  name,
  control,
  required = false,
  rules,
  search = false,
  showLabel = false,
  onChange,
  desc,
  isMarginBottom = true,
}: SelectInputProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const searchRef = useRef<TextInput>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleSearch = (text: string) => {
    setFilteredOptions(
      text === ""
        ? options
        : options.filter((option) =>
            option.toLowerCase().includes(text.toLowerCase())
          )
    );
  };

  return (
    <View style={[isMarginBottom && styles.container]}>
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
        render={({
          field: { onChange: formOnChange, value },
          fieldState: { error },
        }) => {
          return (
            <>
              <TouchableOpacity
                style={[styles.selectButton, error && styles.selectButtonError]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={[styles.selectText, !value && styles.placeholder]}>
                  {value ? value : placeholder}
                </Text>
                {value ? (
                  <Xmark
                    width={20}
                    height={20}
                    onPress={() => {
                      formOnChange("");
                      onChange?.("");
                    }}
                    color="#9CA3AF"
                  />
                ) : (
                  <NavArrowDown width={20} height={20} color="#9CA3AF" />
                )}
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
                      {showLabel && (
                        <Text style={styles.modalTitle}>Select {label}</Text>
                      )}
                      {search && (
                        <View>
                          <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            onChangeText={handleSearch}
                            ref={searchRef}
                          />
                          <Text style={styles.desc}>{desc}</Text>
                        </View>
                      )}
                    </View>
                    <FlatList
                      data={filteredOptions}
                      keyExtractor={(item) => item}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          style={[
                            styles.optionItem,
                            item === value && styles.selectedOption,
                          ]}
                          onPress={() => {
                            formOnChange(item);
                            onChange?.(item);
                            setModalVisible(false);
                          }}
                        >
                          <Text style={styles.optionText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      maxToRenderPerBatch={10}
                      initialNumToRender={10}
                      windowSize={5}
                      ListEmptyComponent={
                        <Text style={styles.emptyText}>No Result Found</Text>
                      }
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "#6B7280",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  selectButtonError: {
    borderColor: "#EF4444",
  },
  selectText: {
    fontSize: 14,
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
    minHeight: 550,
    paddingHorizontal: 8,
  },
  modalHeader: {
    padding: 16,
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
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
    color: "#1F2937",
    lineHeight: 16,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  desc: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left",
    color: "#6B7280",
    lineHeight: 16,
    marginTop: 8,
  },
});
