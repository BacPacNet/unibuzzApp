import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MailSolid, MultiBubbleSolid } from "iconoir-react-native";

type Props = {
  setCurrTab: (value: string) => void;
  setSelectedChat: (value: undefined) => void;
  currTab: string;
  unreadChatsCount: number;
  unreadNotAcceptedChatsCount: number;
};

const MessageTopBar = ({
  currTab,
  setCurrTab,
  unreadNotAcceptedChatsCount,
  setSelectedChat,
  unreadChatsCount,
}: Props) => {
  return (
    <View className=" border-b border-neutral-200 bg-white">
      <View className="flex flex-row items-center justify-between ">
        <TouchableOpacity
          onPress={() => {
            setCurrTab("Inbox");
            setSelectedChat(undefined);
          }}
          className={`flex flex-row items-center ${currTab == "Inbox" && "border-b border-primary-500"} w-1/2 px-4 py-4 `}
        >
          <View className="flex flex-row items-center gap-2 justify-center w-full">
            <MailSolid height={24} width={24} />
            <Text
              className={`text-sm text-center   font-medium ${currTab === "Inbox" ? "text-primary-500 font-semibold" : "text-neutral-500"}`}
            >
              Inbox
            </Text>
            {unreadChatsCount > 0 && (
              <View className="bg-destructive-600 w-6 h-6 rounded-full flex items-center justify-center">
                <Text className="text-white text-xs font-semibold">
                  {unreadChatsCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCurrTab("Requests");
            setSelectedChat(undefined);
          }}
          className={`flex flex-row items-center  ${currTab == "Requests" && "border-b border-primary-500"} w-1/2 px-4 py-4 `}
        >
          <View className="flex flex-row items-center justify-center gap-2 w-full">
            <MultiBubbleSolid height={24} width={24} />
            <Text
              className={`text-sm text-center font-medium ${currTab === "Requests" ? "text-primary-500" : "text-neutral-500"}`}
            >
              Requests
            </Text>
            {unreadNotAcceptedChatsCount > 0 && (
              <View className="bg-destructive-600 w-6 h-6 rounded-full flex items-center justify-center">
                <Text className="text-white text-xs font-semibold">
                  {unreadNotAcceptedChatsCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => {
            setCurrTab('Starred');
            setSelectedChat(undefined);
          }}
        >
          <Text
            className={`text-sm font-medium ${currTab === 'Starred' ? 'text-primary-500' : 'text-neutral-500'}`}
          >
            Starred
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default MessageTopBar;
