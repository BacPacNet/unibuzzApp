import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OpenInBrowser, WhiteFlag, Bin } from "iconoir-react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { ContentType } from "@/types/report-content";
import { getUserStore } from "@/storage/user";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  handleDeletePost: () => void;
  isAdmin: boolean;
  postId: string;
  type: string;

  closeDropdown: () => void;
  handleReportPost: () => void;
};

const PostCardOption = ({
  handleDeletePost,
  isAdmin,
  postId,
  type,
  closeDropdown,
  handleReportPost,
}: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const openPost = () => {
    navigation.navigate("SinglePost", {
      postID: postId,
      type,
    });
  };

  return (
    <View className="flex gap-2 absolute bg-white shadow-md w-48 top-12 right-4 z-10 rounded-md">
      <TouchableOpacity
        onPress={() => {
          openPost();
          closeDropdown?.();
        }}
        className={`flex flex-row items-center gap-2 p-2`}
      >
        <OpenInBrowser width={20} height={20} color="#3A3B3C" />
        <Text style={styles.text} className={` `}>
          Open Post
        </Text>
      </TouchableOpacity>
      {!isAdmin && (
        <TouchableOpacity
          onPress={() => {
            handleReportPost();
          }}
          className={`flex flex-row items-center gap-2 p-2`}
        >
          <WhiteFlag width={20} height={20} color="#3A3B3C" />
          <Text style={styles.text} className={` `}>
            Report this post
          </Text>
        </TouchableOpacity>
      )}
      {isAdmin && (
        <TouchableOpacity
          onPress={() => {
            handleDeletePost();
          }}
          className={`flex flex-row items-center gap-2 p-2`}
        >
          <Bin width={20} height={20} color="#3A3B3C" />
          <Text style={styles.text} className={` `}>
            Delete Post
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PostCardOption;

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: "#3A3B3C",
    fontWeight: "500",
  },
});
