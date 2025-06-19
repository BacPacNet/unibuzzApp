import { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";

import type { RootScreenProps } from "@/types/navigation";

import OnboardingSwiper from "@/components/organism/Onboarding/OnboardingSwiper/OnboardingSwiper";
import OnboardingMain from "@/components/organism/Onboarding/OnboardingMain";

const { width } = Dimensions.get("window");

function OnboardingScreen({ navigation }: RootScreenProps<"OnboardingScreen">) {
  const [startOnboarding, setStartOnboarding] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {!startOnboarding ? (
        <OnboardingMain setStartOnboarding={setStartOnboarding} />
      ) : (
        <OnboardingSwiper />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    backgroundColor: "white",
  },
});

export default OnboardingScreen;
