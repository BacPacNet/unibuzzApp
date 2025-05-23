import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Xmark } from "iconoir-react-native";

interface Props {
  selectedItem: string[];
  onRemove: (userId: string) => void;
  variant?: "primary" | "border";
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
            variant === "border" ? styles.borderChip : styles.primaryChip,
          ]}
        >
          <Text
            style={[
              styles.filterChipText,
              variant === "border" ? styles.borderText : styles.primaryText,
            ]}
          >
            {item}
          </Text>
          <Xmark
            onPress={() => onRemove(item)}
            width={24}
            height={24}
            color={variant === "border" ? "#6744FF" : "#fff"}
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
    marginVertical: 8,
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
    color: "#6744FF",
  },
  primaryText: {
    color: "#fff",
  },
});

export default SelectedChip;
