import React from "react";
import { View, Text, Pressable } from "react-native";
import { SlideItem } from "./types";
import { styles } from "./styles";
import ReusableButton from "@/components/atoms/ReusableButton";

interface SlideProps {
  item: SlideItem;
}

export const Slide: React.FC<SlideProps> = ({ item }) => {
  const { SVG, height } = item;
  const isLastSlide = item.id === "4";

  return (
    <View style={styles.container}>
      <SVG width={styles.title.width} height={height} />
      <Text
        style={[
          styles.title,
          isLastSlide ? styles.lastSlideTitle : styles.defaultTitle,
        ]}
      >
        {item.title}
      </Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );
};

interface IndicatorProps {
  currentIndex: number;
  totalSlides: number;
}

export const Indicator: React.FC<IndicatorProps> = ({
  currentIndex,
  totalSlides,
}) => (
  <View style={styles.indicatorContainer}>
    {Array.from({ length: totalSlides }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.indicator,
          currentIndex === index && styles.activeIndicator,
        ]}
      />
    ))}
  </View>
);

interface SkipButtonProps {
  onPress: () => void;
}

export const SkipButton: React.FC<SkipButtonProps> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.skipButton, { opacity: pressed ? 0.7 : 1 }]}
  >
    <Text style={styles.skipText}>Skip Onboarding</Text>
  </Pressable>
);

interface CreateAccountButtonProps {
  onPress: () => void;
}

export const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({
  onPress,
}) => (
  <View style={styles.buttonContainer}>
    <ReusableButton
      buttonText="Create Account"
      onPress={onPress}
      variant="primary"
      size="w-full"
      height="large"
    />
  </View>
);
