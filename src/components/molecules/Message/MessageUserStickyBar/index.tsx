import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import avatar from "../../../../assets/avatar.png";
import { MoreHoriz, NavArrowLeft } from "iconoir-react-native";
import {
  useAcceptGroupRequest,
  useAcceptRequest,
  useLeaveGroup,
  useToggleBlockMessages,
} from "@/services/Messages";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommunityChat, defaultBottomSheetSnapPoints } from "@/types/constant";
import MessageUserOptions from "../MessageUserOptions";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

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
  groupAdmin: string;
  setAcceptedId: (value: string) => void;
  setCurrTab: (value: string) => void;
  isBlockedByYou: boolean;
  communitySelected: CommunityChat;
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

type NavigationProp = StackNavigationProp<RootStackParamList, "Messages">;

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
  groupAdmin,
  setCurrTab,
  isBlockedByYou,
  communitySelected,
}: Props) => {
  const userName =
    users?.flat().filter((item) => item.userId._id !== yourID) || [];
  const [showDropDown, setShowDropDown] = useState(false);
  const { mutate: acceptRequest } = useAcceptRequest();
  const { mutate: acceptGroupRequest } = useAcceptGroupRequest();
  const { mutate: toggleBlockMessage } = useToggleBlockMessages(
    userName[0]?.userId?._id,
    isBlockedByYou,
  );
  const { mutate: leaveGroup } = useLeaveGroup(chatId);

  const bottomSheet = useRef<ActionSheetRef>(null);
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

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

  const navigateToMembers = () => {
    navigation.navigate("MessagesStack", {
      screen: "ChatMembersScreen",
      params: {
        users,
        chatId,
      },
    });
  };
  const navigateToEditGroup = () => {
    navigation.navigate("MessagesStack", {
      screen: "EditChatScreen",
      params: {
        chatId,
        groupLogo: profileCover || "",
        groupCurrentName: name,
        communitySelected: communitySelected,
      },
    });
  };

  return (
    <View className=" fixed w-full top-0 z-10 flex flex-row justify-between border-b border-neutral-200 bg-white py-4 px-4">
      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity onPress={handleBack}>
          {/* <IoIosArrowBack className="w-8 h-8 text-[#6744FF]" /> */}
          <NavArrowLeft height={20} width={20} color="#6744FF" />
        </TouchableOpacity>
        <View className="relative">
          <Image
            source={profileCover ? { uri: profileCover } : avatar}
            style={{ width: 48, height: 48, borderRadius: 100 }}
            className="w-12 h-12"
          />
          {/* <View
            style={{ right: -3 }}
            className={`absolute bottom-0 w-4 h-4 rounded-full border-2 border-white ${
              userName?.some((item) => item?.isOnline)
                ? "bg-success-500"
                : "bg-neutral-300"
            }`}
          /> */}
        </View>
      </View>
      <View className="flex flex-row gap-4 items-center">
        <View className="relative">
          <TouchableOpacity
            style={{ backgroundColor: "#F3F2FF" }}
            className=" rounded-full p-2"
            onPress={() => bottomSheet.current?.show()}
          >
            <MoreHoriz height={24} width={24} color="#6744FF" />
          </TouchableOpacity>
        </View>
      </View>

      <ActionSheet
        useBottomSafeAreaPadding
        ref={bottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        snapPoints={[100]}
      >
        <MessageUserOptions
          handleToggleBlockMessage={() => toggleBlockMessage({ chatId })}
          isBlockedByYou={isBlockedByYou}
          isGroupChat={isGroupChat}
          handleLeaveGroup={leaveGroup}
          navigateToEditGroup={navigateToEditGroup}
          isAdmin={groupAdmin == yourID}
          handleNavigate={navigateToMembers}
        />
      </ActionSheet>
    </View>
  );
};

export default MessageUserStickyBar;
