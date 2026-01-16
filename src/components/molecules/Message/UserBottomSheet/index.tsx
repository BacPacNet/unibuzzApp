import { useUsersProfileForConnections } from "@/services/users";
import { getUserProfileStore } from "@/storage/user";
import { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { UserSelectCard } from "../UserSelectCard";
import { FlatList } from "react-native-actions-sheet";
import { Users } from "@/types/connections";
import { Search } from "iconoir-react-native";

type Props = {
  selectedUsers: Users[] | any;
  setSelectedUsers: (users: Users | Users[] | any) => void;
  isMultiAllowed: boolean;
  hideBottomSheet?: () => void;
  chatId?: string;
};

export const AllUserSelectBottomSheet = ({
  selectedUsers,
  setSelectedUsers,
  isMultiAllowed,
  hideBottomSheet,
  chatId = "",
}: Props) => {
  const userProfileData = getUserProfileStore();
  const [searchInput, setSearchInput] = useState("");

  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
  } = useUsersProfileForConnections(
    searchInput,
    10,
    true,
    "",
    [],
    [],
    [],
    [],
    chatId
  );

  const userProfiles =
    userProfilesData?.pages
      .flatMap((page) => page.users)
      .filter(
        (user) =>
          user._id !== userProfileData?.users_id &&
          !selectedUsers.some(
            (selected: { _id: string }) => selected._id === user._id
          )
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
      <View style={styles.container} className="w-full p-3">
        <TextInput
          style={styles.input}
          onChangeText={setSearchInput}
          className="border border-neutral-200 w-full text-neutral-500 rounded-lg p-0"
          placeholderTextColor="#9CA3AF"
          placeholder="Search Name"
        />
        <Search style={styles.icon} height={20} width={20} />
      </View>

      <FlatList
        data={userProfiles}
        style={{ minHeight: 400, marginTop: 12 }}
        keyExtractor={(item) => item._id}
        maxToRenderPerBatch={20}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
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
        ListEmptyComponent={
          <Text className="text-neutral-500 p-2 text-center">
            No User found.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 12,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    height: 40,
    marginTop: 12,
  },

  icon: {
    position: "absolute",
    top: "50%",
    right: 20,
  },
  input: {
    paddingStart: 8,
    height: 40,
    paddingRight: 40,
  },
});
