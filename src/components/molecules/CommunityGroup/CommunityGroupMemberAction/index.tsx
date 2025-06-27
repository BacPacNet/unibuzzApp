import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { EyeSolid, User, XmarkCircleSolid } from "iconoir-react-native";

export default function MemberActions({
  handleRemoveClick,
  _id,
  handleFollowClick,
  isFollowing,
  handleNavigate,
}: {
  handleRemoveClick: (id: string) => void;
  _id: string;
  handleFollowClick: (id: string) => void;
  isFollowing: boolean;
  handleNavigate: (id: string) => void;
}) {
  return (
    <View style={styles.container}>
      {/* Follow Member */}
      {!isFollowing && (
        <TouchableOpacity
          onPress={() => handleFollowClick(_id)}
          style={styles.actionRow}
        >
          <Text style={[styles.text, { color: "#6C63FF" }]}>Follow Member</Text>
          <User color="#6C63FF" width={20} height={20} />
        </TouchableOpacity>
      )}

      <View style={styles.divider} />

      {/* View Profile */}
      <TouchableOpacity
        onPress={() => handleNavigate(_id)}
        style={styles.actionRow}
      >
        <Text style={styles.text}>View Profile</Text>
        <EyeSolid color="#555" width={20} height={20} />
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Remove Member */}
      <TouchableOpacity
        style={styles.actionRow}
        onPress={() => handleRemoveClick(_id)}
      >
        <Text style={[styles.text, { color: "#FF4D4D" }]}>Remove Member</Text>
        <XmarkCircleSolid color="#FF4D4D" width={20} height={20} />
      </TouchableOpacity>
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
