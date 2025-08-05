import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

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

type NavigationProp = StackNavigationProp<RootStackParamList, "Community">;
const LeftSideBarPagesSection = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleRedirect = (route: string) => {
    if (route == "Discover") {
      navigation.navigate("DiscoverStack", {
        screen: "Discover",
      });
    } else if (route == "Community") {
      navigation.navigate("Timeline");
    } else if (route == "About Us") {
      navigation.navigate("AboutUs");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>PAGES</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleRedirect(item.title)}
          key={index}
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
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
    marginTop: 48,
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
