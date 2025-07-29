import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Avatar from "@/assets/avatar.svg";
import BotAvatar from "@/assets/chatbot/aiIcon.svg";
import ThreeDotLoader from "@/components/atoms/ThreeDotLoader";
import Markdown from "react-native-markdown-display";
const ChatMessage = ({
  isMine,
  message,
  avatar,
  isLoading,
}: {
  isMine: boolean;
  message: string;
  avatar: string;
  isLoading?: boolean;
}) => {
  return (
    <View
      style={[
        styles.container,
        isMine ? styles.mineContainer : styles.theirContainer,
      ]}
    >
      {!isMine &&
        (avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <BotAvatar width={36} height={36} />
        ))}
      <View
        style={[styles.bubble, isMine ? styles.mineBubble : styles.theirBubble]}
      >
        {isLoading ? (
          <ThreeDotLoader />
        ) : (
          <Markdown
            style={{
              paragraph: { color: isMine ? "#6744FF" : "#3A3B3C" },

              code_block: { color: "black", fontSize: 14 },
              strong: { color: "#3A3B3C" },
              em: { color: "#3A3B3C" },
              list: { color: "#3A3B3C" },
              list_item: { color: "#3A3B3C" },
              list_item_bullet: { color: "#3A3B3C" },
              list_item_number: { color: "#3A3B3C" },
            }}
          >
            {message}
          </Markdown>
        )}
      </View>
      {isMine &&
        (avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Avatar width={36} height={36} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-start",
    gap: 16,
  },
  mineContainer: {
    justifyContent: "flex-end",
  },
  theirContainer: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 6,
  },
  bubble: {
    maxWidth: "75%",
    padding: 8,
    paddingVertical: 0,
    borderRadius: 15,
    minWidth: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mineBubble: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F2FF",
  },
  theirBubble: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
  },
});

export default ChatMessage;
