import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface CardProps {
  children: ReactNode;
  className?: string; // Optional className for additional styling
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    borderRadius: 8, // Optional: Rounded corners
  },
});

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <View
      style={[styles.card]}
      className={`bg-white p-4 rounded-lg shadow-md ${className}`}
    >
      {children}
    </View>
  );
};

export default Card;
