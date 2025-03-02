import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import avatar from "../../../../assets/avatar.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type User = {
  userId: {
    _id: string;
    firstName: string;
  };

  isOnline: boolean;
  isRequestAccepted: boolean;
};

type Props = {
  profilePic: string | undefined;
  users: User[][];
  lastMessage: string;
  date: string;
  YourID: string | undefined;
  groupName?: string;
  isGroupChat: boolean;
  isSeen: boolean;
  unRead: number;
};

const UserChatCard = ({
  profilePic,
  users,
  lastMessage,
  isSeen,
  date,
  YourID,
  groupName,
  isGroupChat,
  unRead,
}: Props) => {
  const userName = users?.flat().filter((item) => item.userId._id !== YourID);

  return (
    <View className="flex flex-row justify-between p-4 ">
      <View className="flex-1 flex-row items-center gap-4 relative">
        <View className="w-12 h-12 ">
          {isGroupChat && !profilePic ? (
            <Image
              source={avatar}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
                marginRight: 4,
              }}
            />
          ) : (
            <Image
              source={profilePic ? { uri: profilePic } : avatar}
              style={{ width: 48, height: 48 }}
              className="w-12 h-12 rounded-full"
              resizeMode="cover"
            />
          )}

          {userName?.some((item) => item?.isOnline) ? (
            <View
              style={{ right: -8 }}
              className="bg-success-500 w-4 h-4 rounded-full absolute bottom-0  border-2 border-white"
            ></View>
          ) : (
            <View
              style={{ right: -8 }}
              className="bg-neutral-300 w-4 h-4 rounded-full absolute bottom-0  border-2 border-white"
            ></View>
          )}
        </View>

        <View className=" flex-1 flex-row items-center ">
          {/* Name and Last Message */}
          <View className=" flex-1 ">
            <Text
              className={`text-neutral-600 text-lg ${
                unRead > 0 ? "font-semibold" : "font-medium"
              }`}
            >
              {isGroupChat ? groupName : userName[0]?.userId?.firstName}
            </Text>
            <View className="">
              <Text
                className={`text-neutral-500 text-md  ${
                  unRead > 0 ? "font-semibold" : "font-medium"
                }`}
                numberOfLines={2} // Adjust to limit the number of lines for lastMessage
                ellipsizeMode="tail" // Truncates text with "..." if it overflows
              >
                {lastMessage}
              </Text>
            </View>
          </View>

          {/* Timestamp */}

          <View className="flex justify-center items-center">
            <Text className="text-neutral-400 text-md flex-1 text-center">
              {date && dayjs(date).fromNow()}
            </Text>
            {unRead > 0 ? (
              <View
                style={{ right: -8 }}
                className="bg-destructive-600 w-6 h-6 rounded-full    flex items-center justify-center "
              >
                <Text className="text-white text-xs font-semibold">
                  {unRead > 9 ? "9+" : unRead}
                </Text>
              </View>
            ) : (
              ""
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserChatCard;
