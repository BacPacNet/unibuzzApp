import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const DOT_COUNT = 3;
const DOT_SIZE = 6;
const DOT_SPACING = 8;
const ANIMATION_DURATION = 500;

const ThreeDotLoader = () => {
  const animations = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const createAnimation = (animatedValue: any, delay: any) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -6,
            duration: ANIMATION_DURATION,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const animatedSequences = animations.map((anim, index) =>
      createAnimation(anim, index * 150),
    );

    Animated.stagger(150, animatedSequences).start();
  }, []);

  return (
    <View style={styles.container}>
      {animations.map((translateY, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              transform: [{ translateY }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#6744FF",
    marginHorizontal: DOT_SPACING / 2,
  },
});

export default ThreeDotLoader;
