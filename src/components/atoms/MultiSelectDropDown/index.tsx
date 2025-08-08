import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FlatList } from "react-native-actions-sheet";
import { CheckSquareSolid, Search } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";
interface MultiSelectDropdownProps {
  options: string[];
  onChange: (value: string[]) => void;
  value: string[];
  placeholder?: string;
  search?: boolean;
  err: boolean;
  showIcon?: boolean;
  label?: string;
  isStatus?: boolean;
  variant?: "primary" | "default";
  filteredCount?: any;
  multiSelect?: boolean;
  disabled?: boolean;
  parentCategory?: string[];
  setErr?: (value: boolean) => void;
  setCityOptions?: any;
}

const MultiSelectDropdown = ({
  options,
  onChange,
  value,
  placeholder = "Select",
  search = false,
  err,
  label,
  multiSelect = true,
  parentCategory,
  disabled = false,
  setErr,
}: MultiSelectDropdownProps) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [searchInput, setSearchInput] = useState("");
  let bouncyCheckboxRef: any = null;
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(searchInput.toLowerCase()),
      );
      setFilteredOptions(filtered);
    }
  }, [searchInput, options]);

  const handleSelect = (optionValue: string) => {
    if (disabled) {
      setErr?.(true);
      return;
    }

    if (!multiSelect) {
      onChange([optionValue]);
    } else if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const renderOption = ({ item }: { item: string }) => {
    const isSelected = value.includes(item);
    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.optionSelected]}
        onPress={() => handleSelect(item)}
      >
        <Text style={styles.optionText}>{item}</Text>
        {multiSelect && (
          <View className="flex justify-center items-center">
            <View style={styles.checkboxBox}>
              {isSelected && (
                <CheckSquareSolid width={20} height={20} color="#6744FF" />
              )}
            </View>
            {/* <BouncyCheckbox
              ref={bouncyCheckboxRef}
              size={25}
              fillColor="blue"
              unFillColor="#FFFFFF"
              text="Click Me"
              iconStyle={{ borderColor: "blue" }}
              innerIconStyle={{ borderWidth: 2 }}
              isChecked={isSelected}
              useBuiltInState={false}
              //   onPress={handleClick}
              style={{ height: 24 }}
              bounceEffectIn={1}
              bounceEffectOut={1}
            /> */}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {search && (
        <View className="   relative  w-full">
          <Search
            style={{ top: 10, right: 10, position: "absolute" }}
            width={20}
            height={20}
            color={"#242526"}
            className="  z-30"
          />
          <TextInput
            placeholder="Search..."
            value={searchInput}
            onChangeText={setSearchInput}
            style={styles.searchInput}
          />
        </View>
      )}

      <FlatList
        data={filteredOptions}
        keyExtractor={(item) => item}
        renderItem={renderOption}
        style={styles.optionsList}
        maxToRenderPerBatch={20}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 12,
    paddingTop: 36,
    paddingHorizontal:32,
    height: "100%",
    gap: 8,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  parentCategory: {
    marginVertical: 4,
    padding: 6,
    borderRadius: 8,
    borderColor: "#0066CC",
    borderWidth: 1,
  },
  parentText: {
    color: "#0066CC",
    fontSize: 12,
  },
  dropdownBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  errorBorder: {
    borderColor: "red",
  },
  placeholder: {
    color: "#666",
    fontSize: 14,
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066CC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  selectedText: {
    color: "white",
    marginRight: 4,
    fontSize: 12,
  },
  searchInput: {
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    // paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 35,
    // marginVertical: 10,
    height: 40,
  },
  optionsList: {
    minHeight: 200,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  optionText: {
    color: "#3A3B3C",
    fontSize: 14,
    fontWeight: 500,
    fontFamily:FONTS.inter.medium
  },
  optionSelected: {
    // backgroundColor: "#f0f0f0",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: "#0066CC",
  },

  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});

export default MultiSelectDropdown;
