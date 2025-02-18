import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";

import { Chat } from "@/types/ChatType";
import { getUserStore } from "@/storage/user";
import UserChatCard from "../UserChatCard";
import { Search } from "iconoir-react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  setSelectedChat: (value: Chat | undefined) => void;
  setIsRequest: (value: boolean) => void;
  selectedChat: Chat | undefined;
  currTabb: string;
  setCurrTab: any;
  chats: any;
  isChatLoading: boolean;
}

const UserChats = ({
  setSelectedChat,
  currTabb,
  chats,
  isChatLoading,
  setCurrTab,
}: Props) => {
  const userData: any = getUserStore();
  const handleClick = (item: Chat) => {
    setSelectedChat(item);
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const queryClient = useQueryClient();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({ queryKey: ["userChats"] });
  }, []);

  const RenderChats = () => {
    if (currTabb === "Inbox") {
      const filteredChats = chats?.filter(
        (item: Chat) =>
          (item.users.find(
            (user) =>
              user?.userId._id.toString() === userData?._j?.id &&
              user?.isRequestAccepted
          ) ||
            item.isRequestAccepted ||
            item.groupAdmin.toString() === userData?._j?.id) &&
          (!item.isGroupChat ? item.latestMessage : true)
      );

      if (isChatLoading) {
        return (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#7367f0" />
          </View>
        );
      }

      if (filteredChats.length === 0) {
        return (
          <Text className="text-neutral-500 text-center py-16">
            There are no chats in your Inbox yet.
          </Text>
        );
      }

      return filteredChats.map((item: Chat) => (
        <TouchableOpacity
          onPress={() => {
            handleClick(item);
          }}
          key={item?._id}
          className="flex  flex-col  gap-2 border-b border-neutral-200"
        >
          <UserChatCard
            profilePic={
              item?.isGroupChat
                ? item?.groupLogo?.imageUrl
                : item?.groupLogoImage
            }
            groupName={item?.chatName}
            isGroupChat={item?.isGroupChat}
            users={[item?.users]}
            isSeen={item?.latestMessage?.readByUsers?.includes(
              userData?._j?.id || " "
            )}
            lastMessage={item?.latestMessage?.content}
            date={item?.latestMessage?.createdAt}
            YourID={userData?._j?.id}
            unRead={item?.unreadMessagesCount}
          />
        </TouchableOpacity>
      ));
    } else if (currTabb === "Requests") {
      const filteredChats = chats?.filter((item: Chat) =>
        item.isGroupChat
          ? item.users.some(
              (user) =>
                user.userId._id.toString() === userData?._j?.id &&
                !user.isRequestAccepted
            )
          : !item.isRequestAccepted &&
            item.groupAdmin.toString() !== userData?._j?.id
      );

      if (filteredChats.length === 0) {
        return (
          <Text className="text-neutral-500 text-center py-8">
            You have no message requests at the moment.
          </Text>
        );
      }

      return filteredChats.map((item: Chat) => (
        <TouchableOpacity
          onPress={() => setSelectedChat(item)}
          key={item?._id}
          className="flex flex-col gap-2 border-t py-5 border-neutral-300"
        >
          <UserChatCard
            profilePic={
              item?.isGroupChat
                ? item?.groupLogo?.imageUrl
                : item?.groupLogoImage
            }
            groupName={item?.chatName}
            isGroupChat={item?.isGroupChat}
            users={[item?.users]}
            isSeen={item?.latestMessage?.readByUsers?.includes(
              userData?._j?.id || " "
            )}
            lastMessage={item?.latestMessage?.content}
            date={item?.latestMessage?.createdAt}
            YourID={userData?._j?.id}
            unRead={item?.unreadMessagesCount}
          />
        </TouchableOpacity>
      ));
    }
  };

  return (
    <View className="relative h-full flex-1">
      <View className="p-4 border-b border-neutral-200">
        <ReusableButton
          onPress={() => setCurrTab("Single")}
          buttonText="Start a Chat"
          variant="primary"
          textStyle="text-white"
        />
        <View className="relative ">
          <TextInput
            placeholder="Search Messages"
            className="border border-neutral-200 p-2  rounded-lg"
            style={{ paddingEnd: 40 }}
          />
          <Search
            style={{ position: "absolute", top: 10, right: 8 }}
            height={24}
            width={24}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "white",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <RenderChats />
      </ScrollView>
    </View>
  );
};

export default UserChats;
