import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CubeScanSolid, InfoCircle, MessageText } from "iconoir-react-native";

const menuItems = [
  {
    title: "Discover",
  },
  {
    title: "Community",
  },
  {
    title: "About Us",
  },
];

const LeftSideBarPagesSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Pages</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.UpgradeText}>Upgrade</Text>
        <CubeScanSolid width={22} height={22} color="#6744FF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 2,
    // margin: 20,
    marginBottom: 20,
    paddingBottom: 20,
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 4,
  },
  headerText: {
    fontSize: 12,
    color: "#6B7280",
  },
  menuText: {
    fontSize: 14,
    color: "#404040",
  },
  UpgradeText: {
    fontSize: 14,
    color: "#6744FF",
  },
});

export default LeftSideBarPagesSection;
