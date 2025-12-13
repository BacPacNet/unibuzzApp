import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import avatar from "../../../../assets/avatar.png";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import PostOption from "@/assets/icons/postOption";
import { userTypeEnum } from "@/storage/register";
import DropdownWrapper from "../../SelectDropDownWrapper";
import PostCardOption from "../PostCardOption";
import { BadgeCheck, Balcony, CheckCircleSolid } from "iconoir-react-native";
import PostCommunityHolder from "../../PostCommunityHolder/PostCommunityHolder";
import { ContentType } from "@/types/report-content";
type Props = {
  name: string;
  year: string;
  degree: string;
  university: string;
  dp: string;
  postId: string;
  type: "Community" | "Timeline";
  isAdmin: boolean;
  postAdminId: string;
  setVisible?: (visible: boolean) => void;
  visible?: boolean;
  communityName?: string;
  communityGroupName?: string;
  major: string;
  //   adminId: string;
  role?: string;
  occupation?: string;
  affiliation?: string;
  isPostVerified?: boolean;
  isCommunityAdmin?: boolean;
  handleDeletePost: () => void;
  isPostOptionShown?: boolean;
  communities?: {
    _id: string;
    name: string;
    logo: string;
    isVerifiedMember: boolean;
    isCommunityAdmin: boolean;
  }[];
  postType: ContentType;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;

const PostCardUserDetails = ({
  name,
  year,
  dp,

  postId,
  type,

  postAdminId,
  visible,
  setVisible,
  major,
  affiliation,

  occupation,
  role,
  isPostVerified,
  isAdmin,
  handleDeletePost,
  isCommunityAdmin,
  isPostOptionShown = true,
  communities,
  postType,
}: Props) => {
  const navigate = useNavigation<NavigationProp>();

  const normalizedRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : null;

  const isStudent = normalizedRole === userTypeEnum.Student;

  let roleInfo;

  if (isStudent) {
    roleInfo = year || "Student (Year not specified)";
  } else if (normalizedRole) {
    roleInfo = normalizedRole;
  } else {
    roleInfo = occupation || "Unknown Role";
  }
  const handleNavigate = () => {
    navigate.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: postAdminId },
    });
  };

  return (
    <View className="relative flex flex-row justify-between items-start  px-4">
      {/*{visible && (
        <PostCardOption handleDeletePost={handleDeletePost} isAdmin={isAdmin} />
      )}*/}
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex flex-row gap-2"
        onPress={() => handleNavigate()}
      >
        <Image
          source={dp && dp?.trim().length > 0 ? { uri: dp } : avatar}
          style={styles.ImageSize}
          className="w-12 h-12 rounded-full border border-neutral-300"
          resizeMode="cover"
        />

        <View>
          <View className="flex flex-row gap-2 items-center">
            <Text className="font-semibold text-neutral-900 text-2xs ">
              {name}
            </Text>
          </View>
          <View>
            <Text style={styles.fontSize} className="text-neutral-500 ">
              {isStudent ? year : occupation}
            </Text>
            <Text style={styles.fontSize} className="text-neutral-500 ">
              {isStudent ? major : affiliation}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View className="flex flex-row items-center gap-2">
        <View>
          {communities?.length && communities?.length > 0 && (
            <View className="flex flex-row items-center gap-2">
              {communities
                ?.slice()
                .sort((a, b) => {
                  const aIsAdmin = a.isCommunityAdmin;
                  const bIsAdmin = b.isCommunityAdmin;

                  const aIsVerified = a.isVerifiedMember;
                  const bIsVerified = b.isVerifiedMember;

                  if (aIsAdmin !== bIsAdmin) return aIsAdmin ? -1 : 1;
                  if (aIsVerified !== bIsVerified) return aIsVerified ? -1 : 1;

                  return 0;
                })
                .map((community) => (
                  <PostCommunityHolder
                    key={community?._id || ""}
                    logo={community?.logo || ""}
                    name={community?.name || ""}
                    isVerified={community?.isVerifiedMember || false}
                    isCommunityAdmin={community?.isCommunityAdmin || false}
                  />
                ))}
            </View>
          )}
        </View>
        {isPostOptionShown && (
          <DropdownWrapper
            position="left"
            extraLeft={60}
            viewTopPosition={-90}
            renderDropdown={(closeDropdown) => (
              <PostCardOption
                handleDeletePost={() => {
                  handleDeletePost();
                  closeDropdown();
                }}
                isAdmin={isAdmin}
                postId={postId}
                type={type}
                postType={postType}
              />
            )}
          >
            <TouchableOpacity
            // className="absolute right-4 top-1"
            // onPress={() => setVisible(!visible)}
            >
              <PostOption />
            </TouchableOpacity>
          </DropdownWrapper>
        )}
      </View>
    </View>
  );
};

export default PostCardUserDetails;

const styles = StyleSheet.create({
  ImageSize: {
    width: 48,
    height: 48,
  },

  fontSize: {
    fontSize: 10,
  },

  dotBg: {
    backgroundColor: "#f5f5f5",
  },
});
