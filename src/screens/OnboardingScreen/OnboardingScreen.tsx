import { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet } from "react-native";

import type { RootScreenProps } from "@/types/navigation";

import OnboardingSwiper from "@/components/organism/Onboarding/OnboardingSwiper/OnboardingSwiper";
import OnboardingMain from "@/components/organism/Onboarding/OnboardingMain";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeScreen } from "@/components/template";

const { width } = Dimensions.get("window");

function OnboardingScreen({ navigation }: RootScreenProps<"OnboardingScreen">) {
  const [startOnboarding, setStartOnboarding] = useState(false);
  const inset = useSafeAreaInsets();

  return (
    <SafeScreen style={[styles.container]}>
      {!startOnboarding ? (
        <OnboardingMain setStartOnboarding={setStartOnboarding} />
      ) : (
        <OnboardingSwiper />
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F2FF",
  },
});

export default OnboardingScreen;
