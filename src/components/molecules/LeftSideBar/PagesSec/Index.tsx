import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { FONTS } from "@/constants/fonts";

const menuItems = [
  {
    title: "Discover",
  },
  //   {
  //     title: "Community",
  //   },
  {
    title: "About Us",
  },
];

type NavigationProp = StackNavigationProp<RootStackParamList, "Community">;
const LeftSideBarPagesSection = () => {
  const navigation = useNavigation<NavigationProp>();

  const getCurrentStackInfo = () => {
    const currentRoute =
      navigation?.getState()?.routes[navigation?.getState()?.index];
    const currentStackName = currentRoute?.name;

    return {
      currentStack: currentStackName,
      currentScreen:
        currentRoute?.state?.routes?.[currentRoute?.state?.index || 0]?.name ||
        currentStackName,
    };
  };

  const stackInfo = getCurrentStackInfo();

  const isDiscoverScreen = stackInfo?.currentScreen === "DiscoverStack";
  const isAboutUsScreen = stackInfo?.currentScreen === "AboutUs";

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
          <Text
            style={[
              styles.menuText,
              isDiscoverScreen && item.title === "Discover"
                ? styles.activeMenuText
                : isAboutUsScreen && item.title === "About Us"
                  ? styles.activeMenuText
                  : null,
            ]}
          >
            {item.title}
          </Text>
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
    marginBottom: 16,
    paddingBottom: 16,
    marginTop: 48,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: FONTS.inter.bold,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 14,
    color: "#6B7280",
    paddingVertical: 8,
    height: 40,
    fontFamily: FONTS.inter.medium,
  },
  activeMenuText: {
    color: "#3A3B3C",
  },
  UpgradeText: {
    fontSize: 14,
    color: "#6744FF",
    paddingVertical: 12,
    height: 44,
  },
});

export default LeftSideBarPagesSection;
