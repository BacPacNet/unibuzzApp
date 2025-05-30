import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  setModalVisible: (value: boolean) => void;
  modalVisible: boolean;
  onLeave: () => void;
  onEdit?: () => void;
  isAdmin: boolean;
};

const CommunityGroupActionModal = ({
  modalVisible,
  setModalVisible,
  onLeave,
  onEdit,
  isAdmin,
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
          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={onLeave} style={styles.optionHolder}>
              <Text style={styles.optionText}>Leave</Text>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity onPress={onEdit} style={styles.optionHolder}>
                <Text style={styles.optionText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CommunityGroupActionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "40%",
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
    paddingVertical: 12,
  },
  optionText: {
    color: "#242526",
    fontSize: 16,
  },
});
