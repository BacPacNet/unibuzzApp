import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LogOut } from "iconoir-react-native";
import { useAuth } from "@/context/AuthProvider/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const menuItems = [
  { title: "Log Out", icon: <LogOut width={22} height={22} color="#555" /> },
];

const SidebarMenuSectionThree = () => {
  const { deauthenticate } = useAuth();
  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          onPress={() => deauthenticate()}
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

export default SidebarMenuSectionThree;
