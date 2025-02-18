import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import avatar from "@/assets/avatar.png";
import { getUserProfileStore, getUserStore } from "@/storage/user";
const ProfileCard = () => {
  const user: any = getUserStore();
  const userProfile: any = getUserProfileStore();
  return (
    <View style={styles.card}>
      <View style={styles.profilePicWrapper}>
        <Image
          source={
            userProfile?.profile_dp &&
            userProfile?.profile_dp?.imageUrl?.length > 0
              ? { uri: userProfile?.profile_dp?.imageUrl }
              : avatar
          } // Replace with your image URL
          style={styles.profilePic}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {user?._j?.firstName} {user?._j?.lastName}
        </Text>
        <View style={styles.universityContainer}>
          <Text style={styles.university}>Lorem University</Text>
          <View style={styles.badgeWrapper}>
            <Text style={styles.badge}>Admin</Text>
          </View>
        </View>
        <Text style={styles.year}>3rd Yr. Undergraduate</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  university: {
    color: "#555",
  },
  universityContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
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
});

export default ProfileCard;
