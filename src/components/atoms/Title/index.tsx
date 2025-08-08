import React, { ReactNode, HTMLAttributes } from "react";
import { StyleSheet, Text } from "react-native";
import { FONTS } from "../../../constants/fonts";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  height?: number;
}

export default function Title({ children, className = "", height }: TitleProps) {
  return (
    <Text style={[styles.title, height ? { height } : undefined]} className={` ${className}`}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.poppins.bold,
    fontSize: 28,
    color: "#3A3B3C",

  },
});
