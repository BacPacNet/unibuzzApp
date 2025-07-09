import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Group,
  OpenBook,
  PrivacyPolicy,
  PresentationSolid,
} from "iconoir-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Community"
>;

const menuItems = [
  {
    title: "Terms and Conditions",
    icon: <OpenBook width={22} height={22} color="#555" />,
    screen: "TermsAndConditions",
  },
  {
    title: "Privacy Policy",
    icon: <PrivacyPolicy width={22} height={22} color="#555" />,
    screen: "PrivacyPolicy",
  },
  {
    title: "User Guidelines",
    icon: <Group width={22} height={22} color="#555" />,
    screen: "UserGuidelines",
  },
  {
    title: "Business Services",
    icon: <PresentationSolid width={22} height={22} color="#555" />,
    screen: "BusinessServices",
  },
];

const SidebarMenuSectionFour = ({
  closeDrawer,
}: {
  closeDrawer: () => void;
}) => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleClick = (screen: string) => {
    if (!screen) return;
    navigation.navigate("InfoStackScreen", { screen });
    closeDrawer();
  };
  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleClick(item.screen)}
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
