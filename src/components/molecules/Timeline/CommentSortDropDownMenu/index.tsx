import { Sortby } from "@/types/constant";
import React from "react";
import { View, Text, TouchableOpacity, Share, StyleSheet } from "react-native";

const CommentSortDropDownMenu: React.FC<{
  handleSelect: (option: { value: string; label: string }) => void;
}> = ({ handleSelect }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.textContainer}
        onPress={() =>
          handleSelect({ value: Sortby.DESC, label: "Newest First" })
        }
      >
        <Text className="text-neutral-700 font-medium text-2xs">
          {" "}
          Newest First
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.textContainer}
        onPress={() =>
          handleSelect({ value: Sortby.ASC, label: "Oldest First" })
        }
      >
        <Text className="text-neutral-700 font-medium text-2xs">
          {" "}
          Oldest First
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommentSortDropDownMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: 144,
    height: 80,
  },
  textContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
