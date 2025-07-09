import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ElectronicsChip, InfoCircle, MessageText } from "iconoir-react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

const menuItems = [
  {
    title: "Report Bug",
    icon: <ElectronicsChip width={22} height={22} color="#555" />,
    screen: "BugReportScreen",
  },
  {
    title: "Feedback",
    icon: <MessageText width={22} height={22} color="#555" />,
    screen: "FeedBackScreen",
  },
];

const SidebarMenuSectionTwo = ({
  closeDrawer,
}: {
  closeDrawer: () => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
