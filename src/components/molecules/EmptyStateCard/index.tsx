import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";

interface EmptyStateCardProps {
  SvgComponent: React.FC<SvgProps>;
  imageWidth?: number;
  imageHeight?: number;
  title: React.ReactNode;
  description: string;
}

const EmptyStateCard = ({
  SvgComponent,
  imageWidth = 250,
  imageHeight = 171,
  title,
  description,
}: EmptyStateCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <SvgComponent width={imageWidth} height={imageHeight} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginVertical: 8,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#3A3B3C",
  },
  description: {
    paddingTop: 8,
    fontSize: 16,
    fontWeight: "400",
    color: "#3A3B3C",
    textAlign: "center",
  },
});

export default EmptyStateCard;
