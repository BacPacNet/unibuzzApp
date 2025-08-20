import { FONTS } from "@/constants/fonts";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
    <View
      style={styles.container}
      className=" border-b border-neutral-200 bg-white "
    >
      <View className="flex flex-row items-center justify-between ">
        <TouchableOpacity
          onPress={() => {
            setCurrTab("Inbox");
            setSelectedChat(undefined);
          }}
          style={[styles.tab, currTab == "Inbox" && styles.activeTab]}
          className={`flex flex-row items-center  w-1/2 px-4 py-4 `}
        >
          <View className="flex flex-row items-center gap-2 justify-center w-full">
            {/* <MailSolid height={24} width={24} /> */}
            <Text
              style={[styles.text, currTab === "Inbox" && styles.activeText]}
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
          style={[styles.tab, currTab == "Requests" && styles.activeTab]}
          className={`flex flex-row items-center  w-1/2 px-4 py-4 `}
        >
          <View className="flex flex-row items-center justify-center gap-2 w-full">
            {/* <MultiBubbleSolid height={24} width={24} /> */}
            <Text
              style={[styles.text, currTab === "Requests" && styles.activeText]}
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

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  text: {
    fontFamily: FONTS.inter.extraBold,
    fontSize: 14,
    color: "#9CA3AF",
  },
  activeText: {
    color: "#3A169C",
  },
  tab: {
    borderBottomWidth: 2,
    borderBottomColor: "#D1D5DB",
  },
  activeTab: {
    borderBottomColor: "#3A169C",
  },
});
