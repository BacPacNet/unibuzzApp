import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";

const CustomSwitch = ({ value, onValueChange, disabled }: any) => {
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

  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 14],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} disabled={disabled}>
      <View
        style={[
          styles.switchContainer,
          value && !disabled
            ? styles.activeColor
            : disabled
              ? styles.disabledColor
              : styles.defaultColor,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: thumbTranslate }],
              backgroundColor: value ? "white" : "#ccc",
            },
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
    padding: 1,
  },
  activeColor: {
    backgroundColor: "#6744FF",
  },
  defaultColor: {
    backgroundColor: "#F3F2FF",
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
