import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Check } from "iconoir-react-native";
import OnboardingIllustration from "@/assets/placeHolder/firstTimeUser.svg";

const steps = [
  "Add your university community and complete verification.",
  "Join groups within the university community.",
  "Follow other students or faculty from your community or our global database.",
];

const OnboardingPlaceholder = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <OnboardingIllustration width={300} height={120} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.heading}>
          Complete the following steps to fully utilize our platform!
        </Text>

        {steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.iconWrapper}>
              <Check color="#fff" width={12} height={12} />
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    width: "90%",
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    marginTop: 24,
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#3A3B3C",
    marginBottom: 32,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#6744FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#3A3B3C",
  },
});

export default OnboardingPlaceholder;
