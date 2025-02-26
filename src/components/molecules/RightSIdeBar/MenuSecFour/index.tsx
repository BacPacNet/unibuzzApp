import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Group,
  OpenBook,
  PrivacyPolicy,
  PresentationSolid,
} from "iconoir-react-native";

const menuItems = [
  {
    title: "Terms and Conditions",
    icon: <OpenBook width={22} height={22} color="#555" />,
  },
  {
    title: "Privacy Policy",
    icon: <PrivacyPolicy width={22} height={22} color="#555" />,
  },
  {
    title: "User Guidelines",
    icon: <Group width={22} height={22} color="#555" />,
  },
  {
    title: "Business Services",
    icon: <PresentationSolid width={22} height={22} color="#555" />,
  },
];

const SidebarMenuSectionFour = () => {
  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          {item.icon}
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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

export default SidebarMenuSectionFour;
