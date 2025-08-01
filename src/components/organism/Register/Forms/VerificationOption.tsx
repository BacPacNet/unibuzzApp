import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, MailSolid } from "iconoir-react-native";

import ReusableButton from "@/components/atoms/ReusableButton";
import Title from "@/components/atoms/Title";
import { getRegisterData, storeRegisterData } from "@/storage/register";

interface VerificationOptionProps {
  setStep: (value: number) => void;
  setSubStep: (value: number) => void;
  handlePrev: () => void;
  email: string;
}

interface VerificationCardProps {
  email: string;
  onPress: () => void;
  isLoading?: boolean;
}

const VerificationCard: React.FC<VerificationCardProps> = ({
  email,
  onPress,
  isLoading = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={isLoading}
    style={[styles.cardContainer, isLoading && styles.cardDisabled]}
    accessibilityRole="button"
    accessibilityLabel="Verify account by email"
    accessibilityHint="Double tap to proceed with email verification"
  >
    <View style={styles.iconContainer}>
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <MailSolid width={20} height={20} color="white" fill="#6744FF" />
      )}
    </View>

    <Text style={styles.cardTitle}>Verify by Email</Text>
    <Text style={styles.cardDescription} numberOfLines={1} ellipsizeMode="tail">
      {email}
    </Text>
  </TouchableOpacity>
);

const VerificationOption: React.FC<VerificationOptionProps> = ({
  setStep,
  setSubStep,
  handlePrev,
  email,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getRegisterData();
      await storeRegisterData({ ...data, step: 4, subStep: 0 });
      setStep(3);
      setSubStep(0);
    } catch (error) {
      console.error("Error during verification setup:", error);
      Alert.alert(
        "Error",
        "Failed to proceed with verification. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [setStep, setSubStep]);

  const handleBackPress = useCallback(() => {
    if (!isLoading) {
      handlePrev();
    }
  }, [handlePrev, isLoading]);

  return (
    <View style={styles.main}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Title className="text-start">Create Account</Title>
        </View>

        <View style={styles.mainContainer}>
          <VerificationCard
            email={email}
            onPress={handleNext}
            isLoading={isLoading}
          />
          
          <Text style={styles.descriptionText}>
            User verification ensures a safe and trusted community by preventing
            impersonation and unauthorized access.
          </Text>
        </View>
      </View>

      <ReusableButton
        onPress={handleBackPress}
        disabled={isLoading}
        buttonContent={
          <View style={styles.backButtonContent}>
            <ArrowLeft width={20} height={20} color="#6744FF" />
            <Text style={styles.backButtonText}>Review Account</Text>
          </View>
        }
        variant="shade"
        height="large"
      />
    </View>
  );
};

export default VerificationOption;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    width: "100%",

    backgroundColor: "white",
  },
  titleContainer: {
    width: "100%",
    marginBottom: 32,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: "100%",
  },
  cardContainer: {
    backgroundColor: "#F3F2FF",
    padding: 32,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 120,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    backgroundColor: "#6744FF",
    padding: 4,
    borderRadius: 100,
    width: 33,
    height: 33,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3A3B3C",
    lineHeight: 28,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 16,
    color: "#3A3B3C",
    lineHeight: 24,
    textAlign: "center",
    maxWidth: "100%",
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    textAlign: "center",
  },
  backButtonContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backButtonText: {
    color: "#6744FF",
    fontSize: 16,
    fontWeight: "500",
  },
});
