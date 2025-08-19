import React from "react";
import { View, Text, Image } from "react-native";
import avatar from "../../../../assets/avatar.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Attachment } from "iconoir-react-native";
import { formatRelativeTime } from "@/utils";
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
    <View className="flex flex-row justify-between py-4 ">
      <View className="flex-1 flex-row items-center gap-4 relative">
        <View className="w-12 h-12 ">
          {isGroupChat && !profilePic ? (
            <Image
              source={avatar}
              style={{
                width: 48,
                height: 48,
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
        </View>

        <View className=" flex-1 flex-row items-center ">
          {/* Name and Last Message */}
          <View className=" flex-1 ">
            <View className="flex-row items-center gap-2 ">
              <Text className={`text-neutral-700 text-2xs font-semibold`}>
                {isGroupChat ? groupName : userName[0]?.userId?.firstName}
              </Text>
              <Text className="text-neutral-500 text-2xs text-center">
                {date?.length ? formatRelativeTime(new Date(date)) : ""}
              </Text>
            </View>

            <View className="">
              <Text
                className={`text-neutral-500 text-3xs  ${
                  unRead > 0 ? "font-semibold" : "font-medium"
                }`}
                numberOfLines={2} // Adjust to limit the number of lines for lastMessage
                ellipsizeMode="tail" // Truncates text with "..." if it overflows
              >
                {lastMessage === undefined ? (
                  "Start a chat"
                ) : lastMessage === "" ? (
                  <>
                    <Attachment
                      width={16}
                      height={16}
                      className="text-neutral-500 text-sm"
                    />
                    sent an attachment
                  </>
                ) : (
                  lastMessage
                )}
              </Text>
            </View>
          </View>

          {/* Timestamp */}

          <View className="flex justify-center items-center">
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
