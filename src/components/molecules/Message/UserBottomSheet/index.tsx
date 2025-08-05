import { useUsersProfileForConnections } from "@/services/users";
import { getUserProfileStore } from "@/storage/user";
import { useState } from "react";
import { View, TextInput } from "react-native";
import { UserSelectCard } from "../UserSelectCard";
import { FlatList } from "react-native-actions-sheet";
import { Users } from "@/types/connections";

type Props = {
  selectedUsers: Users[] | any,
  setSelectedUsers: (users: Users | Users[] | any) => void,
  isMultiAllowed: boolean,
  hideBottomSheet?: () => void
};

export const AllUserSelectBottomSheet = ({ selectedUsers, setSelectedUsers, isMultiAllowed, hideBottomSheet }: Props) => {
  const userProfileData = getUserProfileStore();
  const [searchInput, setSearchInput] = useState("");

  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
  } = useUsersProfileForConnections(searchInput, 10, true);

  const userProfiles =
    userProfilesData?.pages
      .flatMap((page) => page.users)
      .filter((user) =>
        user._id !== userProfileData?.users_id &&
        !selectedUsers.some((selected:{_id: string}) => selected._id === user._id)
      ) || [];

  const handleUserSelect = (user: Users) => {
    if (isMultiAllowed) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers([user]);
      hideBottomSheet?.();
    }
  };

  return (
    <View>
      <View className="w-full p-3">
        <TextInput
          style={{ paddingStart: 8 }}
          onChangeText={setSearchInput}
          className="border border-neutral-200 w-full rounded-lg h-14 p-0"
          placeholderTextColor="#a9a9a9"
          placeholder="Search User..."
        />
      </View>

      <FlatList
        data={userProfiles}
        style={{ minHeight: 400 }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="p-3">
            <UserSelectCard
              item={item}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              handleUserSelect={handleUserSelect}
            />
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};
