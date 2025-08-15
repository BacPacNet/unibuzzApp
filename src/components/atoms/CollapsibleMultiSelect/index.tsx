import { FONTS } from "@/constants/fonts";
import { Check, NavArrowDown, NavArrowUp } from "iconoir-react-native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  title: string;
  options: string[];
  selectedOptions: string[];
  onSelect: any;
  handleSelectAll?: any;
};

const CollapsibleMultiSelect = ({
  title,
  options,
  selectedOptions,
  onSelect,
  handleSelectAll,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleSection = () => setExpanded(!expanded);
  const toggleOption = (option: any) => {
    onSelect(option);
  };

  const handleSelectAllOptions = () => {
    setExpanded(true);
    handleSelectAll();
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={[styles.sectionHeader]} onPress={toggleSection}>
        <View style={styles.checkboxContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {expanded ? (
          <NavArrowUp width={20} height={20} color="#6B7280" />
        ) : (
          <NavArrowDown width={20} height={20} color="#6B7280" />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.sectionContent}>
          {options.map((option: any) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => toggleOption(option)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedOptions.includes(option) && styles.checkboxSelected,
                ]}
              >
                {selectedOptions.includes(option) && (
                  <Check
                    width={12}
                    height={12}
                    color={"white"}
                    strokeWidth={4}
                  />
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    // paddingHorizontal: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: "#E5E7EB",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxSelected: {
    backgroundColor: "#6C5CE7",
    // borderColor: "#6C5CE7",
    borderWidth: 0,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#3A3B3C",
    lineHeight: 20,
    fontFamily: FONTS.inter.semiBold,
  },
  sectionContent: {
    // marginTop: 16,
    paddingBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
  },
  optionText: {
    fontSize: 12,
    color: "#3A3B3C",
    fontFamily: FONTS.inter.medium,
  },
});

export default CollapsibleMultiSelect;
