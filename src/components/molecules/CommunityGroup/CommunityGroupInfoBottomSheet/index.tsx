import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Globe, Lock } from "iconoir-react-native";

const CommmunityGroupInfo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Private and Public Groups</Text>

      <View style={styles.groupItem}>
        <Globe width={24} height={24} color="#8B5CF6" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Public</Text>
          <Text style={styles.description}>
            All users can join these groups without requesting permission.
            Labeled with globe icon.
          </Text>
        </View>
      </View>

      <View style={styles.groupItem}>
        <Lock width={24} height={24} color="#8B5CF6" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Private</Text>
          <Text style={styles.description}>
            Must request access to join the group. Only verified users can
            request access. Labeled with lock icon.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#3A3B3C",
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
    color: "#3A3B3C",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});

export default CommmunityGroupInfo;
