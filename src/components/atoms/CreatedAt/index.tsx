import React from "react";
import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("en");

export function RenderCreatedAt({
  date,
  postSourceText = "",
}: {
  date?: string | Date;
  postSourceText?: string;
}) {
  if (!date || (typeof date !== "string" && !(date instanceof Date))) {
    console.warn("Invalid or undefined date input:", date);
    return null;
  }

  let formatted: any = "";

  try {
    const parsed = dayjs.utc(new Date(date)).local();

    if (!parsed.isValid()) {
      console.warn("Invalid date after parsing:", date);
      return null;
    }

    const timeStr = parsed.format("h:mm A");

    const dateStr = parsed.format("MMM, YYYY");
    formatted = `${timeStr} · ${dateStr} ·`;
  } catch (e: any) {
    console.warn("Error formatting date:", date, e?.message ?? String(e));
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {`${formatted} ${postSourceText ? ` ${postSourceText}` : ""}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  text: {
    color: "#a3a3a3",
  },
});
