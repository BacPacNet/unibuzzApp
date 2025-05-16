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
      <Text style={styles.headerText}>PAGES</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
      {/* <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.UpgradeText}>Upgrade</Text>
        <CubeScanSolid width={22} height={22} color="#6744FF" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    // margin: 20,
    marginBottom: 20,
    paddingBottom: 9,
    marginTop: 40,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: 700,
    fontFamily: "inter",
  },
  menuText: {
    fontSize: 14,
    color: "#404040",
    paddingVertical: 12,
    height: 40,
  },
  UpgradeText: {
    fontSize: 14,
    color: "#6744FF",
    paddingVertical: 12,
    height: 44,
  },
});

export default LeftSideBarPagesSection;
