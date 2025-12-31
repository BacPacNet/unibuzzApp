import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  User,
  NavArrowRight,
  Lock,
  ShieldCheck,
  EditPencil,
} from "iconoir-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

const SectionHeader = ({ icon, title }: { icon: any; title: string }) => (
  <View style={styles.sectionHeader}>
    {icon}
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const MenuItem = ({ title, onPress }: { onPress: any; title: string }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemText}>{title}</Text>
    <NavArrowRight width={24} height={24} color="#6b7280" />
  </TouchableOpacity>
);

const getSectionIcon = (id: string) => {
  switch (id) {
    case "account":
      return <User width={20} height={20} color="#6b7280" />;
    case "privacy":
      return <Lock width={20} height={20} color="#6b7280" />;
    case "security":
      return <ShieldCheck width={20} height={20} color="#6b7280" />;
    case "preferences":
      return <EditPencil width={20} height={20} color="#6b7280" />;
    default:
      return <User width={20} height={20} color="#6b7280" />;
  }
};

const sections = [
  {
    id: "account",
    title: "Account",
    items: [
      { id: "UniversityVerification", title: "University Verification" },
      { id: "username", title: "Change Username" },
      { id: "password", title: "Change Password" },
      { id: "blockUsers", title: "Block Users" },
      { id: "deleteAccount", title: "Delete Account" },
      //   { id: "email", title: "Change Email" },
      //   { id: "deactivation", title: "Account Deactivation" },
    ],
  },
  //   {
  //     id: "privacy",
  //     title: "Privacy",
  //     items: [
  //       { id: "visibility", title: "Profile Visibility" },
  //       { id: "tagging", title: "Tagging Permissions" },
  //     ],
  //   },
  //   {
  //     id: "security",
  //     title: "Security",
  //     items: [
  //       { id: "2fa", title: "Two Factor Authentication" },
  //       { id: "devices", title: "Connected Devices" },
  //     ],
  //   },
  //   {
  //     id: "preferences",
  //     title: "Preferences",
  //     items: [
  //       { id: "language", title: "Language" },
  //       { id: "theme", title: "Display/Theme" },
  //     ],
  //   },
];

type NavigationProp = StackNavigationProp<RootStackParamList, "Settings">;
const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const routeChange = (route: string) => {
    switch (route) {
      case "UniversityVerification":
        return navigation.navigate("UniversityVerification");
      case "username":
        return navigation.navigate("UserNameChange");
      case "password":
        return navigation.navigate("UserPasswordChange");
      case "email":
        return navigation.navigate("UserEmailChange");
      case "deactivation":
        return navigation.navigate("UserAccountDeactivation");
      case "deleteAccount":
        return navigation.navigate("DeleteAccount");
      case "blockUsers":
        return navigation.navigate("BlockUsers");
    }
  };

  const handleMenuItemPress = (sectionId: string, itemId: string) => {
    routeChange(itemId);
  };

  return (
    <ScrollView style={styles.container}>
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <SectionHeader
            icon={getSectionIcon(section.id)}
            title={section.title}
          />
          <View>
            {section.items.map((item) => (
              <MenuItem
                key={item.id}
                title={item.title}
                onPress={() => handleMenuItemPress(section.id, item.id)}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#3a3b3c",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  menuItemText: {
    fontSize: 16,
    color: "#6b7280",
  },
});

export default SettingsScreen;
