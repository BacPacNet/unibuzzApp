import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Xmark } from "iconoir-react-native";

interface Props {
  selectedItem: string[];
  onRemove: (userId: string) => void;
}

const SelectedChip: React.FC<Props> = ({ selectedItem, onRemove }) => {
  if (!selectedItem?.length) return <View />;

  return (
    <View style={styles.filterChipContainer}>
      {selectedItem.map((item) => (
        <TouchableOpacity key={item} style={styles.filterChip}>
          <Text style={styles.filterChipText}>{item}</Text>
          <Xmark
            onPress={() => onRemove(item)}
            width={24}
            height={24}
            color="#fff"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filterChipContainer: {
    display: "flex",
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
    borderColor: "#6744FF",
    backgroundColor: "#6647FF",
    marginRight: 8,

    height: 28,
    width: "auto",
    marginVertical: 8,
  },
  filterChipText: {
    color: "white",
    marginRight: 4,
  },
});

export default SelectedChip;
