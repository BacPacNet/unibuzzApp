import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import avatar from "@/assets/avatar.png";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import { EditPencil } from "iconoir-react-native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type Props = {
  name?: string;
  avatarUrl?: string;
  university?: string;
  year?: string;
  degree?: string;
  isSelfProfile?: boolean;
  toShow: boolean;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Profile">;

const ProfileCard = ({
  name,
  avatarUrl,
  degree,
  university,
  year,
  isSelfProfile,
  toShow = false,
}: Props) => {
  const user = getUserStore();
  const userProfile = getUserProfileStore();
  const { navigate } = useNavigation<NavigationProp>();
  return (
    <View style={styles.card}>
      <View style={styles.profilePicWrapper}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : avatar}
          style={styles.profilePic}
        />
      </View>
      <View style={styles.info}>
        <View className="flex flex-row items-center justify-between">
          <Text style={styles.name}>
            {name ? name : user?.firstName + " " + user?.lastName}
          </Text>
          {isSelfProfile && toShow && (
            <TouchableOpacity
              onPress={() => navigate("ProfileEdit")}
              style={styles.editButton}
            >
              <Text className="text-[#6744FF]">Edit</Text>
              <EditPencil width={22} height={22} color="#6744FF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.universityContainer}>
          <Text className="line-clamp-2" style={styles.university}>
            {university ? university : userProfile?.university_name}
          </Text>
          {/* <View style={styles.badgeWrapper}>
            <Text style={styles.badge}>Admin</Text>
          </View> */}
        </View>
        <Text style={styles.year}>
          {year ? year : userProfile?.study_year}{" "}
          {degree ? degree : userProfile?.degree}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  profilePicWrapper: {
    backgroundColor: "#f3d1e6",
    borderRadius: 50,
    padding: 3,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  university: {
    color: "#555",
    flex: 1,
    width: "100%",
  },
  universityContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    width: "100%",
  },
  badgeWrapper: {
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#ff5c5c",
    color: "#fff",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
  year: {
    color: "#888",
    fontSize: 12,
  },

  editButton: {
    paddingHorizontal: 10,

    borderColor: "#6744FF",
    borderWidth: 1,
    borderRadius: 8,
    width: 70,
    height: 30,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileCard;
