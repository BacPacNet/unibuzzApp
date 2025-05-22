import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useToggleFollow } from "@/services/connection";
import { userTypeEnum } from "@/types/register";
import defaultAvatar from "@/assets/avatar.png";

interface Props {
  firstName: string;
  lastName: string;
  id: string;
  university: string;
  study_year: string;
  degree: string;
  major: string;
  occupation: string;
  imageUrl: string;
  type: string;
  isFollowing: boolean;
  role: string;
  affiliation: string;
  isSelfProfile?: boolean;
  showCommunityGroupMember?: boolean;
  isGroupAdmin?: boolean;
  handleRemoveClick?: (id: string) => void;
  isRemovePending?: boolean;
}

const UserListItem: React.FC<Props> = ({
  id,
  firstName,
  lastName,
  university,
  study_year,
  major,
  occupation,
  role,
  affiliation,
  imageUrl,
  isFollowing,
  isSelfProfile,
  isGroupAdmin,
  showCommunityGroupMember,
  handleRemoveClick,
  isRemovePending,
}) => {
  const navigation = useNavigation();
  const { mutate: toggleFollow, isPending } = useToggleFollow();

  const handleFollow = () => toggleFollow(id);

  const handleProfileClick = () => console.log("1212");
  //   const handleProfileClick = () => navigation.navigate('UserProfile', { userId: id })

  const isStudent = role == userTypeEnum.Student;

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={handleProfileClick}
        style={styles.profileContainer}
      >
        <Image
          source={defaultAvatar}
          //   source={{ uri: imageUrl || defaultAvatar }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>

          <Text style={styles.subText}>
            {isStudent ? study_year : occupation}
          </Text>
          <Text style={styles.subText}>{isStudent ? major : affiliation}</Text>
        </View>
      </TouchableOpacity>

      {!isSelfProfile && isGroupAdmin && showCommunityGroupMember ? (
        <TouchableOpacity
          disabled={isRemovePending}
          onPress={() => handleRemoveClick && handleRemoveClick(id)}
          style={styles.removeButton}
        >
          {isRemovePending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.removeButtonText}>Remove</Text>
          )}
        </TouchableOpacity>
      ) : !isSelfProfile ? (
        <TouchableOpacity
          onPress={isFollowing ? handleProfileClick : handleFollow}
          style={styles.followButton}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.followText}>
              {isFollowing ? "View Profile" : "Follow"}
            </Text>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  info: { flexShrink: 1 },
  name: { fontWeight: "bold", fontSize: 14 },
  university: { fontSize: 12, color: "#666" },
  subText: { fontSize: 12, color: "black" },
  followButton: {
    backgroundColor: "#6647FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  followText: { color: "#fff", fontSize: 12 },
  removeButton: {
    backgroundColor: "#fdd",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  removeButtonText: { color: "#c00", fontSize: 12 },
});

export default UserListItem;
