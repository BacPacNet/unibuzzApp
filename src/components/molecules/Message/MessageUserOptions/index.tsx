import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { EyeSolid, LogIn, User, XmarkCircleSolid } from "iconoir-react-native";

export default function MessageUserOptions({
  navigateToEditGroup,
  handleLeaveGroup,
  isAdmin,
  handleNavigate,
  isGroupChat = false,
  isBlockedByYou = false,
  handleToggleBlockMessage,
  handleDeleteGroup,
  handleNavigateToProfile,
}: {
  navigateToEditGroup: () => void;
  handleLeaveGroup: () => void;
  handleNavigateToProfile: () => void;
  _id?: string;

  isAdmin: boolean;
  handleNavigate: () => void;
  isGroupChat: boolean;
  isBlockedByYou: boolean;
  handleToggleBlockMessage: () => void;
  handleDeleteGroup: () => void;
}) {
  return (
    <View style={styles.container}>
      {/* Follow Member */}
      {!isGroupChat && (
        <TouchableOpacity
          onPress={() => handleNavigateToProfile()}
          style={styles.actionRow}
        >
          <Text style={[styles.text]}>View Profile</Text>
          <User color="#6C63FF" width={20} height={20} />
        </TouchableOpacity>
      )}
      {/* {!isGroupChat && (
        <TouchableOpacity
          onPress={() => handleToggleBlockMessage()}
          style={styles.actionRow}
        >
          <Text style={[styles.text]}>
            {" "}
            {isBlockedByYou ? "Unblock Messages" : "Block Messages"}
          </Text>
          <LogIn color="#FF4D4D" width={20} height={20} />
        </TouchableOpacity>
      )} */}
      {isAdmin && isGroupChat && (
        <TouchableOpacity
          onPress={() => navigateToEditGroup()}
          style={styles.actionRow}
        >
          <Text style={[styles.text, { color: "#6C63FF" }]}>
            Edit Group chat
          </Text>
          <User color="#6C63FF" width={20} height={20} />
        </TouchableOpacity>
      )}

      <View style={styles.divider} />

      {/* View Profile */}
      {isGroupChat && (
        <TouchableOpacity
          onPress={() => handleNavigate()}
          style={styles.actionRow}
        >
          <Text style={styles.text}>View Member</Text>
          <EyeSolid color="#555" width={20} height={20} />
        </TouchableOpacity>
      )}
      <View style={styles.divider} />

      {/* Remove Member */}
      {isGroupChat && !isAdmin && (
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => handleLeaveGroup()}
        >
          <Text style={[styles.text, { color: "#FF4D4D" }]}>Leave Chat</Text>
          <LogIn color="#FF4D4D" width={20} height={20} />
        </TouchableOpacity>
      )}
      {isGroupChat && isAdmin && (
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => handleDeleteGroup()}
        >
          <Text style={[styles.text, { color: "#FF4D4D" }]}>Delete Chat</Text>
          <LogIn color="#FF4D4D" width={20} height={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
});
