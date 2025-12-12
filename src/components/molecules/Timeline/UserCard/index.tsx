// components/CommentHeader.tsx
import { BinMinusIn, DashFlag, MoreHoriz } from "iconoir-react-native";
import React, { useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Avatar from "@/assets/avatar.svg";
import DropdownWrapper from "../../SelectDropDownWrapper";
import { FONTS } from "@/constants/fonts";
import PostCommunityHolder from "../../PostCommunityHolder/PostCommunityHolder";
import ReportContentModal from "@/components/organism/reportUserModal";
import { getUserStore } from "@/storage/user";
import { ContentType as ContentTypeEnum } from "@/types/report-content";

interface CommenterProfile {
  profile_dp?: { imageUrl?: string };
  study_year?: string;
  major?: string;
  occupation?: string;
  affiliation?: string;
}

interface Commenter {
  _id: string;
  firstName: string;
  lastName: string;
}

interface CommentHeaderProps {
  commenter: Commenter;
  profile: CommenterProfile;
  isStudent: boolean;
  onNavigate: (id: string) => void;
}

interface UserCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  isStudent: boolean;
  studyYear?: string;
  major?: string;
  occupation?: string;
  affiliation?: string;
  onNavigate: (id: string) => void;
  isCommentAdmin: boolean;
  handleDelete: () => void;
  communities: {
    _id: string;
    name: string;
    logo: string;
    isVerifiedMember: boolean;
    isCommunityAdmin: boolean;
  }[];
  postId: string;
  postContentType: ContentTypeEnum;
  level: number;
  commentId?: string;
  parentCommentId?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  firstName,
  lastName,
  imageUrl,
  isStudent,
  studyYear,
  major,
  occupation,
  affiliation,

  onNavigate,
  isCommentAdmin = false,
  handleDelete,
  communities,
  postId,
  postContentType,
  level,
  commentId,
  parentCommentId,
}) => {
  const [visible, setVisible] = useState(false);
  const userdata = getUserStore();
  const handleReportComment = () => {
    setVisible(true);
  };

  const commentCategory = useMemo(() => {
    if (postContentType === ContentTypeEnum.COMMUNITY_POST && level == 0) {
      return ContentTypeEnum.COMMUNITY_COMMENT;
    }
    if (postContentType === ContentTypeEnum.COMMUNITY_POST && level == 1) {
      return ContentTypeEnum.COMMUNITY_REPLY;
    }
    if (
      postContentType === ContentTypeEnum.COMMUNITY_GROUP_POST &&
      level == 0
    ) {
      return ContentTypeEnum.COMMUNITY_GROUP_COMMENT;
    }
    if (
      postContentType === ContentTypeEnum.COMMUNITY_GROUP_POST &&
      level == 1
    ) {
      return ContentTypeEnum.COMMUNITY_GROUP_REPLY;
    }
    if (postContentType === ContentTypeEnum.USER_POST && level == 0) {
      return ContentTypeEnum.USER_COMMENT;
    }
    if (postContentType === ContentTypeEnum.USER_POST && level == 1) {
      return ContentTypeEnum.USER_REPLY;
    }
  }, [level, postContentType]);

  return (
    <View className="flex-1 flex-row items-center gap-4 justify-center">
      <View style={styles.avatarContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.profileImage}
            className="rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Avatar width={48} height={48} />
        )}
      </View>

      <View className="flex-1 flex-row items-center">
        <TouchableOpacity onPress={() => onNavigate(userId)} className="flex-1">
          <Text style={styles.nameFont} className="text-neutral-700 text-2xs">
            {firstName} {lastName}
          </Text>
          <View className="flex">
            <Text style={styles.userDetails}>
              {isStudent ? studyYear : occupation}
            </Text>
            <Text style={styles.userDetails}>
              {isStudent ? major : affiliation}
            </Text>
          </View>
        </TouchableOpacity>
        <View className="mr-2">
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

        <DropdownWrapper
          position="left"
          extraLeft={80}
          viewTopPosition={-40}
          renderDropdown={(closeDropdown) => (
            <View className="flex flex-col gap-2">
              {isCommentAdmin && (
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    handleDelete();
                    closeDropdown();
                  }}
                >
                  <BinMinusIn height={16} width={16} />
                  <Text className="text-neutral-700">Delete</Text>
                </TouchableOpacity>
              )}
              {!isCommentAdmin && (
                <TouchableOpacity
                  onPress={() => {
                    handleReportComment();
                    closeDropdown();
                  }}
                  style={styles.dropdown}
                >
                  <DashFlag height={16} width={16} />
                  <Text className="text-neutral-700">Report Comment</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        >
          {/* <View className="flex justify-center items-center"> */}
          <TouchableOpacity style={styles.moreButton}>
            <MoreHoriz height={20} width={20} color="#6744FF" />
          </TouchableOpacity>
          {/* </View> */}
        </DropdownWrapper>
      </View>
      <ReportContentModal
        visible={visible}
        postID={postId}
        reporterId={userdata?.id || ""}
        contentType={commentCategory as ContentTypeEnum}
        setModalVisible={setVisible}
        commentId={commentId}
        parentCommentId={parentCommentId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 20,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    fontSize: 10,
    color: "#6B7280",
    fontFamily: FONTS.inter.regular,
  },
  moreButton: {
    backgroundColor: "#F3F2FF",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "flex-start",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  nameFont: {
    fontFamily: FONTS.inter.semiBold,
  },
});

export default UserCard;
