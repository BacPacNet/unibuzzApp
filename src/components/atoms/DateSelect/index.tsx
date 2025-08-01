import { format } from "date-fns";
import { NavArrowDown, Xmark } from "iconoir-react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";

interface SelectInputProps {
  label?: string;
  placeholder: string;
  name: string;
  control: any;
  required?: boolean;
  isLabelShown?: boolean;
  rules?: object;
  currDob?: string;
  onChange?: (value: string) => void;
}

export function DateSelect({
  label,
  placeholder,
  isLabelShown = true,
  name,
  control,
  required = false,
  rules,
  currDob = "",
  onChange,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);

  const formatDate = (date: any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Parse the current DOB properly
  const parseCurrentDob = () => {
    if (!currDob) return null;
    
    try {
      // If currDob is already a date string in dd/MM/yyyy format
      if (currDob.includes("/")) {
        const [day, month, year] = currDob.split("/");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      
      // If currDob is a timestamp
      if (!isNaN(Number(currDob))) {
        return new Date(Number(currDob));
      }
      
      // Try to parse as ISO string
      const parsed = new Date(currDob);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
      
      return null;
    } catch (error) {
      console.log("Error parsing currDob:", error);
      return null;
    }
  };

  const currentDobDate = parseCurrentDob();
  const dateOfBirth = currentDobDate ? format(currentDobDate, "dd/MM/yyyy") : null;


  
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
        render={({
          field: { onChange: formOnChange, value },
          fieldState: { error },
        }) => {
          return (
            <>
              <TouchableOpacity
                style={[styles.selectButton, error && styles.selectButtonError]}
                onPress={() => setOpen(true)}
              >
                <Text style={[styles.selectText, !value && styles.placeholder]}>
                  {!!value && typeof value == "object"
                    ? formatDate(new Date(value))
                    : currDob?.length
                      ? dateOfBirth
                      : placeholder}
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

              <DatePicker
                modal
                open={open}
                date={
                  currentDobDate || new Date()
                }
                mode={"date"}
                onConfirm={(date: any) => {
                  setOpen(false);
                  formOnChange(format(new Date(date), "dd/MM/yyyy"));
                  onChange?.(format(new Date(date), "dd/MM/yyyy"));
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
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
    fontSize: 14,
    color: "#1F2937",
  },
});
