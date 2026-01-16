import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { memo, useEffect, useRef, useState } from "react";
import Avatar from "@/assets/avatar.svg";
import ReusableButton from "@/components/atoms/ReusableButton";
import { CheckCircleSolid, Crown, UserPlus } from "iconoir-react-native";
import { useToggleFollow } from "@/services/connection";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
import MemberActions from "../CommunityGroup/CommunityGroupMemberAction";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OfficailLogoPlaceHolder from "@/assets/community/official-logo.svg";
import UserMinus from "@/assets/icons/user-minus.svg";
interface Props {
  _id: string;
  firstName: string;
  lastName: string;
  isFollowing: boolean;
  currentUserId: string;
  role: string;
  profile_dp_imageUrl: string;
  study_year: string;

  major: string;
  occupation: string;
  affiliation: string;
  isSelfProfile: boolean;
  isViewerAdmin: boolean;
  isGroupAdmin: boolean;
  handleRemoveClick?: (id: string) => void;
  isChat?: boolean;
  isRemoving?: boolean;
  disabled?: boolean;
  isOfficialGroup?: boolean;
  isCommunityAdmin?: boolean;
  showRemoveButton?: boolean;
  forCommunityGroup?: boolean;
  isVerifiedUserOfCommunity?: boolean;
}
const MembersUserCard = ({
  _id,
  firstName,
  lastName,
  isFollowing,
  currentUserId,
  role,
  profile_dp_imageUrl,
  study_year,
  major,
  occupation,
  affiliation,
  isSelfProfile,
  isViewerAdmin,
  isGroupAdmin,
  handleRemoveClick,
  isChat = false,
  isRemoving = false,
  disabled = false,
  isOfficialGroup = false,
  isCommunityAdmin = false,
  showRemoveButton = false,
  forCommunityGroup = false,
  isVerifiedUserOfCommunity = false,
}: Props) => {
  const navigate = useNavigation() as any;
  const { mutateAsync: toggleFollow } = useToggleFollow(isFollowing, false);
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [isProcessing, setIsProcessing] = useState(false);
  const membersBottomSheet = useRef<ActionSheetRef>(null);
  const isAllowedToRemove =
    (isCommunityAdmin && !isOfficialGroup) || !isCommunityAdmin;
  const insets = useSafeAreaInsets();

  const showRemoveButtonState =
    !isSelfProfile && isViewerAdmin && forCommunityGroup;

  const isNotAllowedToRemove = isCommunityAdmin && isOfficialGroup;

  const showFollowButton = !isSelfProfile && !showRemoveButtonState;

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

  useEffect(() => {
    setIsFollowingState(isFollowing);
  }, [isFollowing]);

  const isStudent = role === "student";

  const renderCTA = (() => {
    if (isSelfProfile || _id === currentUserId) return null;

    // REMOVE
    if (showRemoveButtonState && !isNotAllowedToRemove) {
      return (
        <ReusableButton
          onPress={() => handleRemoveClick?.(_id)}
          variant="danger_outline"
          buttonContent={
            <View className="flex-row items-center justify-center gap-1">
              <Text className="text-2xs text-[#EF4444]">Remove</Text>
              <UserMinus width={16} height={16} fill={"white"} />
            </View>
          }
          height="small"
          size={100}
          disabled={disabled}
          isLoading={isRemoving}
        />
      );
    }

    // FOLLOW / VIEW PROFILE
    if (showFollowButton) {
      return isFollowingState ? (
        <ReusableButton
          onPress={() => handleNavigate(_id)}
          variant="border"
          buttonText="View Profile"
          height="small"
          textSize="text-2xs"
          size={100}
        />
      ) : (
        <ReusableButton
          variant="primary"
          buttonContent={
            <View className="flex-row items-center justify-center gap-1">
              <Text className="text-white font-bold text-2xs">Follow</Text>
              <UserPlus height={16} width={16} color="white" fill={"white"} />
            </View>
          }
          onPress={() => handleFollowClick(_id)}
          height="small"
          size={90}
          disabled={isProcessing}
          isLoading={isProcessing}
        />
      );
    }

    return null;
  })();

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {profile_dp_imageUrl ? (
          <Image
            source={{ uri: profile_dp_imageUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <Avatar width={48} height={48} />
        )}
      </View>

      <TouchableOpacity
        onPress={() => handleNavigate(_id)}
        style={styles.infoContainer}
      >
        <View style={styles.nameContainer}>
          <Text
            style={styles.name}
          >{`${firstName || ""} ${lastName || ""}`}</Text>
          {isVerifiedUserOfCommunity && (
            <CheckCircleSolid color={"#6744FF"} height={16} width={16} />
          )}
          {isGroupAdmin && (
            <Crown height={16} width={16} color={"#F59E0B"} fill={"#F59E0B"} />
          )}
          {isCommunityAdmin && (
            <OfficailLogoPlaceHolder
              height={16}
              width={16}
              style={styles.badgeImage}
            />
          )}
        </View>

        <View style={styles.metaRow}>
          {(study_year || occupation) && (
            <Text style={styles.metaText}>
              {isStudent ? study_year : occupation}
            </Text>
          )}
        </View>

        {(affiliation || major) && (
          <Text style={styles.metaText}>{isStudent ? major : affiliation}</Text>
        )}
      </TouchableOpacity>

      <View className="flex justify-end w-max">{renderCTA}</View>
      <ActionSheet
        useBottomSafeAreaPadding
        ref={membersBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={{
          paddingTop: 10,
        }}
      >
        <MemberActions
          isFollowing={isFollowingState}
          handleNavigate={handleNavigate}
          handleRemoveClick={handleRemoveClick as any}
          _id={_id}
          handleFollowClick={handleFollowClick as any}
        />
      </ActionSheet>
    </View>
  );
};

export default memo(MembersUserCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
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
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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

  badgeWrapper: {
    position: "absolute",
    bottom: -10,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#a544ff",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeImage: {
    width: 12,
    height: 12,
    borderRadius: 6,
    objectFit: "contain",
  },
});
