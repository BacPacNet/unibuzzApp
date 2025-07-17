import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BackHeader from "@/components/atoms/BackHeader";
import { useNavigation } from "@react-navigation/native";
import ReusableButton from "@/components/atoms/ReusableButton";
import { Refresh, SendSolid } from "iconoir-react-native";
import ChatMessage from "@/components/molecules/AiAssistant/ChatBubbleMessage";

const AI_Assistant = () => {
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: "none" } });
  }, [navigation]);

  const handleTextChange = (text: string) => {
    setText(text);
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.paddingBottom}
        className="  flex flex-row gap-4 items-center justify-between "
      >
        <BackHeader
          label="Home"
          onPress={() => navigation.goBack()}
          isLeftPadding={true}
        />

        <View
          style={{ marginTop: 16 }}
          className="flex flex-row items-center gap-4 px-4"
        >
          <ReusableButton
            variant="shade"
            size={89}
            height="small"
            buttonText="Refresh"
            buttonContent={
              <View className="flex flex-row items-center gap-2">
                <Text className="text-primary-500">Refresh</Text>
                <Refresh height={16} width={16} color={"#6744FF"} />
              </View>
            }
          />
        </View>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView style={styles.paddingHorizontal}>
          <ChatMessage
            isMine={false}
            avatar={""}
            message="How can I help you today?"
          />
          <ChatMessage
            isMine={true}
            avatar={""}
            message="Show me the upcoming course list for my major!"
          />
          <ChatMessage
            isMine={false}
            avatar={""}
            message={
              `Here are your courses for your upcoming semester Y2025 Q1 for Literature Major:\n\n` +
              `Core Courses:\n` +
              `• IMAG101 – Introduction to Creative Thinking\n` +
              `• IMAG201 – Advanced Hypotheticals: The Art of "What If"\n` +
              `• IMAG301 – The Science of Fictional Realities\n` +
              `• IMAG401 – Mastering Narrative Logic .....`
            }
          />
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={(text) => handleTextChange(text)}
            placeholder="Type a message"
            multiline
            style={styles.input}
            className="text-base p-1"
          />
          <TouchableOpacity className="absolute bottom-0 right-4 bg-primary-500 w-8 h-8  flex items-center justify-center rounded-full mb-2 disabled:opacity-50">
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
  paddingBottom: {
    paddingBottom: 16,
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
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
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    paddingTop: 16,
  },

  input: {
    fontSize: 16,
    paddingHorizontal: 8,
    height: "auto",
    color: "#3A3B3C",
  },
});
