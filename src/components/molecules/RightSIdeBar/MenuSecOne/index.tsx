import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { User, Settings, CubeScanSolid } from "iconoir-react-native";
import RewardIcon from "@/components/atoms/RewardIcon";
import { useHeader } from "@/context/HeaderProvider/Header";


const SidebarMenuSectionOne = ({ navigation, handleClick }: any) => {
  const { isUserEligibleForRewards } = useHeader();
  const menuItems = isUserEligibleForRewards ? [
    { title: "Profile", icon: <User width={22} height={22} color="#555" /> },
    { title: "Settings", icon: <Settings width={22} height={22} color="#555" /> },
    { title: "Rewards", icon: <RewardIcon width={22} height={22} color="#555" /> },
  ] : [
    { title: "Profile", icon: <User width={22} height={22} color="#555" /> },
    { title: "Settings", icon: <Settings width={22} height={22} color="#555" /> },
  ];
  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleClick(item.title)}
          key={index}
          style={styles.menuItem}
        >
          {item.icon}
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 2,
    margin: 20,
    marginBottom: 0,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
});

export default SidebarMenuSectionOne;
