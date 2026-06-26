import React, { useState } from "react";
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
import { getUserProfileSubtitleLines } from "@/lib/userProfileSubtitle";
import defaultAvatar from "@/assets/avatar.png";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { Toast } from "react-native-toast-notifications";

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
  isViewerAdmin: boolean;
}
type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityGroup">;

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
  isViewerAdmin,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { mutateAsync: toggleFollow, isPending } = useToggleFollow(
    isFollowing,
    false
  );
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFollowClick = async () => {
    setIsFollowingState(true);
    setIsProcessing(true);

    try {
      await toggleFollow(id);
    } catch (err) {
      setIsFollowingState(false);
      Toast.hideAll();
      Toast.show("Failed to follow");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProfileClick = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: id },
    });
  };
  //   const handleProfileClick = () => navigation.navigate('UserProfile', { userId: id })

  const { line1, line2 } = getUserProfileSubtitleLines({
    role,
    study_year,
    major,
    occupation,
    affiliation,
  });
  const showRemoveButton =
    !isSelfProfile && isViewerAdmin && showCommunityGroupMember;
  const showFollowButton = !isSelfProfile && !showRemoveButton;

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

          {line1 ? <Text style={styles.subText}>{line1}</Text> : null}
          {line2 ? <Text style={styles.subText}>{line2}</Text> : null}
        </View>
      </TouchableOpacity>

      {showRemoveButton && (
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
      )}

      {showFollowButton && (
        <TouchableOpacity
          onPress={isFollowing ? handleProfileClick : handleFollowClick}
          style={styles.followButton}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.followText}>
              {isFollowingState ? "View Profile" : "Follow"}
            </Text>
          )}
        </TouchableOpacity>
      )}
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
