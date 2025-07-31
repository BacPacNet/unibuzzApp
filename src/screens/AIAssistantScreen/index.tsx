import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BackHeader from "@/components/atoms/BackHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { Refresh, SendSolid } from "iconoir-react-native";
import ChatMessage from "@/components/molecules/AiAssistant/ChatBubbleMessage";
import { useCreateChatBotMessage } from "@/services/ai-chatbot";
import {
  ChatBotMessage,
  clearChatBotMessages,
  getChatBotMessages,
} from "@/storage/chat-bot";
import { getUserStore } from "@/storage/user";
import { useForm } from "react-hook-form";
import { Toast } from "react-native-toast-notifications";
import BotAvatar from "@/assets/chatbot/aiIcon.svg";

const AI_Assistant = () => {
  const navigation = useNavigation();
  const userData = getUserStore();
  const { register, setValue, watch } = useForm({
    defaultValues: {
      text: "",
    },
  });
  const watchText = watch("text");
  const { mutate: createChatBotMessage, isPending } = useCreateChatBotMessage();
  const scrollViewRef = useRef<ScrollView>(null);
  const chatBotMessages = getChatBotMessages();
  const [chatMessages, setChatMessages] = useState<ChatBotMessage[]>([]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [chatMessages]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    }, [navigation]),
  );

  useFocusEffect(
    useCallback(() => {
      if (chatBotMessages?.length !== chatMessages?.length) {
        setChatMessages(chatBotMessages || []);
      }
    }, []),
  );

  const handleSendMessage = () => {
    if (watchText.trim() === "") {
      return Toast.show("Please enter a message", {
        type: "warning",
        placement: "top",
      });
    }

    const data: any = {
      userId: userData?.id,
      prompt: watchText,
      ...(chatBotMessages?.[chatBotMessages.length - 1]?.threadId?.length && {
        threadId: chatBotMessages[chatBotMessages.length - 1].threadId,
      }),
    };

    setChatMessages((prev) => [...prev, data]);
    createChatBotMessage(data, {
      onSuccess: (res) => {
        setChatMessages((prev) => [...prev, res]);
        // setValue("text", "");
      },
      onError: () => {
        // setValue("text", "");
      },
    });
    setValue("text", "");
  };

  const handleRefresh = () => {
    clearChatBotMessages();
    setChatMessages([]);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <BotAvatar width={350} height={140} />
      <Text style={styles.emptyStateText}>No messages yet</Text>
      <Text style={styles.emptyStateText}>Ask me anything</Text>
    </View>
  );

  const renderChatMessages = () => {
    if (chatMessages?.length === 0) {
      return renderEmptyState();
    }

    return chatMessages?.map((message, idx) => (
      <ChatMessage
        key={idx}
        isMine={!!message?.userId}
        avatar={""}
        message={message?.userId ? message.prompt : message.response}
      />
    ));
  };

  const renderLoadingMessage = () => {
    if (!isPending) return null;

    return (
      <ChatMessage isMine={false} avatar={""} message={""} isLoading={true} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <BackHeader
          label="Home"
          onPress={() => navigation.goBack()}
          isLeftPadding={true}
        />

        <View style={styles.refreshButtonContainer}>
          <ReusableButton
            onPress={handleRefresh}
            variant="shade"
            size={89}
            height="small"
            buttonText="Refresh"
            buttonContent={
              <View style={styles.refreshButtonContent}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
                <Refresh height={16} width={16} color={"#6744FF"} />
              </View>
            }
          />
        </View>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView
          style={styles.scrollView}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {renderChatMessages()}
          {renderLoadingMessage()}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            {...register("text")}
            placeholder="Type a message"
            multiline
            style={styles.input}
            value={watchText}
            onChangeText={(text) => setValue("text", text)}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
            disabled={isPending}
          >
            <SendSolid height={18} width={18} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AI_Assistant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  refreshButtonContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
  },
  refreshButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshButtonText: {
    color: "#6744FF",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  scrollView: {
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  emptyStateContainer: {
    height: 400,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyStateText: {
    color: "#6B7280",
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    position: "absolute",
    paddingBottom: 40,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 8,
    height: "auto",
    color: "#3A3B3C",
    padding: 4,
  },
  sendButton: {
    position: "absolute",
    bottom: 8,
    right: 16,
    backgroundColor: "#6744FF",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
});
