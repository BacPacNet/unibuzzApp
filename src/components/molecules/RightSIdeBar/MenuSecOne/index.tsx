import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { User, Settings, CubeScanSolid } from "iconoir-react-native";

const menuItems = [
  { title: "Profile", icon: <User width={22} height={22} color="#555" /> },
  { title: "Settings", icon: <Settings width={22} height={22} color="#555" /> },
  {
    title: "Upgrades",
    icon: <CubeScanSolid width={22} height={22} color="#555" />,
  },
];

const SidebarMenuSectionOne = ({ navigation, handleClick }: any) => {
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
