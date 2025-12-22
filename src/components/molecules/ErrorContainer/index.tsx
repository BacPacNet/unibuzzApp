import { FONTS } from "@/constants/fonts";
import { StyleSheet, Text, View } from "react-native";

const ErrorContainer = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default ErrorContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: "#18191A",
    fontFamily: FONTS.poppins.extraBold,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    paddingTop: 16,
    textAlign: "center",
  },
});
