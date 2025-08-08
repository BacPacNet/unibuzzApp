import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavArrowLeft } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";

type BackHeaderProps = {
  label?: string;
  onPress?: () => void;
  isLeftPadding?: boolean;
};

const BackHeader: React.FC<BackHeaderProps> = ({
  label = "Back",
  onPress,
  isLeftPadding = true,
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, isLeftPadding && styles.paddingLeft]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress || (() => navigation.goBack())}
      >
        <NavArrowLeft width={24} height={24} color="#6744FF" strokeWidth={2} />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
    marginVertical: 16,
  },
  paddingLeft: {
    paddingLeft: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#6744FF",
    fontSize: 16,
    fontFamily:FONTS.poppins.medium
  },
});

export default BackHeader;
