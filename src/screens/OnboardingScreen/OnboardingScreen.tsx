import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";

import { useTheme } from "@/theme";
import { Brand } from "@/components/molecules";
import { SafeScreen } from "@/components/template";

import type { RootScreenProps } from "@/types/navigation";
import layout from "@/theme/layout";
import Typography from "@/components/atoms/Typography/Typography";
import { TypographySize, TypographyVariant } from "@/theme/styling/types";
import OnboardingSwiper from "@/components/organism/OnboardingSwiper/OnboardingSwiper";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../../images/image1.png"),
    title: "Welcome to Unibuzz!",
    subtitle:
      "Welcome to Unibuzz, the global university network that caters to your university needs.",
  },
  {
    id: "2",
    image: require("../../images/image2.png"),
    title: "First, search your university",
    subtitle:
      "Find your university from our database and get ready to join the vibrant community within it!",
  },
  {
    id: "3",
    image: require("../../images/image3.png"),
    title: "Then join the university community",
    subtitle:
      "Gain access to the university community to communicate with current, past, and future students! Exchange valuable information and connections or use our AI powered chatbot!",
  },
  {
    id: "4",
    image: require("../../images/image4.png"),
    title: "Lastly, enjoy the features",
    subtitle:
      "With a wide range of social networking features, messaging, and an AI powered assistant, we will make your university life a blast. Download our mobile app for syncing!",
  },
];

function OnboardingScreen({ navigation }: RootScreenProps<"OnboardingScreen">) {
  return (
    <SafeAreaView style={{ width }}>
      <OnboardingSwiper />
    </SafeAreaView>
  );
}

export default OnboardingScreen;
