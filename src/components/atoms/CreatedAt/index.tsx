import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

import { format } from "date-fns";

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
  const formattedDate = useMemo(
    () => format(date as unknown as Date, "h:mm a · MMM d, yyyy"),
    [date],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {`${formattedDate} ${postSourceText ? ` ${postSourceText}` : ""}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  text: {
    color: "#6B7280",
    fontSize: 12,
  },
});
