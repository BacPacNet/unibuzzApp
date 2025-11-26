import { View, Text, Image, StyleSheet } from "react-native";
import React, { memo, useState } from "react";
import Avatar from "@/assets/avatar.svg";
import ReusableButton from "@/components/atoms/ReusableButton";
import { UserPlus } from "iconoir-react-native";
import { useToggleFollow } from "@/services/connection";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
import { screenName } from "@/constant/screenName";

interface UserProfile {
  profile_dp?: { imageUrl?: string };
  study_year?: string;
  degree?: string;
  major?: string;
  occupation?: string;
  affiliation?: string;
}

interface Users {
  _id: string;
  firstName?: string;
  lastName?: string;
  isFollowing: boolean;
  profile?: UserProfile;
  role?: string;
}

interface Props {
  item: any;
  currentUserId: string;
  myUserId: string;
  isFollowing: boolean;
  from: string;
}

const UsersScreenUserCardItem = ({
  item,
  currentUserId,
  myUserId,
  isFollowing,
  from,
}: Props) => {
  const navigate = useNavigation() as any;
  const { mutateAsync: toggleFollow, isPending } = useToggleFollow(
    isFollowing,
    from == screenName.profile
  );
  const [isFollowingState, setIsFollowingState] = useState(item?.isFollowing);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFollowClick = async (id: string) => {
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

  const handleNavigate = (id: string) => {
    navigate.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: id },
    });
  };

  //   if (item?._id === myUserId) return null;

  const renderCTA =
    item?._id === myUserId ? null : isFollowing || isFollowingState ? (
      <ReusableButton
        onPress={() => handleNavigate(item._id)}
        variant="border"
        buttonText="View Profile"
        height="medium"
        size={100}
      />
    ) : (
      <ReusableButton
        variant="primary"
        buttonContent={
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-white font-bold text-2xs">Follow</Text>
            <UserPlus height={16} width={16} color={"white"} fill={"white"} />
          </View>
        }
        onPress={() => handleFollowClick(item._id)}
        height="medium"
        size={90}
        disabled={isProcessing}
        isLoading={isProcessing}
      />
    );

  const isStudent = item?.profile?.role === "student";
  const profile = item?.profile ?? {};

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {profile?.profile_dp?.imageUrl ? (
          <Image
            source={{ uri: profile.profile_dp.imageUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <Avatar width={48} height={48} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {`${item?.firstName || ""} ${item?.lastName || ""}`}
        </Text>

        <View style={styles.metaRow}>
          {isStudent && profile.study_year && (
            <Text style={styles.metaText}>{profile.study_year} Yr.</Text>
          )}
          {/* {isStudent && profile.degree && (
            <Text style={styles.metaText}>{profile.degree}</Text>
          )} */}
          {!isStudent && profile.occupation && (
            <Text style={styles.metaText}>{profile.occupation}</Text>
          )}
        </View>

        {isStudent && profile.major && (
          <Text style={styles.metaText}>{profile.major}</Text>
        )}
        {!isStudent && profile.affiliation && (
          <Text style={styles.metaText}>{profile.affiliation}</Text>
        )}
      </View>
      <View className="flex justify-end w-max">{renderCTA}</View>
    </View>
  );
};

export default memo(UsersScreenUserCardItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#d4d4d4",
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#f9a8d4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3A3B3C",
    lineHeight: 14,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
    fontWeight: 400,
  },
});
