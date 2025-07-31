import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import avatar from "../../../../assets/avatar.png";
import {
  BinMinusIn,
  ChatBubbleEmpty,
  MoreHoriz,
  Reply,
  ShareAndroid,
  ThumbsUp,
} from "iconoir-react-native";

import { getUserStore } from "@/storage/user";
import RenderHTML from "react-native-render-html";
import ImageGallery from "../../ImageGrid";
import { CommentsProp, PostType } from "@/types/postType";
import { useDeleteUserPostComment } from "@/services/timeline";
import { useDeleteCommunityPostComment } from "@/services/communityPost";

import { RenderCreatedAt } from "@/components/atoms/CreatedAt";
import { userTypeEnum } from "@/types/register";
import UserCard from "../UserCard";

const UserComment = ({
  item,
  width,
  setShowReply,
  showReply,
  setReplyingTo,
  likePostCommentHandler,
  setShowTotalReply,
  showTotalReply,
  handleNavigate,
  setModalVisible,
  type,
}: CommentsProp) => {
  const userData = getUserStore();
  const { mutate: deleteUserPost } = useDeleteUserPostComment();
  const { mutate: deleteCommunityPost } = useDeleteCommunityPostComment();
  const role = item?.commenterProfileId?.role;
  const isStudent = role === userTypeEnum.Student;
  const handleDelete = () => {
    if (type === PostType.Community) {
      deleteCommunityPost(item._id);
    } else {
      deleteUserPost(item._id);
    }
  };

  const handleReplyTo = (data: any) => {
    if (setModalVisible) {
      setReplyingTo({
        commentId: data?._id,
        name: data?.commenterId.firstName,
        level: 1,
        profileDp: data?.commenterProfileId?.profile_dp?.imageUrl,
      });
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View className="flex flex-row justify-between   ">
        <UserCard
          userId={item?.commenterId?._id}
          firstName={item?.commenterId?.firstName}
          lastName={item?.commenterId?.lastName}
          imageUrl={item?.commenterProfileId?.profile_dp?.imageUrl}
          isStudent={isStudent}
          studyYear={item?.commenterProfileId?.study_year}
          major={item?.commenterProfileId?.major}
          occupation={item?.commenterProfileId?.occupation}
          affiliation={item?.commenterProfileId?.affiliation}
          onNavigate={handleNavigate}
          toShowOption={userData?.id === item?.commenterId?._id}
          handleDelete={handleDelete}
        />
      </View>
      {/* comment  */}
      <View>
        <RenderHTML
          contentWidth={width}
          source={{ html: item?.content }}
          tagsStyles={{
            p: {
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0,
            },
            body: { color: "black" },
          }}
          ignoredDomTags={["label", "input"]}
          defaultTextProps={{
            style: {
              color: "#3A3B3C",
              fontSize: 14,
              fontWeight: "500",
            },
          }}
        />
      </View>
      <ImageGallery
        images={item?.imageUrl}
        imageCount={item?.imageUrl?.length}
      />

      <RenderCreatedAt date={item?.createdAt} />

      <View className="flex flex-row justify-end">
        <View className="flex flex-row gap-4">
          {item?.level == 0 && (
            <TouchableOpacity
              onPress={() => handleReplyTo(item)}
              className="flex flex-row gap-1 items-center"
            >
              <Text style={styles.commentIconText}>Reply</Text>
              <Reply height={16} width={16} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() =>
              likePostCommentHandler(item._id, item.level.toString())
            }
            className="flex flex-row gap-1 items-center"
          >
            <Text style={styles.commentIconText}>
              {item?.likeCount?.length}
            </Text>
            <ThumbsUp
              height={16}
              width={16}
              color={
                item?.likeCount?.some(
                  (like: any) => like.userId === userData?.id,
                )
                  ? "#6647FF"
                  : "#6B7280"
              }
            />
          </TouchableOpacity>

          {item?.level == 0 && (
            <TouchableOpacity
              // onPress={() => commentBottomSheet.current?.show()}
              className="flex flex-row gap-1 items-center"
              onPress={() => setShowReply(showReply.length ? "" : item._id)}
            >
              <Text style={styles.commentIconText}>
                {item.totalCount || item?.replies?.length}
              </Text>
              <ChatBubbleEmpty height={16} width={16} />
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity className="flex flex-row gap-1 items-center">
            <ShareAndroid height={16} width={16} />
          </TouchableOpacity> */}
        </View>
      </View>
      {item?.replies?.length > 0 && showReply == item._id && (
        <View style={styles.repliesContainer}>
          {item.replies
            .slice(0, showTotalReply)
            .map((reply: any, index: number) => (
              <UserComment
                setReplyingTo={setReplyingTo}
                key={index}
                item={reply}
                width={width}
                likePostCommentHandler={likePostCommentHandler}
                setShowTotalReply={setShowTotalReply}
                showTotalReply={showTotalReply}
                type={type}
              />
            ))}
          {item?.level === 0 &&
            showReply == item._id &&
            item?.replies?.length > showTotalReply && (
              <TouchableOpacity
                onPress={() => setShowTotalReply(showTotalReply + 4)}
                style={styles.showMoreButton}
              >
                <Text style={styles.showMoreText}>Show More</Text>
              </TouchableOpacity>
            )}
        </View>
      )}
    </View>
  );
};

export default UserComment;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    display: "flex",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 26,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600",
  },
  userDetails: {
    fontSize: 12,
    color: "#6B7280",
  },
  moreButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 999,
    padding: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  repliesContainer: {
    marginLeft: 20,
  },
  showMoreButton: {
    paddingVertical: 4,
  },
  showMoreText: {
    color: "#6647FF",
    fontSize: 14,
  },
  commentIconText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
