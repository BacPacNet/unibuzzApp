import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import avatar from "../../../../assets/avatar.png";
import {
  ChatBubbleEmpty,
  MoreHoriz,
  Reply,
  ShareAndroid,
  ThumbsUp,
} from "iconoir-react-native";
import dayjs from "dayjs";
import { getUserStore } from "@/storage/user";
import RenderHTML from "react-native-render-html";
import ImageGallery from "../../ImageGrid";
import { CommentsProp } from "@/types/postType";

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
}: CommentsProp) => {
  const userData = getUserStore();

  const handleReplyTo = (data: any) => {
    if (item?.level == 0) {
      setReplyingTo({
        commentId: data?._id,
        name: data?.commenterId.firstName,
        level: 1,
      });
    }
  };
  return (
    <View style={styles.container}>
      <View className="flex flex-row justify-between   ">
        <View className="flex-1 flex-row items-center gap-4 justify-center">
          <View className=" ">
            <Image
              source={
                item?.commenterProfileId?.profile_dp?.imageUrl
                  ? { uri: item?.commenterProfileId?.profile_dp?.imageUrl }
                  : avatar
              }
              style={styles.profileImage}
              className=" rounded-full"
              resizeMode="cover"
            />
          </View>

          <View className=" flex-1 flex-row items-center ">
            <TouchableOpacity
              onPress={() => handleNavigate(item?.commenterId?._id)}
              className=" flex-1 "
            >
              <Text
                className="text-neutral-600 text-lg
                 font-semibold"
              >
                {item?.commenterId?.firstName} {item?.commenterId?.lastName}
              </Text>
              <View className="flex">
                <Text style={styles.userDetails}>
                  {item?.commenterProfileId?.study_year}.
                  {item?.commenterProfileId?.degree}
                </Text>
                <Text style={styles.userDetails}>
                  {item?.commenterProfileId?.major}
                </Text>
              </View>
            </TouchableOpacity>

            <View className="flex justify-center items-center ">
              <TouchableOpacity style={styles.moreButton}>
                <MoreHoriz height={24} width={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* comment  */}
      <View>
        {/* <Text className="text-black">{item?.content}</Text> */}
        <RenderHTML
          contentWidth={width}
          source={{ html: item?.content }}
          tagsStyles={{ body: { color: "black" } }}
          ignoredDomTags={["label", "input"]}
        />
      </View>
      <ImageGallery
        images={item?.imageUrl}
        imageCount={item?.imageUrl?.length}
      />
      <View>
        <Text>{dayjs(item?.createdAt).format("h:mm A · MMM D, YYYY")}</Text>
      </View>

      <View className="flex flex-row justify-end">
        <View className="flex flex-row gap-4">
          {item?.level == 0 && (
            <TouchableOpacity
              onPress={() => handleReplyTo(item)}
              className="flex flex-row gap-2 items-center"
            >
              <Reply height={24} width={24} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => likePostCommentHandler(item._id)}
            className="flex flex-row gap-2 items-center"
          >
            <ThumbsUp
              height={24}
              width={24}
              color={
                item?.likeCount?.some(
                  (like: any) => like.userId === userData?.id,
                )
                  ? "#6647FF"
                  : "black"
              }
            />
            <Text>{item?.likeCount?.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() => commentBottomSheet.current?.show()}
            className="flex flex-row gap-2 items-center"
            onPress={() => setShowReply(showReply.length ? "" : item._id)}
          >
            <ChatBubbleEmpty height={24} width={24} />
            <Text>{item.totalCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row gap-2 items-center">
            <ShareAndroid height={24} width={24} />
          </TouchableOpacity>
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
    gap: 10,
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
    width: 52,
    height: 52,
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
});
