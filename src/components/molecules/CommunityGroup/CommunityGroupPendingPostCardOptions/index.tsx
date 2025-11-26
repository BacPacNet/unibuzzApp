import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WarningTriangle, Crown, Xmark } from "iconoir-react-native";
import ReusableButton from "@/components/atoms/ReusableButton";

interface PendingPostCardOptionProps {
  variant?: "pending" | "rejected" | "review";
  title?: string;
  text: string;
  onAccept?: () => void;
  onReject?: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
}

const PendingPostCardOption: React.FC<PendingPostCardOptionProps> = ({
  variant = "pending",
  title,
  text,
  onAccept,
  onReject,
  acceptLabel = "Accept",
  rejectLabel = "Reject",
}) => {
  const variants = {
    pending: {
      wrapper: [styles.wrapper, styles.pendingWrapper],
      icon: <WarningTriangle width={20} height={20} color="#CA8A04" />,
      textColor: styles.pendingText,
    },
    rejected: {
      wrapper: [styles.wrapper, styles.rejectedWrapper],
      icon: <Xmark width={20} height={20} color="#DC2626" />,
      textColor: styles.rejectedText,
    },
    review: {
      wrapper: [styles.wrapper, styles.reviewWrapper],
      icon: <Crown width={20} height={20} color="#CA8A04" />,
      textColor: styles.reviewText,
    },
  };

  const style = variants[variant] || variants.pending;

  return (
    <View style={style.wrapper}>
      <View
        style={[
          styles.row,
          variant === "review" ? styles.alignStart : styles.alignCenter,
        ]}
      >
        {style.icon}
        <View style={styles.textContainer}>
          {title && (
            <Text style={[styles.title, style.textColor]}>{title}</Text>
          )}
          <Text style={[styles.bodyText, style.textColor]}>{text}</Text>

          {variant === "review" && (
            <View style={styles.buttonRow}>
              <ReusableButton
                buttonText={rejectLabel}
                onPress={onReject}
                variant="danger"
                size={"small"}
              />
              <ReusableButton
                buttonText={acceptLabel}
                onPress={onAccept}
                variant="primary"
                size={"small"}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    margin: 16,
    borderRadius: 6,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    columnGap: 12,
  },
  alignCenter: {
    alignItems: "center",
  },
  alignStart: {
    alignItems: "flex-start",
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontWeight: "500",
    fontSize: 12,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 10,
  },
  buttonRow: {
    flexDirection: "row",
    columnGap: 8,
    marginTop: 12,
  },

  pendingWrapper: {
    backgroundColor: "#FEF9C3",
    borderColor: "#FDE68A",
  },
  rejectedWrapper: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  reviewWrapper: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
  },

  pendingText: {
    color: "#854D0E",
  },
  rejectedText: {
    color: "#991B1B",
  },
  reviewText: {
    color: "#1F2937",
  },
});

export default PendingPostCardOption;
