import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import avatar from "../../../../assets/avatar.png";

import { MoreHoriz, NavArrowLeft } from "iconoir-react-native";
import {
  useAcceptGroupRequest,
  useAcceptRequest,
  useToggleBlockMessages,
} from "@/services/Messages";

type Props = {
  setSelectedChat: (value: any) => void;
  yourID: string;
  users: User[];
  name: string;
  isRequestNotAccepted: boolean;
  isGroupChat: boolean;
  chatId: string;
  profileCover: string | undefined;
  description: string;

  setAcceptedId: (value: string) => void;
  setCurrTab: (value: string) => void;
};

type User = {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isOnline?: boolean;
  isStarred: boolean;
};

const MessageUserStickyBar = ({
  setSelectedChat,
  users,
  yourID,
  name,
  isRequestNotAccepted,
  isGroupChat,
  chatId,
  profileCover,
  description,

  setCurrTab,
}: Props) => {
  const userName =
    users?.flat().filter((item) => item.userId._id !== yourID) || [];
  const [showDropDown, setShowDropDown] = useState(false);
  const { mutate: acceptRequest } = useAcceptRequest();
  const { mutate: acceptGroupRequest } = useAcceptGroupRequest();
  const { mutate: toggleBlockMessage } = useToggleBlockMessages(
    userName[0]?.userId?._id
  );

  const handleMoveToInbox = () => {
    if (isGroupChat) {
      acceptGroupRequest({ chatId });
    } else {
      acceptRequest({ chatId });
    }
    setCurrTab("Inbox");
  };

  const handleBack = () => {
    setSelectedChat(undefined);
  };

  return (
    <View className="fixed w-full top-0 z-10 flex flex-row justify-between border-b border-neutral-300 bg-white py-2 px-4">
      <View className="flex flex-row items-center gap-4">
        <TouchableOpacity onPress={handleBack}>
          {/* <IoIosArrowBack className="w-8 h-8 text-[#6744FF]" /> */}
          <NavArrowLeft height={24} width={24} />
        </TouchableOpacity>
        <View className="relative">
          <Image
            source={profileCover ? { uri: profileCover } : avatar}
            style={{ width: 44, height: 44, borderRadius: 22 }}
            className="w-12 h-12"
          />
          <View
            style={{ right: -3 }}
            className={`absolute bottom-0 w-4 h-4 rounded-full border-2 border-white ${
              userName?.some((item) => item?.isOnline)
                ? "bg-success-500"
                : "bg-neutral-300"
            }`}
          />
        </View>
        <View>
          <Text className="text-lg font-semibold text-neutral-700">{name}</Text>
          {isGroupChat ? (
            <Text className="text-sm font-normal text-neutral-500">
              {description}
            </Text>
          ) : (
            <>
              {/* <Text className="text-2xs font-normal text-neutral-500">{universitry}</Text> */}
            </>
          )}
        </View>
      </View>
      <View className="flex flex-row gap-4 items-center">
        <View className="relative">
          <TouchableOpacity onPress={() => setShowDropDown(!showDropDown)}>
            <MoreHoriz height={24} width={24} />
          </TouchableOpacity>

          {showDropDown && (
            <View className="flex gap-2 absolute bg-white p-4 shadow-md w-48 top-6 -left-36">
              {isRequestNotAccepted && (
                <TouchableOpacity onPress={() => handleMoveToInbox()}>
                  <Text>Move to Inbox</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => toggleBlockMessage({ chatId })}>
                <Text>Block Messages </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text>Report User Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageUserStickyBar;
