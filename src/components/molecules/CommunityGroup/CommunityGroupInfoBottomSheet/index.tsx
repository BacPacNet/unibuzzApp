import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { renderGroupAccessIcon } from "../GroupAccessInfoTrigger";

type Props = {
  title?: string;
  description?: string;
  communityGroupAccess?: string;
  icon?: React.ReactNode;
};

const CommmunityGroupInfo: React.FC<Props> = ({
  title = "Open Campus",
  description = "Open to university members and external users.",
  communityGroupAccess,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Group Access</Text>

      <View style={styles.groupItem}>
        {icon ?? (
          <View style={styles.icon}>
            {renderGroupAccessIcon(communityGroupAccess)}
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
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
