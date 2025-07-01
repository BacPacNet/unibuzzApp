import { getUserProfileStore } from "@/storage/user";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import MembersUserCard from "@/components/molecules/MembersUserCard";
import { useUsersProfileForConnections } from "@/services/users";
import { Filter } from "iconoir-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import SearchInput from "@/components/atoms/SearchInput";

type NavigationProp = StackNavigationProp<RootStackParamList, "Connections">;

const ConnectionAllUserTabList: React.FC<{
  values: any;
  resetParams: any;
}> = ({ values, resetParams }) => {
  const userProfileData = useMemo(() => getUserProfileStore(), []);
  const [selectedFilters, setSelectedFilters] = useState({
    selectedRadio: "",
    studentYear: [],
    major: [],
    occupation: [],
    affiliation: [],
    university: { name: "" as string, id: "" as string, communityId: "" },
  });
  const [name, setName] = useState("");
  const [isSearchQueryLoading, setIsSearchQueryLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
    refetch: fetchUserProfiles,
    isFetching,
  } = useUsersProfileForConnections(
    name,
    10,
    true,

    selectedFilters?.university?.name ?? userProfileData?.university_name,
    selectedFilters.studentYear,
    selectedFilters.major,
    selectedFilters.occupation,
    selectedFilters.affiliation,
  );

  const userProfiles = useMemo(
    () =>
      userProfilesData?.pages
        ?.flatMap(({ users }) => users)
        .filter(({ _id }) => _id !== userProfileData?.users_id) ?? [],
    [userProfilesData, userProfileData?.users_id],
  );

  const handleRefresh = useCallback(() => {
    fetchUserProfiles();
    setSelectedFilters({
      selectedRadio: "",
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],
      university: { name: "" as string, id: "" as string, communityId: "" },
    });
    resetParams();
  }, [fetchUserProfiles]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (values) {
      const { universityId, universityName, communityId, ...rest } = values;

      setSelectedFilters({
        ...rest,
        university: {
          id: universityId,
          name: universityName,
          communityId,
        },
      });
    }
  }, [values]);

  useEffect(() => {
    setIsSearchQueryLoading(true);
    fetchUserProfiles().finally(() => {
      setIsSearchQueryLoading(false);
    });
  }, [selectedFilters]);

  if ((isUserProfilesLoading && !name.length) || isSearchQueryLoading)
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );

  return (
    <FlatList
      data={userProfiles}
      keyExtractor={(item) => item._id}
      initialNumToRender={10}
      ListHeaderComponent={
        <View className="py-4 flex-row items-center gap-2">
          <View className="flex-1 relative">
            <SearchInput
              value={name}
              onChangeText={setName}
              placeholder="Search Messages"
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ConnectionsFilter", { Currvalues: values })
            }
            className="w-10 h-10 bg-secondary rounded-lg flex justify-center items-center"
          >
            <Filter width={28} height={28} color={"#6744FF"} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      }
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      renderItem={({ item }) => (
        <MembersUserCard
          _id={item._id}
          firstName={item.firstName}
          lastName={item.lastName}
          isFollowing={item.isFollowing}
          currentUserId={userProfileData?.users_id || ""}
          role={item.profile?.role || ""}
          profile_dp_imageUrl={item.profile?.profile_dp?.imageUrl || ""}
          study_year={item?.profile?.study_year || ""}
          major={item?.profile?.major || ""}
          occupation={item?.profile?.occupation || ""}
          affiliation={item?.profile?.affiliation || ""}
          isSelfProfile={userProfileData?.users_id === item._id}
          isViewerAdmin={userProfileData?.users_id === item._id}
          isGroupAdmin={false}
        />
      )}
      getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}
      removeClippedSubviews
      refreshing={isUserProfilesLoading}
      refreshControl={
        <RefreshControl
          refreshing={isUserProfilesLoading}
          onRefresh={handleRefresh}
        />
      }
      ListEmptyComponent={
        !isFetching && userProfiles?.length === 0 ? (
          <View className="py-4">
            <Text className="text-center">No Result Found</Text>
          </View>
        ) : null
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : null
      }
    />
  );
};

export default ConnectionAllUserTabList;
