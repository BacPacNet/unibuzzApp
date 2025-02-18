import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import avatar from "../../../../assets/avatar.png";
import { MoreHoriz } from "iconoir-react-native";
import PostCardOption from "../PostCardOption";
import { useDeleteUserPost } from "@/services/timeline";
import { useDeleteCommunityPost } from "@/services/communityPost";
type Props = {
  name: string;
  year: string;
  degree: string;
  major: string;
  dp: string;
  postId: string;
  type: "Community" | "Timeline";
  isAdmin: boolean;
};

const PostCardUserDetails = ({
  name,
  year,
  degree,
  dp,
  isAdmin,
  postId,
  type,
  major,
}: Props) => {
  const [visible, setVisible] = useState(false);

  const { mutate: mutateDeletePost } = useDeleteUserPost();
  const { mutate: mutateDeleteCommunityPost } = useDeleteCommunityPost();

  const handleDeletePost = () => {
    if (type === "Community") {
      mutateDeleteCommunityPost(postId);
    }
    if (type === "Timeline") {
      mutateDeletePost(postId);
    }
    setVisible(false);
  };
  return (
    <View className=" flex flex-row justify-between items-center    py-2 px-4">
      {visible && (
        <PostCardOption handleDeletePost={handleDeletePost} isAdmin={isAdmin} />
      )}
      <View className="flex flex-row gap-2 ">
        <Image
          source={dp && dp?.trim().length > 0 ? { uri: dp } : avatar}
          style={styles.ImageSize}
          className="w-12 h-12 rounded-full"
          resizeMode="cover"
        />

        <View className="">
          <Text className="font-semibold text-neutral-900 ">{name}</Text>
          <View>
            <Text style={styles.fontSize} className="text-neutral-500 ">
              {year} {degree}
            </Text>
            <Text style={styles.fontSize} className="text-neutral-500 ">
              {major}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={styles.dotBg}
        className="bg-neutral-100 rounded-full p-2"
      >
        <MoreHoriz height={24} width={24} />
      </TouchableOpacity>
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
    fontSize: 12,
  },

  dotBg: {
    backgroundColor: "#f5f5f5",
  },
});
