import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { InfoCircle, MessageText } from "iconoir-react-native";

const menuItems = [
  {
    title: "Help Center",
    icon: <InfoCircle width={22} height={22} color="#555" />,
  },
  {
    title: "Feedback",
    icon: <MessageText width={22} height={22} color="#555" />,
  },
];

const SidebarMenuSectionTwo = () => {
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

export default SidebarMenuSectionTwo;
