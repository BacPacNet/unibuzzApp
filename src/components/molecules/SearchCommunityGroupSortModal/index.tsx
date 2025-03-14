import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  setModalVisible: (value: boolean) => void;
  setSort: (value: string) => void;
  modalVisible: boolean;
  label: string;
  currSortValue: string;
};

const sortOptions = {
  name: "Alphabetic",
  latest: "Date Created",
  users: "User Count Descending",
  //   oldest: "User Count Ascending",
  oldest: "Oldest",
};

const SearchCommunityGroupShortModal = ({
  modalVisible,
  setModalVisible,
  label,
  setSort,
  currSortValue,
}: Props) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}> {label} By</Text>
          </View>
          <View style={styles.optionContainer}>
            {Object.entries(sortOptions).map(([key, value]) => (
              <TouchableOpacity
                onPress={() => setSort(key)}
                style={styles.optionHolder}
              >
                <Text key={key} style={styles.OptionText}>
                  {value}
                </Text>
                <View
                  style={[
                    styles.radioOuter,
                    key === currSortValue && styles.radioOuterSelected,
                  ]}
                >
                  {key === currSortValue && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default SearchCommunityGroupShortModal;

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

  placeholder: {
    color: "#9CA3AF",
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
    fontSize: 20,
    fontWeight: "500",

    color: "#3A3B3C",
  },
  optionContainer: {
    padding: 16,
    display: "flex",
    gap: 10,
  },
  optionHolder: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  OptionText: {
    color: "#242526",
    fontSize: 12,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#9685FF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#9685FF",
  },
});
