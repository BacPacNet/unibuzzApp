import React, { ReactNode, HTMLAttributes } from "react";
import { Text } from "react-native";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export default function SupportingText({
  children,
  className = "",
}: TitleProps) {
  return (
    <Text className={`text-xs  text-neutral-500 ${className}`}>{children}</Text>
  );
}
