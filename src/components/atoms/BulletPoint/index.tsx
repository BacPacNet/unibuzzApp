import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BulletPoint = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>
    <Text style={styles.bullet}>{"\u2022"}</Text>
    <Text style={styles.text}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingRight: 12,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: 6,
    fontWeight: 700,
    color: "#3A3B3C",
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
});

export default BulletPoint;
