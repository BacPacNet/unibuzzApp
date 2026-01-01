import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ReusableButton from "@/components/atoms/ReusableButton";

interface BlockUserBottomSheetProps {
  onConfirm: () => void;
  pending?: boolean;
  closeBottomSheet: () => void;
}

const BlockUserBottomSheet: React.FC<BlockUserBottomSheetProps> = ({
  onConfirm,
  pending = false,
  closeBottomSheet,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Block User</Text>

      <View style={styles.content}>
        <Text style={styles.description}>
          What happens when you block a user:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            • They can’t interact with you. No posts, DMs, invitations, or
            searches.
          </Text>
          <Text style={styles.listItem}>
            • Their past content will appear as “deleted.”
          </Text>
          <Text style={styles.listItem}>
            • If they’re an admin of any group you’re in, you’ll be removed from
            that group.
          </Text>
          <Text style={styles.listItem}>
            • If they’re part of groups you are admin of, they will be removed.
          </Text>
          <Text style={styles.listItem}>
            • You can unblock them anytime in your settings.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <ReusableButton
          variant="danger"
          height="large"
          size={"w-1/2"}
          onPress={onConfirm}
          disabled={pending}
          isLoading={pending}
          buttonText={pending ? "Blocking..." : "Block User"}
        />

        <ReusableButton
          variant="shade"
          height="large"
          size={"w-1/2"}
          onPress={closeBottomSheet}
          disabled={pending}
          buttonText="Cancel"
        />
      </View>
    </View>
  );
};

export default BlockUserBottomSheet;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#404040",
    textAlign: "center",
    marginBottom: 24,
  },
  content: {
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: "#525252",
    marginBottom: 12,
  },
  list: {
    paddingLeft: 8,
  },
  listItem: {
    fontSize: 14,
    fontWeight: "600",
    color: "#404040",
    marginBottom: 8,
    lineHeight: 20,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
});
