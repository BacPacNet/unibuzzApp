import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import avatar from "../../../../assets/avatar.png";
import { MoreHoriz, NavArrowLeft } from "iconoir-react-native";
import {
  useAcceptGroupRequest,
  useAcceptRequest,
  useDeleteChatGroup,
  useLeaveGroup,
  useToggleBlockMessages,
} from "@/services/Messages";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommunityChat } from "@/types/constant";
import MessageUserOptions from "../MessageUserOptions";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";
import { screenName } from "@/constant/screenName";
import { StyleSheet } from "react-native";
import { Community as CommunityIcon } from "iconoir-react-native";

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
  userId: string;
  selectedUserId: string | null;
  isDeletedUser: boolean;
};

type User = {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    isBlocked: boolean;
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
  userId,
  selectedUserId,
  isDeletedUser,
}: Props) => {
  const userName =
    users?.flat().filter((item) => item?.userId?._id !== yourID) || [];
  const isBlockedByUser =
    users?.flat().some((user) => user?.userId?.isBlocked) || false;
  const { mutate: acceptRequest } = useAcceptRequest();
  const { mutate: acceptGroupRequest } = useAcceptGroupRequest();
  const { mutate: toggleBlockMessage } = useToggleBlockMessages(
    userName?.[0]?.userId?._id,
    isBlockedByYou
  );
  const { mutate: leaveGroup } = useLeaveGroup(chatId);
  const { mutate: mutateDeleteChatGroup } = useDeleteChatGroup(chatId);

  const bottomSheet = useRef<ActionSheetRef>(null);
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const toShowPopover =
    (isDeletedUser || isBlockedByUser) && !isGroupChat ? false : true;

  const handleMoveToInbox = () => {
    if (isGroupChat) {
      acceptGroupRequest({ chatId });
    } else {
      acceptRequest({ chatId });
    }
    setCurrTab("Inbox");
  };

  const handleBack = () => {
    if (selectedUserId && selectedUserId.length > 0) {
      navigation.navigate("Messages", {
        screen: "Messages",
        params: { selectedUserId: null },
      });
      setSelectedChat(undefined);
    } else {
      setSelectedChat(undefined);
    }
  };

  useCustomBackHandler(handleBack);

  const navigateToMembers = () => {
    navigation.navigate("ChatMembersScreen", {
      chatId,
      groupAdmin,
    });
  };

  const navigateToEditGroup = () => {
    navigation.navigate("EditChatScreen", {
      chatId,
      groupLogo: profileCover || "",
      groupCurrentName: name,
      communitySelected: communitySelected,
    });
  };

  const handleNavigateToProfile = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: userId, chatId: chatId, from: screenName.message },
    });
  };

  return (
    <View className=" fixed w-full top-0 z-10 flex flex-row justify-between border-b border-neutral-200 bg-white py-4 px-4">
      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity onPress={handleBack}>
          {/* <IoIosArrowBack className="w-8 h-8 text-[#6744FF]" /> */}
          <NavArrowLeft
            height={24}
            width={24}
            color="#6744FF"
            strokeWidth={3}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isGroupChat}
          onPress={handleNavigateToProfile}
          className="relative flex flex-row items-center gap-2"
        >
          {isGroupChat && !profileCover?.length ? (
            <View style={styles.communityImagePlaceHolder}>
              <CommunityIcon
                width={40}
                height={49}
                fill={"#6647FF"}
                color={"#6647FF"}
              />
            </View>
          ) : (
            <Image
              source={profileCover ? { uri: profileCover } : avatar}
              style={{ width: 48, height: 48, borderRadius: 100 }}
              className="w-12 h-12"
            />
          )}

          {/* <View
            style={{ right: -3 }}
            className={`absolute bottom-0 w-4 h-4 rounded-full border-2 border-white ${
              userName?.some((item) => item?.isOnline)
                ? "bg-success-500"
                : "bg-neutral-300"
            }`}
          /> */}
          <Text style={{ width: "65%" }} numberOfLines={1} ellipsizeMode="tail"  className="text-neutral-700 font-bold text-sm ">{name}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row gap-4 items-center">
        {/* {isRequestNotAccepted && (
          <ReusableButton
            buttonText="Move to inbox"
            onPress={handleMoveToInbox}
            variant="shade"
            size={113}
            height="small"
            isRounded={false}
          />
        )} */}

        <View className="relative">
          {toShowPopover && (
            <TouchableOpacity
              style={{ backgroundColor: "#F3F2FF" }}
              className=" rounded-full p-2"
              onPress={() => bottomSheet.current?.show()}
            >
              <MoreHoriz height={24} width={24} color="#6744FF" />
            </TouchableOpacity>
          )}
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
          handleDeleteGroup={() => mutateDeleteChatGroup()}
          navigateToEditGroup={navigateToEditGroup}
          isAdmin={groupAdmin == yourID}
          handleNavigate={navigateToMembers}
          handleNavigateToProfile={handleNavigateToProfile}
        />
      </ActionSheet>
    </View>
  );
};

export default MessageUserStickyBar;

const styles = StyleSheet.create({
  communityImagePlaceHolder: {
    width: 46,
    height: 46,
    borderRadius: 200,
    backgroundColor: "#fafafa",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

});
