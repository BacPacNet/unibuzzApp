import { FONTS } from "@/constants/fonts";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Option<T> = {
  label: string;
  value: T;
  content?: React.ReactNode;
};

type Props<T> = {
  options: Option<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  disabled?: boolean;
  optionsGap?: number;
};

function ExpandableRadioGroup<T extends string | number>({
  options,
  selectedValue,
  onSelect,
  disabled = false,
  optionsGap = 16,
}: Props<T>) {
  const handlePress = (value: any) => {
    if (!disabled) {
      onSelect(selectedValue === value ? null : value);
    }
  };

  return (
    <View style={{ gap: optionsGap }}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <View key={option.value.toString()} style={{ gap: 8 }}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => handlePress(option.value)}
              disabled={disabled}
            >
              <View style={styles.radio}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>

            {isSelected && option.content && (
              <View style={styles.expandContent}>{option.content}</View>
            )}
          </View>
        );
      })}
    </View>
  );
}

export default ExpandableRadioGroup;

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6744FF",
  },
  optionLabel: {
    fontSize: 18,
    color: "#3A3B3C",
    fontFamily: FONTS.inter.semiBold,
  },
  expandContent: {
    // marginLeft: 28,
    marginTop: 4,
  },
});
