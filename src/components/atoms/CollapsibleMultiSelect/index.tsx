import {
  CheckSquare,
  CheckSquareSolid,
  NavArrowDown,
  NavArrowUp,
} from "iconoir-react-native";
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
    <View>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggleSection}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => handleSelectAllOptions()}
            style={styles.optionRow}
          >
            <View
              style={[
                styles.checkbox,
                selectedOptions?.length > 0 && styles.checkboxSelected,
              ]}
            >
              {selectedOptions?.length > 0 && (
                <CheckSquare
                  width={20}
                  height={20}
                  color="white"
                  fill="#6C5CE7"
                />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {expanded ? (
          <NavArrowUp width={24} height={24} color="#000" />
        ) : (
          <NavArrowDown width={24} height={24} color="#000" />
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
                  <CheckSquare
                    width={20}
                    height={20}
                    color="white"
                    fill="#6C5CE7"
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxSelected: {
    // backgroundColor: "#6C5CE7",
    // borderColor: "#6C5CE7",
    borderWidth: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3A3B3C",
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CollapsibleMultiSelect;
