import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChatBubbleEmpty, Reply, ThumbsUp } from "iconoir-react-native";

import { getUserStore } from "@/storage/user";
import RenderHTML from "react-native-render-html";
import ImageGallery from "../../ImageGrid";
import { CommentsProp, PostType } from "@/types/postType";
import { useDeleteUserPostComment } from "@/services/timeline";
import { useDeleteCommunityPostComment } from "@/services/communityPost";

import { userTypeEnum } from "@/types/register";
import UserCard from "../UserCard";
import { timeAgo } from "@/utils";

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
  showBorder = false,
}: CommentsProp) => {
  const userData = getUserStore();
  const { mutate: deleteUserPost } = useDeleteUserPostComment();
  const { mutate: deleteCommunityPost } = useDeleteCommunityPostComment();
  const role = item?.commenterProfileId?.role;

  const isStudent = role === userTypeEnum.Student;
  const handleDelete = () => {
    if (type === PostType.Community) {
      Alert.alert(
        "Delete Comment",
        "Are you sure you want to delete this comment?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "Delete", onPress: () => deleteCommunityPost(item._id) },
        ]
      );
      //   deleteCommunityPost(item._id);
    } else {
      Alert.alert(
        "Delete Comment",
        "Are you sure you want to delete this comment?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "Delete", onPress: () => deleteUserPost(item._id) },
        ]
      );
      //   deleteUserPost(item._id);
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
    <View
      style={[
        styles.container,
        showBorder && {
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        },
      ]}
    >
      <View className="flex flex-row justify-between">
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
            body: {
              margin: 0,
              padding: 0,
              color: "#3A3B3C",
            },
            p: {
              margin: 0,
              padding: 0,
              fontSize: 14,
            },
            div: {
              margin: 0,
              padding: 0,
            },
            ol: {
              margin: 0,
              padding: 0,
              paddingLeft: 20,
            },
            ul: {
              margin: 0,
              padding: 0,
              paddingLeft: 20,
            },
            li: {
              margin: 0,
              padding: 0,
              fontSize: 14,
            },
            code: {
              fontFamily: "monospace",
              backgroundColor: "#f0f0f0",
              padding: 2,
              paddingLeft: 4,
              paddingRight: 4,
              borderRadius: 3,
              fontSize: 13,
              color: "#3A3B3C",
            },
          }}
          ignoredDomTags={["label", "input"]}
        />
      </View>
      <ImageGallery
        images={item?.imageUrl}
        imageCount={item?.imageUrl?.length}
      />

      <View className="flex flex-row justify-between">
        <Text style={styles.commentIconText}>
          {timeAgo(item?.createdAt)} ago
        </Text>
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
                    (like: any) => like.userId === userData?.id
                  )
                    ? "#6647FF"
                    : "#6B7280"
                }
              />
            </TouchableOpacity>

            {item?.level == 0 &&
              (item?.replies?.length > 0 || Number(item?.totalCount) > 0) && (
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
      </View>

      {item?.replies?.length > 0 && showReply == item._id && (
        <View
          style={[
            styles.repliesContainer,
            showReply == item._id && {
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
            },
          ]}
        >
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
                showBorder={true}
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
    // paddingHorizontal: 12,
    marginHorizontal: 16,
    paddingVertical: 16,
    display: "flex",
    gap: 16,
    borderBottomColor: "#E5E7EB",
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
