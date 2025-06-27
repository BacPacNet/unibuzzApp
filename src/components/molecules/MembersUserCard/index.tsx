import { View, Text, Image, StyleSheet } from "react-native";
import React, { memo, useEffect, useRef, useState } from "react";
import Avatar from "@/assets/avatar.svg";
import ReusableButton from "@/components/atoms/ReusableButton";
import { Crown, UserPlus } from "iconoir-react-native";
import { useToggleFollow } from "@/services/connection";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
import MemberActions from "../CommunityGroup/CommunityGroupMemberAction";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
}: Props) => {
  const navigate = useNavigation() as any;
  const { mutateAsync: toggleFollow } = useToggleFollow("Following");
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [isProcessing, setIsProcessing] = useState(false);
  const membersBottomSheet = useRef<ActionSheetRef>(null);

  const insets = useSafeAreaInsets();
  const handleFollowClick = async (id: string) => {
    setIsFollowingState(true);
    setIsProcessing(true);
    try {
      await toggleFollow(id);
    } catch (err) {
      setIsFollowingState(false);
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

  if (_id === currentUserId) return null;

  const isStudent = role === "student";

  const renderCTA =
    isViewerAdmin && !isSelfProfile ? (
      <ReusableButton
        onPress={() => membersBottomSheet.current?.show()}
        variant="border"
        buttonText="Settings"
        height="medium"
        size={100}
      />
    ) : isSelfProfile ? null : isFollowingState ? (
      <ReusableButton
        onPress={() => handleNavigate(_id)}
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
        onPress={() => handleFollowClick(_id)}
        height="medium"
        size={90}
        disabled={isProcessing}
        isLoading={isProcessing}
      />
    );

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

      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text
            style={styles.name}
          >{`${firstName || ""} ${lastName || ""}`}</Text>
          {isGroupAdmin && (
            <Crown height={16} width={16} color={"#F59E0B"} fill={"#F59E0B"} />
          )}
        </View>

        <View style={styles.metaRow}>
          {isStudent && study_year && (
            <Text style={styles.metaText}>{study_year} Yr.</Text>
          )}

          {!isStudent && occupation && (
            <Text style={styles.metaText}>{occupation}</Text>
          )}
        </View>

        {isStudent && major && <Text style={styles.metaText}>{major}</Text>}
        {!isStudent && affiliation && (
          <Text style={styles.metaText}>{affiliation}</Text>
        )}
      </View>

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
});
