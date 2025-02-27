import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import avatar from "../../../../assets/avatar.png";
import { MoreHoriz } from "iconoir-react-native";
import PostCardOption from "../PostCardOption";
import { useDeleteUserPost } from "@/services/timeline";
import { useDeleteCommunityPost } from "@/services/communityPost";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import PostOption from "@/assets/icons/postOption";
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
  setVisible: (visible: boolean) => void;
  visible: boolean;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;

const PostCardUserDetails = ({
  name,
  year,
  degree,
  dp,
  isAdmin,
  postId,
  type,
  university,
  postAdminId,
  visible,
  setVisible,
}: Props) => {
  const navigate = useNavigation<NavigationProp>();
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

  const handleNavigate = () => {
    navigate.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: postAdminId },
    });
  };

  return (
    <View className="relative flex flex-row justify-between items-center py-2 px-4">
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
          <View>
            <Text className="font-semibold text-neutral-900 text-lg">
              {name}
            </Text>
          </View>
          <View>
            <Text style={styles.fontSize} className="text-neutral-500 ">
              {year} {degree}
            </Text>
            <Text style={styles.fontSize} className="text-neutral-500 ">
              {university}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute right-4 top-1"
        onPress={() => setVisible(!visible)}
      >
        <PostOption />
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
