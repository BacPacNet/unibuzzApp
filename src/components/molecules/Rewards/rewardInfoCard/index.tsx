import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  Icon: React.ComponentType<any>;
  title: string;
  description: string;
};

const RewardInfoCard = ({ Icon, title, description }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icon width={20} height={20} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

export default RewardInfoCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    alignItems: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    color: "#18191A",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 24,
  },
});
