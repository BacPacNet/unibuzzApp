import { FONTS } from "@/constants/fonts";
import { LogIn } from "iconoir-react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const CommunityDropDownModal = ({
  leaveCommunity,
}: {
  leaveCommunity: () => void;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={leaveCommunity} style={styles.textContainer}>
        <LogIn height={16} width={16} color={"#EF4444"} />
        <Text style={styles.text}> Leave</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: 144,
  },
  textContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  text: {
    color: "#3A3B3C",
    fontFamily: FONTS.inter.medium,
    fontSize: 12,
  },
});
