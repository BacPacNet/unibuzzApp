import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PRIMARY = "#6744FF";

const MaxMonthInviteCardDetails = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        After your first 20 invites, you’ll earn <Text style={styles.highlight}>₹100</Text> for every
         <Text style={styles.highlight}> additional 5 invites</Text>. Subsequent milestones occur at 
         <Text style={styles.highlight}> 25</Text>,<Text style={styles.highlight}> 30</Text>, 
         <Text style={styles.highlight}> 35</Text>, and so on. Milestones will reset on the 1st of
         every month.
      </Text>
    </View>
  );
};

export default MaxMonthInviteCardDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#18191A",
    flex: 1,
  },
  highlight: {
    color: PRIMARY,
  },
});
