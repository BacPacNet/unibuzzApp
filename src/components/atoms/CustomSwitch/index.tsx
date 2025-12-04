import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: "default" | "small";
}

const CustomSwitch = ({
  value,
  onValueChange,
  disabled,
  size = "default",
}: CustomSwitchProps) => {
  const thumbAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    onValueChange(!value);
  };

  const isSmall = size === "small";
  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isSmall ? 12 : 14],
  });

  const containerStyle = [
    styles.switchContainer,
    isSmall && {
      width: 28,
      height: 16,
      borderRadius: 8,
    },
    value && !disabled
      ? styles.activeColor
      : disabled
        ? styles.disabledColor
        : styles.defaultColor,
  ];

  const thumbStyle = [
    styles.thumb,
    isSmall && {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    {
      transform: [{ translateX: thumbTranslate }],
      backgroundColor: value ? "white" : "#ccc",
    },
  ];

  return (
    <TouchableOpacity onPress={toggleSwitch} disabled={disabled}>
      <View style={containerStyle}>
        <Animated.View style={thumbStyle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 36,
    height: 22,
    borderRadius: 12,
    justifyContent: "center",
    padding: 1,
  },
  activeColor: {
    backgroundColor: "#6744FF",
  },
  defaultColor: {
    backgroundColor: "#E9E8FF",
  },
  disabledColor: {
    backgroundColor: "#B9B1FF",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default CustomSwitch;
