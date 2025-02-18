import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { OpenInBrowser, WhiteFlag, Bin } from "iconoir-react-native";

type Props = {
  handleDeletePost: () => void;
  isAdmin: boolean;
};

const PostCardOption = ({ handleDeletePost, isAdmin }: Props) => {
  return (
    <View className="flex gap-2 absolute bg-white shadow-md w-48 top-16 right-0 z-40 ">
      <TouchableOpacity className={`flex flex-row items-center gap-2 p-2`}>
        <OpenInBrowser width={20} height={20} color="#6647FF" />
        <Text className={` `}>Open Post</Text>
      </TouchableOpacity>

      <TouchableOpacity className={`flex flex-row items-center gap-2 p-2`}>
        <WhiteFlag width={20} height={20} color="#6647FF" />
        <Text className={` `}>Report this post</Text>
      </TouchableOpacity>
      {isAdmin && (
        <TouchableOpacity
          onPress={() => handleDeletePost()}
          className={`flex flex-row items-center gap-2 p-2`}
        >
          <Bin width={20} height={20} color="#6647FF" />
          <Text className={` `}>Delete Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PostCardOption;
