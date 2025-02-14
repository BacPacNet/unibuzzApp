import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import avatar from "../../../../assets/avatar.png";
import { MoreHoriz, NavArrowLeft } from "iconoir-react-native";
type Props = {
  name: string;
  year: string;
  degree: string;
  dp: string;
};

const PostCardUserDetails = ({ name, year, degree, dp }: Props) => {
  return (
    <View className=" flex flex-row justify-between items-center    py-2 px-4">
      <View className="flex flex-row gap-2 ">
        <Image
          //   source={avatar}
          source={dp && dp?.trim().length > 0 ? { uri: dp } : avatar}
          style={{ width: 48, height: 48 }}
          className="w-12 h-12 rounded-full"
          resizeMode="cover"
        />

        <View className="">
          <Text
            style={{ padding: 0, margin: 0 }}
            className="font-semibold text-neutral-900 "
          >
            {name}
          </Text>
          <View>
            <Text style={{ fontSize: 12 }} className="text-neutral-500 ">
              {year} {degree}
            </Text>
            <Text style={{ fontSize: 12 }} className="text-neutral-500 ">
              Biological engineering
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={{ backgroundColor: "#f5f5f5" }}
        className="bg-neutral-100 rounded-full p-2"
      >
        <MoreHoriz height={24} width={24} />
      </TouchableOpacity>
    </View>
  );
};

export default PostCardUserDetails;
