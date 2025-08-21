import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Search, SortUp } from "iconoir-react-native";
import FilterIcon from "@/assets/icons/filter.svg";
import SortIcon from "@/assets/icons/sort.svg";
import {
  useGetFilteredSubscribedCommunities,
  useGetSubscribedCommunities,
} from "@/services/university-community";
import SearchCommunityGroupList from "@/components/organism/SearchCommunityGroupsList";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCommunityFilterContext } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchCommunityFilterBottomSheet from "@/components/molecules/SearchCommunity/SearchCommunityFilterBottomSheet";

import PlusCircleButton from "@/components/atoms/PlusCircle";
import SortCommunityBottomSheet from "@/components/molecules/SearchCommunity/SortCommunityBottomSheet";
import { getUserProfileStore } from "@/storage/user";
import { Community } from "@/types/Community";
import { Toast } from "react-native-toast-notifications";
import { CommunityGroupTypeEnum } from "@/types/CommunityGroup";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchCommunityGroupScreen"
>;
const SearchCommunityGroupScreen = () => {
  const route = useRoute();
  const { communityId, change } = route.params as any;
  const [searchQuery, setSearchQuery] = useState("");
  const filterBottomSheet = useRef<ActionSheetRef>(null);
  const sortBottomSheet = useRef<ActionSheetRef>(null);
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const userProfileData = getUserProfileStore();
  const [community, setCommunity] = useState<Community>();
  const [refreshing, setRefreshing] = useState(false);

  const isUserVerifiedForCommunity: boolean =
    userProfileData?.email?.some(
      (community) => community?.communityId === communityId
    ) || false;
  const canUserCreateGroup =
    community?.users.some((user) => user._id === userProfileData?.users_id) &&
    isUserVerifiedForCommunity;

  const { data: subscribedCommunitiesForUser, isLoading } =
    useGetSubscribedCommunities();
  const {
    mutate,
    data: subscribedCommunities,
    isPending,
  } = useGetFilteredSubscribedCommunities(communityId);

  const {
    selectedTypeMain,
    setSelectedTypeMain,
    selectedFiltersMain,
    setSelectedFiltersMain,
    sort,
    setSort,
    selectedLabelMain,
    setSelectedLabelMain,
  } = useCommunityFilterContext();

  const isFilterApplied = useMemo(() => {
    return (
      Object.values(selectedFiltersMain)?.length > 0 ||
      selectedLabelMain?.length > 0 ||
      selectedTypeMain?.length > 0
    );
  }, [selectedFiltersMain, selectedLabelMain, selectedTypeMain]);

  const handleNavigateToGroup = (data: any) => {
    navigation.navigate("CommunityGroup", {
      communityId: data?.communityId,
      communityGroupId: data?._id,
      from: "manageCommunityGroup",
    });
  };

  const handleNavigateToNewCommunityGroupScreen = () => {
    if (!canUserCreateGroup) {
      Toast.hideAll();
      return Toast.show("Verify Account to Create Groups", {
        type: "warning",
        placement: "top",
      });
    }
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
      selectedLabel: selectedLabelMain,
    };

    mutate(data);
  }, [
    sort,
    communityId,
    selectedTypeMain,
    selectedFiltersMain,
    change,
    selectedLabelMain,
  ]);

  useEffect(() => {
    if (communityId && subscribedCommunitiesForUser) {
      setCommunity(
        subscribedCommunitiesForUser.find(
          (community: any) => community._id === communityId
        )
      );
    } else if (subscribedCommunitiesForUser) {
      setCommunity(subscribedCommunitiesForUser[0] as Community);
    }
  }, [subscribedCommunitiesForUser, communityId]);

  const resetFilter = () => {
    setSelectedFiltersMain({});
    setSelectedTypeMain([]);
    setSelectedLabelMain([]);
    setSort("");
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    resetFilter();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="flex-1 bg-white pb-20"
    >
      <View className="p-4 flex-row items-center gap-2 ">
        <View className="flex-1 relative ">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Group"
            className="border border-neutral-200 px-2 text-neutral-500 rounded-lg"
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
          <Search
            style={styles.searchIcon}
            strokeWidth={2}
            height={20}
            width={20}
          />
        </View>
        <TouchableOpacity
          onPress={() => filterBottomSheet.current?.show()}
          style={styles.iconContainer}
        >
          <FilterIcon width={40} height={40} />
          {isFilterApplied && <Text style={styles.dot}>.</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sortBottomSheet.current?.show()}
          className="  bg-secondary rounded-lg flex justify-center items-center border border-[#E9E8FF]"
          style={styles.iconContainer}
        >
          <SortIcon width={40} height={40} />
          {sort?.length > 0 && <Text style={styles.dot}>.</Text>}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => handleNavigateToNewCommunityGroupScreen()}
        style={styles.plusCircleContainer}
      >
        <PlusCircleButton
          onPress={() => handleNavigateToNewCommunityGroupScreen()}
        />
        <Text style={styles.createGroupPlusText}>Create Group</Text>
      </TouchableOpacity>
      <View style={styles.listContainer}>
        <SearchCommunityGroupList
          data={subscribedCommunities?.communityGroups}
          isFetching={isPending}
          handleNavigateToGroup={handleNavigateToGroup}
        />
      </View>

      <ActionSheet
        useBottomSafeAreaPadding
        ref={sortBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={styles.actionSheetContainer}
      >
        <SortCommunityBottomSheet
          onSelect={(value: string) => {
            setSort(value);
            sortBottomSheet.current?.hide();
          }}
          initialValue={sort}
        />
      </ActionSheet>

      <ActionSheet
        useBottomSafeAreaPadding
        ref={filterBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={styles.actionSheetContainer}
      >
        <SearchCommunityFilterBottomSheet
          onClose={() => filterBottomSheet.current?.hide()}
        />
      </ActionSheet>
    </ScrollView>
  );
};

export default SearchCommunityGroupScreen;

const styles = StyleSheet.create({
  plusCircleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  createGroupPlusText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  searchInput: {
    paddingEnd: 40,
    height: 40,
    borderRadius: 8,
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: [{ translateY: -10 }],
  },
  actionSheetContainer: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  iconContainer: {
    position: "relative",
    height: 40,
    width: 40,
    backgroundColor: "#F3F2FF",
    borderColor: "#E9E8FF",
    borderWidth: 1,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    zIndex: 40,
    fontSize: 60,
    right: 0,
    color: "#DC2626",
    bottom: -10,
  },
});
