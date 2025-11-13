import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface GenericInfoBottomSheetProps {
  title: string;
  description: string | React.ReactNode;
  subTitle?: string;
  listItems?: string[];
  buttonLabel: string;
  onButtonPress?: () => void;
}

const GenericInfoBottomSheet: React.FC<GenericInfoBottomSheetProps> = ({
  title,
  description,
  subTitle,
  listItems,
  buttonLabel,
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {typeof description === "string" ? (
        <Text style={styles.text}>{description}</Text>
      ) : (
        description
      )}

      {subTitle && <Text style={[styles.text, styles.bold]}>{subTitle}</Text>}

      {listItems && (
        <View style={styles.list}>
          {listItems.map((item, index) => (
            <Text key={index} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={onButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenericInfoBottomSheet;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    textAlign: "center",
    color: "#374151",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#374151",
  },
  bold: {
    fontWeight: "600",
  },
  list: {
    marginTop: 4,
  },
  listItem: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#6647FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
