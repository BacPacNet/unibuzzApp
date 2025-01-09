import React, { ReactNode, HTMLAttributes } from "react";
import { Text } from "react-native";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export default function Title({ children, className = "" }: TitleProps) {
  return (
    <Text className={`text-md font-bold text-neutral-900 ${className}`}>
      {children}
    </Text>
  );
}
