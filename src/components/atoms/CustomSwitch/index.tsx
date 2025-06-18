import React, { useState, useRef } from "react";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";

const CustomSwitch = ({ value, onValueChange }: any) => {
  const thumbAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const toggleSwitch = () => {
    const newValue = !value;
    Animated.timing(thumbAnim, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onValueChange(newValue);
  };

  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <View
        style={[
          styles.switchContainer,
          value ? styles.activeColor : styles.defaultColor,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: thumbTranslate }],
              backgroundColor: value ? "white" : "#ccc",
            },
            value ? styles.thumbActive : styles.thumbInactive,
          ]}
        />
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
    padding: 2,
  },
  activeColor: {
    backgroundColor: "#6744FF",
  },
  defaultColor: {
    backgroundColor: "#F3F2FF",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  thumbActive: {
    backgroundColor: "white",
  },
  thumbInactive: {
    backgroundColor: "#ccc",
  },
});

export default CustomSwitch;
