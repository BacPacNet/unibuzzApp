import React, { useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
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
import RenderHTML, {
  defaultHTMLElementModels,
  HTMLContentModel,
  HTMLElementModel,
} from "react-native-render-html";

type comments = {
  item: {
    _id: string;
    replies: comments[];
    likeCount: string[];
    level: number;
    commenterId: {
      firstName: string;
      lastName: string;
    };
    commenterProfileId: {
      profile_dp: {
        imageUrl: string;
      };

      university_name: string;
      study_year: string;
      degree: string;
    };
    content: string;
    createdAt: string;
    totalCount: string;
  };
  width: any;
  setShowReply?: any;
  showReply?: any;
  setReplyingTo: (value: any) => void;
  likePostCommentHandler: (value: string) => void;
  setShowTotalReply: (value: number) => void;
  showTotalReply: number;
};
const UserComment = ({
  item,
  width,
  setShowReply,
  showReply,
  setReplyingTo,
  likePostCommentHandler,
  setShowTotalReply,
  showTotalReply,
}: comments) => {
  const userData: any = getUserStore();
  //   const { width } = useWindowDimensions();

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
    <View
      style={{
        paddingHorizontal: 12,
      }}
      className="p-4 flex gap-2"
    >
      <View className="flex flex-row justify-between   ">
        <View className="flex-1 flex-row items-center gap-4 justify-center">
          <View className=" ">
            <Image
              source={
                item?.commenterProfileId?.profile_dp?.imageUrl
                  ? { uri: item?.commenterProfileId?.profile_dp?.imageUrl }
                  : avatar
              }
              style={{ width: 52, height: 52 }}
              className=" rounded-full"
              resizeMode="cover"
            />
          </View>

          <View className=" flex-1 flex-row items-center ">
            <View className=" flex-1 ">
              <Text
                className="text-neutral-600 text-sm 
                 font-semibold"
              >
                {item?.commenterId?.firstName} {item?.commenterId?.lastName}
              </Text>
              <View className="flex">
                <Text style={{ fontSize: 12 }} className="text-neutral-500 ">
                  {item?.commenterProfileId?.study_year}.
                  {item?.commenterProfileId?.degree}
                </Text>
                <Text style={{ fontSize: 12 }} className="text-neutral-500 ">
                  Biological engineering
                </Text>
              </View>
            </View>

            <View className="flex justify-center items-center ">
              <TouchableOpacity
                style={{ backgroundColor: "#f5f5f5" }}
                className="bg-neutral-100 rounded-full p-2"
              >
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
                  (like: any) => like.userId === userData?._j?.id
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
        <View style={{ marginLeft: 20 }}>
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
                style={{ paddingVertical: 4 }}
              >
                <Text style={{ color: "#6647FF", fontSize: 14 }}>
                  Show More
                </Text>
              </TouchableOpacity>
            )}
        </View>
      )}
      {/* <TouchableOpacity
        onPress={() => setShowTotalReply(showTotalReply + 2)}
        style={{ paddingVertical: 4 }}
      >
        <Text style={{ color: "#6647FF", fontSize: 14 }}>{"Show More"}</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default UserComment;
