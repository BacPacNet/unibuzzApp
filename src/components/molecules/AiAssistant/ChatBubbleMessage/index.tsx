import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Avatar from "@/assets/avatar.svg";
import BotAvatar from "@/assets/chatbot/aiIcon.svg";
const ChatMessage = ({
  isMine,
  message,
  avatar,
}: {
  isMine: boolean;
  message: string;
  avatar: string;
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
        <Text
          style={[
            styles.messageText,
            isMine ? styles.mineMessageText : styles.theirMessageText,
          ]}
        >
          {message}
        </Text>
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
    padding: 10,
    borderRadius: 15,
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
  mineMessageText: {
    color: "#6744FF",
  },
  theirMessageText: {
    color: "#3A3B3C",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
  },
});

export default ChatMessage;
