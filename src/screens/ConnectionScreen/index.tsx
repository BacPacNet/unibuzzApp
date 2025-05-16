import { View, TextInput, TouchableOpacity, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { Search } from "iconoir-react-native";
import ReusableButton from "@/components/atoms/ReusableButton";
import ConnectionUserTabList from "@/components/organism/ConnectionUserTabList/ConnectionUserTabList";
import { Filter } from "iconoir-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from "@/types/connections";
import { useUsersProfileForConnections } from "@/services/users";

const Connections = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const {
    data: userProfilesData,
    refetch: fetchUserProfiles,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
    isFetching,
  } = useUsersProfileForConnections(searchQuery, 10, true);

  const handleYourConnections = () => {
    navigation.navigate("YourConnections" as never);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfiles();
    }, []),
  );
  return (
    <View className="flex-1 bg-white pb-20">
      <View className="p-4 flex-row items-center gap-2">
        <View className="flex-1 relative">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Messages"
            className="border border-neutral-200 p-2  rounded-lg"
            style={{ paddingEnd: 40 }}
          />
          <Search
            style={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: [{ translateY: -10 }],
            }}
            strokeWidth={2}
            height={20}
            width={20}
          />
        </View>
        <TouchableOpacity className="w-10 h-10 bg-secondary rounded-lg flex justify-center items-center">
          <Filter width={28} height={28} color={"#6744FF"} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <ConnectionUserTabList
        userProfilesData={userProfilesData}
        fetchUserProfiles={fetchUserProfiles}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        isUserProfilesLoading={isUserProfilesLoading}
        isFetching={isFetching}
      />

      <View className="absolute bottom-0 left-5 right-5">
        <ReusableButton
          onPress={handleYourConnections}
          buttonText="Your Connections"
          variant="shade"
        />
      </View>
    </View>
  );
};

export default Connections;
