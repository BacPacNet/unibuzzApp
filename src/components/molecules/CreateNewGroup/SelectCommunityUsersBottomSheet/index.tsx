import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { FlatList } from "react-native-actions-sheet";
import { NewGroupUserListItem } from "../UserList";
import { Users } from "@/types/connections";
import {
  useCommunityFilteredUsers,
  useCommunityUsers,
} from "@/services/community";

type Props = {
  setSelectedUsers: (value: Users[]) => void;
  selectedUsers: Users[];
  communityId: string;
  myUserId: string;
  communityGroupId?: string;
};

const SelectCommunityUsersBottomSheet = ({
  selectedUsers,
  setSelectedUsers,
  communityId,
  myUserId,
  communityGroupId,
}: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const selectedUserIds = selectedUsers.map((user) => user?.users_id || "");

  const {
    data: communityUsersData,
    isFetching,
    hasNextPage: communityHasNextPage,
    isFetchingNextPage: communityIsFetchingNextPage,
    fetchNextPage: communityFetchNextPage,
  } = useCommunityFilteredUsers(
    communityId,
    false,
    searchInput,
    communityGroupId
  );

  const communityUsers =
    communityUsersData?.pages
      .flatMap((page) => page.data)
      .filter(
        (user) =>
          user?.users_id !== myUserId &&
          !selectedUserIds?.includes(user?.users_id || "")
      ) || [];

  const renderItem = ({ item }: { item: any }) => {
    return (
      <NewGroupUserListItem
        item={item}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
    );
  };

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        paddingTop: 20,
        gap: 10,
        width: "100%",
      }}
    >
      <View className="w-full p-3">
        <TextInput
          style={{ paddingStart: 8 }}
          onChangeText={(text) => setSearchInput(text)}
          className="border border-neutral-200 w-full text-neutral-700  rounded-lg h-14 p-0"
          placeholderTextColor="#9CA3AF"
          placeholder="Search User..."
        />
      </View>

      <FlatList
        data={communityUsers || []}
        style={{
          width: "100%",
          height: "100%",
        }}
        keyExtractor={(item, index) => item._id + index}
        renderItem={renderItem}
        ListEmptyComponent={
          isFetching ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-neutral-500">No Result Found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default SelectCommunityUsersBottomSheet;
