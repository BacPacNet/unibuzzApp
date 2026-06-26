import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavArrowDown } from "iconoir-react-native";
import DropdownWrapper from "@/components/molecules/SelectDropDownWrapper";
import { FONTS } from "@/constants/fonts";
import {
  POST_VISIBILITY_LABELS,
  UserPostType,
} from "@/types/constant";

interface PostVisibilityDropdownProps {
  value: UserPostType;
  onChange: (value: UserPostType) => void;
  options: UserPostType[];
}

const PostVisibilityDropdown = ({
  value,
  onChange,
  options,
}: PostVisibilityDropdownProps) => {
  return (
    <DropdownWrapper
      position="bottom"
      extraBottom={0}
      viewTopPosition={-50}
      renderDropdown={(closeDropdown) => (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => {
                onChange(option);
                closeDropdown();
              }}
            >
              <Text style={styles.optionText}>
                {POST_VISIBILITY_LABELS[option]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    >
      <TouchableOpacity style={styles.trigger}>
        <Text style={styles.triggerText}>
          Visibility: {POST_VISIBILITY_LABELS[value]}
        </Text>
        <NavArrowDown width={16} height={16} strokeWidth={2} color="#6744FF" />
      </TouchableOpacity>
    </DropdownWrapper>
  );
};

export default PostVisibilityDropdown;

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F3F2FF",
    borderRadius: 360,
  },
  triggerText: {
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
    color: "#6744FF",

  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: 140,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#404040",
  },
});
