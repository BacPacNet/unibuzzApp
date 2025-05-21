import ReusableButton from "@/components/atoms/ReusableButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Filter, FilterList, Search } from "iconoir-react-native";
import {
  useGetFilteredSubscribedCommunities,
  useGetSubscribedCommunities,
} from "@/services/university-community";
import { getUserStore } from "@/storage/user";
import SearchCommunityGroupList from "@/components/organism/SearchCommunityGroupsList";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import SearchCommunityGroupShortModal from "@/components/molecules/SearchCommunityGroupSortModal";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchCommunityGroupScreen"
>;
const SearchCommunityGroupScreen = () => {
  const route = useRoute();
  const { communityId, change } = route.params as any;
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation<NavigationProp>();

  const {
    mutate,
    data: subscribedCommunities,
    isPending,
  } = useGetFilteredSubscribedCommunities(communityId);

  const {
    selectedTypeMain,
    selectedFiltersMain,

    sort,
    setSort,
  } = useCommunityFilterContext();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigateToGroup = (data: any) => {
    navigation.navigate("CommunityGroup", {
      communityId: data?.communityId,
      communityGroupId: data?._id,
    });
  };

  const handleNavigateToFilterScreen = () => {
    navigation.navigate("manageGroupStack", {
      screen: "SearchCommunityGroupFilterScreen",

      params: { communityId: communityId },
    });
  };
  const handleNavigateToNewCommunityGroupScreen = () => {
    navigation.navigate("manageGroupStack", {
      screen: "NewCommunityGroupScreen",

      params: { communityId: communityId },
    });
  };

  useEffect(() => {
    const data = {
      selectedType: selectedTypeMain,
      selectedFilters: selectedFiltersMain,
      sort,
    };

    mutate(data);
  }, [sort, communityId, selectedTypeMain, selectedFiltersMain, change]);

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
        <TouchableOpacity
          onPress={() => handleNavigateToFilterScreen()}
          className="w-10 h-10 bg-secondary rounded-lg flex justify-center items-center"
        >
          <Filter width={28} height={28} color={"#6744FF"} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="w-10 h-10 bg-secondary rounded-lg flex justify-center items-center"
        >
          <FilterList
            width={28}
            height={28}
            color={"#6744FF"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
      <SearchCommunityGroupList
        data={subscribedCommunities?.communityGroups}
        isFetching={isPending}
        handleNavigateToGroup={handleNavigateToGroup}
      />
      <View className="absolute bottom-0 left-5 right-5">
        <ReusableButton
          onPress={() => handleNavigateToNewCommunityGroupScreen()}
          buttonText="Create Group"
          variant="shade"
        />
      </View>

      <SearchCommunityGroupShortModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        label="Sort"
        setSort={setSort}
        currSortValue={sort}
      />
    </View>
  );
};

export default SearchCommunityGroupScreen;
