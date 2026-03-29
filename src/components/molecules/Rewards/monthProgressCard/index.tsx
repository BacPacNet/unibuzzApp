import { FONTS } from "@/constants/fonts";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PRIMARY = "#6744FF";

type Props = {
  monthProgress: number;
  monthEarnings: number;
};

const MonthProgressCard = ({ monthProgress, monthEarnings }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Progress</Text>
        <Text style={styles.value}>{monthProgress} Invites</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Earnings</Text>
        <Text style={styles.value}>₹{monthEarnings}</Text>
      </View>
    </View>
  );
};

export default MonthProgressCard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    gap: 48,
    alignItems: "center",
  },
  section: {
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
  },
  value: {
    fontSize: 24,
    fontFamily: FONTS.poppins.extraBold,
    color: "#fff",
 
  },
});
