import React, { ReactNode, HTMLAttributes } from "react";
import { StyleSheet, Text } from "react-native";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export default function Title({ children, className = "" }: TitleProps) {
  return (
    <Text style={styles.title} className={` ${className}`}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "poppins",
    fontSize: 28,
    color: "#3A3B3C",
    fontWeight: 700,
  },
});
