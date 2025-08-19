import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Xmark } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";

interface Props {
  selectedItem: string[];
  onRemove: (userId: string) => void;
  variant?: "primary" | "border" | "neutral-border";
}

const SelectedChip: React.FC<Props> = ({
  selectedItem,
  onRemove,
  variant = "primary",
}) => {
  if (!selectedItem?.length) return <View />;

  return (
    <View style={styles.filterChipContainer}>
      {selectedItem.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.filterChip,
            variant === "border"
              ? styles.borderChip
              : variant === "neutral-border"
                ? styles.neutralBorderChip
                : styles.primaryChip,
          ]}
        >
          <Text
            style={[
              styles.filterChipText,
              variant === "border"
                ? styles.borderText
                : variant === "neutral-border"
                  ? styles.neutralBorderText
                  : styles.primaryText,
            ]}
          >
            {item}
          </Text>
          <Xmark
            onPress={() => onRemove(item)}
            width={24}
            height={24}
            color={
              variant === "border"
                ? "#6744FF"
                : variant === "neutral-border"
                  ? "#9CA3AF"
                  : "#fff"
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filterChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
    height: 28,
    // marginVertical: 8,
  },
  primaryChip: {
    borderColor: "#6744FF",
    backgroundColor: "#6647FF",
  },
  borderChip: {
    borderColor: "#6744FF",
    backgroundColor: "#fff",
  },
  filterChipText: {
    marginRight: 4,
  },
  borderText: {
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
    color: "#6744FF",
  },
  primaryText: {
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
    color: "#fff",
  },
  neutralBorderChip: {
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    height: 28,
  },
  neutralBorderText: {
    color: "#242526",
  },
});

export default SelectedChip;
