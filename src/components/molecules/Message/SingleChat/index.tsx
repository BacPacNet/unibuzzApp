import ReusableButton from "@/components/atoms/ReusableButton";
import { NavArrowLeft, Search } from "iconoir-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useGetUserFollowingAndFollowers } from "@/services/Messages";
import SelectUser from "./SelectUser";

interface User {
  _id: string;
  profileImageUrl: string;
  firstName: string;
  profile: {
    study_year: string;
    degree: string;
    major: string;
  };
}

type Props = {
  setSelectedChat: (value: User) => void;
  setCurrTab: (value: string) => void;
};

const SingleChat = ({ setCurrTab, setSelectedChat }: Props) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const { data, isFetching } = useGetUserFollowingAndFollowers(searchInput);

  return (
    <View className="flex-1">
      <View className="  flex flex-row gap-4 items-center border-b border-neutral-300 p-4">
        <TouchableOpacity onPress={() => setCurrTab("Inbox")}>
          <NavArrowLeft height={24} width={24} />
        </TouchableOpacity>
        <Text className="">Back to Inbox</Text>
      </View>

      <View className="p-4">
        <ReusableButton
          onPress={() => setCurrTab("Group")}
          buttonText="Create Group Chat"
          variant="shade"
          textStyle="text-primary-500"
        />
        <View className="relative">
          <TextInput
            placeholder="Search People"
            className="border border-neutral-200 p-2  rounded-lg"
            style={{ paddingEnd: 40 }}
            onChangeText={(text) => setSearchInput(text)}
          />
          <Search
            style={{ position: "absolute", top: 10, right: 8 }}
            height={24}
            width={24}
          />
        </View>
      </View>

      <View className="flex-1">
        <FlatList
          data={data?.user}
          style={{
            width: "100%",
            height: "100%",
          }}
          keyExtractor={(item, index) => item._id + index}
          renderItem={({ item }) => (
            <SelectUser
              user={item}
              setCurrTab={setCurrTab}
              setSelectedChat={setSelectedChat}
            />
          )}
          ListEmptyComponent={
            isFetching ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#7367f0" />
              </View>
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text>No Result Found</Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
};

export default SingleChat;
