import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReusableButton from "@/components/atoms/ReusableButton";

const RewardsTimelineCard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Refer and Earn Money</Text>
        </View>
        <Text style={styles.description}>
          Share your unique link, and earn cash rewards when a student or faculty
          member from your current university signs up.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <ReusableButton
          variant="border"
          size="fit"
          height="medium"
          buttonText="Learn More"
          onPress={() => navigation.navigate("Rewards" as never)}
        />
      </View>
    </View>
  );
};

export default RewardsTimelineCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "column",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18191A",
  },
  description: {
    fontSize: 12,
    color: "#404040",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
});
