import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import avatar from "../../../../assets/avatar.png";
import { useCreateUserChat } from "@/services/Messages";

interface user {
  _id: string;
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  profile: {
    study_year: string;
    degree: string;
    major: string;
    profile_dp: {
      imageUrl: string;
    };
  };
}

type Props = {
  user: user;
  setSelectedChat: (value: user) => void;
  setCurrTab: (value: string) => void;
};

const SelectUser = ({ user, setSelectedChat, setCurrTab }: Props) => {
  const { mutateAsync: mutateCreateUserChat } = useCreateUserChat();

  const handleUserClick = async (userId: string) => {
    const createChatResponse: any = await mutateCreateUserChat({
      userId: userId,
    });
    setCurrTab("Inbox");
    setSelectedChat(createChatResponse);
  };
  return (
    <View className=" flex flex-row justify-between items-center border-t border-neutral-200 p-4 ">
      <View className="flex flex-row gap-2 ">
        <Image
          source={
            user?.profile?.profile_dp?.imageUrl
              ? { uri: user?.profile?.profile_dp?.imageUrl }
              : avatar
          }
          style={{ width: 48, height: 48 }}
          className="w-12 h-12 rounded-full"
          resizeMode="cover"
        />

        <View className="">
          <Text
            style={{ padding: 0, margin: 0 }}
            className="font-semibold text-neutral-900 "
          >
            {" "}
            {user?.firstName} {user?.lastName}
          </Text>
          <View style={{ marginStart: 6 }}>
            <Text style={{ fontSize: 12 }} className="text-neutral-500 ">
              3rd Yr. undergraduate
            </Text>
            <Text style={{ fontSize: 12 }} className="text-neutral-500 ">
              Biological engineering
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleUserClick(user._id)}
        className="bg-primary-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white font-bold">New Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectUser;
