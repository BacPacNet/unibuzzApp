import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

interface FullScreenLoaderProps {
  message?: string;
  size?: number;
  progress?: number;
}

const FullScreenLoader = ({
  message = "Loading...",
  size = 80,
  progress = 100,
}: FullScreenLoaderProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <AnimatedCircularProgress
        size={size}
        width={8}
        duration={1000}
        fill={progress}
        tintColor="#6744FF"
        backgroundColor="#F3F2FF"
        rotation={0}
      />
      <Text style={styles.text}>{message}</Text>
    </SafeAreaView>
  );
};

export default FullScreenLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});
