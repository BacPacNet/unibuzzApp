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
import { MailOutSolid, Search } from "iconoir-react-native";
import ChatIcon from "@/assets/icons/chatIcon.svg";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

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
  const userData = getUserStore();
  const navigation = useNavigation<any>();
  const handleClick = (item: Chat) => {
    setSelectedChat(item);
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const queryClient = useQueryClient();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    queryClient.invalidateQueries({ queryKey: ["userChats"] });
    setRefreshing(false);
  }, []);

  const RenderChats = () => {
    if (currTabb === "Inbox") {
      const filteredChats = chats?.filter(
        (item: Chat) =>
          item?.users?.find(
            (user) =>
              user?.userId?._id?.toString() === userData?.id &&
              user?.isRequestAccepted
          ) ||
          item?.isRequestAccepted ||
          item?.groupAdmin?.toString() === userData?.id
      );
      if (isChatLoading) {
        return (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#7367f0" />
          </View>
        );
      }

      if (filteredChats?.length === 0) {
        return (
          <Text className="text-neutral-500 text-center py-16">
            There are no chats in your Inbox yet.
          </Text>
        );
      }

      return filteredChats?.map((item: Chat) => (
        <TouchableOpacity
          onPress={() => {
            handleClick(item);
          }}
          key={item?._id}
          className="flex  flex-col  gap-2 border-b border-neutral-200 "
          style={{ marginHorizontal: 16 }}
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
              userData?.id || " "
            )}
            lastMessage={item?.latestMessage?.content}
            date={item?.latestMessage?.createdAt}
            YourID={userData?.id}
            unRead={item?.unreadMessagesCount}
          />
        </TouchableOpacity>
      ));
    } else if (currTabb === "Requests") {
      const filteredChats = chats?.filter((item: Chat) =>
        item?.isGroupChat
          ? item?.users?.some(
              (user) =>
                user?.userId?._id?.toString() === userData?.id &&
                !user?.isRequestAccepted
            )
          : !item?.isRequestAccepted &&
            item?.groupAdmin?.toString() !== userData?.id
      );
      if (filteredChats?.length === 0) {
        return (
          <Text className="text-neutral-500 text-center py-8">
            You have no message requests at the moment.
          </Text>
        );
      }

      return filteredChats?.map((item: Chat) => (
        <TouchableOpacity
          onPress={() => setSelectedChat(item)}
          key={item?._id}
          className="flex  flex-col  gap-2 border-b border-neutral-200 "
          style={{ marginHorizontal: 16 }}
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
              userData?.id || " "
            )}
            lastMessage={item?.latestMessage?.content}
            date={item?.latestMessage?.createdAt}
            YourID={userData?.id}
            unRead={item?.unreadMessagesCount}
          />
        </TouchableOpacity>
      ));
    }
  };

  return (
    <View className="relative h-full flex-1">
      <View className="p-4  flex flex-row gap-2 ">
        <View className="relative flex-1">
          <TextInput
            placeholder="Search Messages"
            placeholderTextColor={"#6B7280"}
            className="border border-neutral-200 p-2 text-neutral-500  rounded-lg "
            style={{ paddingEnd: 40, height: 40 }}
          />
          <Search
            style={{ position: "absolute", top: 10, right: 8 }}
            height={20}
            width={20}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("NewChatScreen")}>
          <ChatIcon width={40} height={40} color={"#6744FF"} strokeWidth={2} />
        </TouchableOpacity>
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
