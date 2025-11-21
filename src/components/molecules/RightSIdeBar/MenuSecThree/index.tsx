import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LogOut } from "iconoir-react-native";
import { useAuth } from "@/context/AuthProvider/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useHandleDeletePushNotificationToken } from "@/services/pushNotification";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GenericInfoBottomSheet from "../../GenericInfoBottomSheet";

const menuItems = [
  { title: "Log Out", icon: <LogOut width={22} height={22} color="#555" /> },
];
const SidebarMenuSectionThree = () => {
  const { deauthenticate } = useAuth();
  const [isClosable, setIsClosable] = useState(true);
  const logOutConfirmationBottomSheet = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  const { mutateAsync: deletePushNotificationToken } =
    useHandleDeletePushNotificationToken();

  const handleLogout = async () => {
    setIsClosable(false);
    try {
      await deletePushNotificationToken();
      deauthenticate();
      setIsClosable(true);
    } catch {
      deauthenticate();
      setIsClosable(true);
    }
  };
  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          onPress={() => logOutConfirmationBottomSheet.current?.show()}
          key={index}
          style={styles.menuItem}
        >
          {item.icon}
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}

      <ActionSheet
        ref={logOutConfirmationBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        closable={isClosable}
      >
        <GenericInfoBottomSheet
          buttonLabel="Log Out"
          title="Are you sure you want to log out?"
          description="You will be logged out of your account and need to login again to continue."
          onButtonPress={handleLogout}
        />
      </ActionSheet>
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
