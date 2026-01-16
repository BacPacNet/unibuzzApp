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
import SortCommunityBottomSheet from "@/components/molecules/SearchCommunity/SortCommunityBottomSheet";
import { getUserProfileStore } from "@/storage/user";
import { Community } from "@/types/Community";
import { Toast } from "react-native-toast-notifications";
import { status } from "@/types/CommunityGroup";
import TabSwitch from "@/components/molecules/ManageGroup/TabSwitch";
import CommunityDropdown from "@/components/molecules/LeftSideBar/CommunityDropDown";
import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";
import { storeSelectedCommunityGroup } from "@/storage/selected-community-group";
import ReusableButton from "@/components/atoms/ReusableButton";
import { SearchCommunityGroupTabs } from "@/constant/searchCommunityGroupTabs";
import VerifyToCreateGroupBottomSheet from "@/components/molecules/CommunityGroup/VerifyToCreateGroupBottomSheet";
import { TRACK_EVENT } from "@/content/constant";
import { trackMixpanel } from "@/mixpanel/track";

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
  const verifyToCreateGroupBottomSheet = useRef<ActionSheetRef>(null);
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const userProfileData = getUserProfileStore();
  const [community, setCommunity] = useState<Community>();
  const [refreshing, setRefreshing] = useState(false);
  const [currTab, setCurrTab] = useState<
    (typeof SearchCommunityGroupTabs)[keyof typeof SearchCommunityGroupTabs]
  >(SearchCommunityGroupTabs.Joined);
  const {
    setSelectedCommunityGroupLogo,
    setSelectedCommunityId,
    selectedCommunityId,
  } = useCommunityContext();

  const isUserVerifiedForCommunity: boolean =
    userProfileData?.email?.some(
      (community) => community?.communityId === communityId
    ) || false;
  const canUserCreateGroup =
    community?.users?.some((user) => user._id === userProfileData?.users_id) &&
    isUserVerifiedForCommunity;

  const { data: subscribedCommunitiesForUser, isLoading } =
    useGetSubscribedCommunities();

  const {
    mutate,
    data: subscribedCommunities,
    isPending,
  } = useGetFilteredSubscribedCommunities(selectedCommunityId || communityId);

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
      verifyToCreateGroupBottomSheet.current?.show();
      return;
    }
    navigation.navigate("Groups", {
      screen: "NewCommunityGroupScreen",

      params: { communityId: communityId },
    });
  };

  const subscribedCommunitiesAllGroups = useMemo(() => {
    const groups = subscribedCommunities?.communityGroups || [];
    return groups.filter((group: { title: string }) =>
      group.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subscribedCommunities, searchQuery]);

  const joinedSubscribedCommunitiesGroup = useMemo(() => {
    const groups = subscribedCommunities?.communityGroups || [];

    return groups
      .filter(
        (group: { users: any[]; adminUserId: string; title: string }) =>
          group.adminUserId === userProfileData?.users_id ||
          group.users?.some(
            (u: { _id: string; status: string }) =>
              u._id === userProfileData?.users_id &&
              u.status === status.accepted
          )
      )
      .filter((group: { title: string }) =>
        group.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [userProfileData, subscribedCommunities, searchQuery]);

  const subscribedCommunitiesMyGroup = useMemo(() => {
    const groups = subscribedCommunities?.communityGroups || [];

    return groups
      .filter(
        (group: { adminUserId: string; title: string }) =>
          group.adminUserId === userProfileData?.users_id
      )
      .filter((group: { title: string }) =>
        group.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [userProfileData, subscribedCommunities, searchQuery]);

  const communityGroups = useMemo(() => {
    switch (currTab) {
      case SearchCommunityGroupTabs.Joined:
        return joinedSubscribedCommunitiesGroup;
      case SearchCommunityGroupTabs.Create:
        return subscribedCommunitiesMyGroup;
      case SearchCommunityGroupTabs.All:
      default:
        return subscribedCommunitiesAllGroups;
    }
  }, [
    currTab,
    joinedSubscribedCommunitiesGroup,
    subscribedCommunitiesMyGroup,
    subscribedCommunitiesAllGroups,
  ]);

  useEffect(() => {
    const data = {
      selectedType: selectedTypeMain,
      selectedFilters: selectedFiltersMain,
      sort,
      selectedLabel: selectedLabelMain,
    };

    mutate(data, {
      onSuccess: (res: any) => {
        trackMixpanel(TRACK_EVENT.SIDEBAR_GROUP_FILTER, {
          communityId,
          selectedFilters: selectedFiltersMain,
          selectedType: selectedTypeMain,
          selectedLabel: selectedLabelMain,
          sort,
        });
      },
    });
  }, [
    sort,
    communityId,
    selectedTypeMain,
    selectedFiltersMain,
    change,
    selectedLabelMain,
    selectedCommunityId,
    mutate,
  ]);

  const handleCommunityGroupClick = (communityId: string, logo: string) => {
    setCommunity(
      subscribedCommunitiesForUser?.find(
        (community) => community._id === communityId
      )
    );

    setSelectedCommunityGroupLogo(logo);
    setSelectedCommunityId(communityId);
    storeSelectedCommunityGroup(communityId, logo);

    navigation.navigate("Groups", {
      screen: "SearchCommunityGroupScreen",

      params: { communityId: communityId },
    });
  };

  useEffect(() => {
    if (selectedCommunityId && subscribedCommunitiesForUser) {
      setCommunity(
        subscribedCommunitiesForUser.find(
          (community: any) => community._id === selectedCommunityId
        )
      );
    } else if (communityId && subscribedCommunitiesForUser) {
      setCommunity(
        subscribedCommunitiesForUser.find(
          (community: any) => community._id === communityId
        )
      );
    } else if (subscribedCommunitiesForUser) {
      setCommunity(subscribedCommunitiesForUser[0] as Community);
    }
  }, [subscribedCommunitiesForUser, communityId, selectedCommunityId]);

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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 20,
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <CommunityDropdown
            selectedCommunityImage={
              community?.communityLogoUrl?.imageUrl as string
            }
            subscribedCommunities={subscribedCommunitiesForUser as Community[]}
            handleCommunityGroupClick={handleCommunityGroupClick}
            placeholder="Select Community"
            iconSize={16}
            logoSize={48}
            isLableShown={false}
          />
        </View>
        <View style={{ flexShrink: 0, width: "80%" }}>
          <TabSwitch
            currTab={currTab}
            setCurrTab={(value: string) =>
              setCurrTab(
                value as (typeof SearchCommunityGroupTabs)[keyof typeof SearchCommunityGroupTabs]
              )
            }
            tabs={[
              SearchCommunityGroupTabs.All,
              SearchCommunityGroupTabs.Joined,
              SearchCommunityGroupTabs.Create,
            ]}
          />
        </View>
      </View>
      <View
        style={styles.searchContainer}
        className=" flex-row items-center gap-2 "
      >
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
      {currTab === SearchCommunityGroupTabs.Create && (
        <View style={styles.createGroupButtonContainer}>
          <ReusableButton
            buttonText="Create Group"
            onPress={() => handleNavigateToNewCommunityGroupScreen()}
            variant="primary"
            size="w-full"
            height="medium"
          />
        </View>
      )}

      <View style={styles.listContainer}>
        <SearchCommunityGroupList
          //   data={subscribedCommunities?.communityGroups}
          data={communityGroups}
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

      <ActionSheet
        useBottomSafeAreaPadding
        ref={verifyToCreateGroupBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={{
          paddingTop: 10,
        }}
      >
        <VerifyToCreateGroupBottomSheet />
      </ActionSheet>
    </ScrollView>
  );
};

export default SearchCommunityGroupScreen;

const styles = StyleSheet.create({
  createGroupButtonContainer: {
    paddingHorizontal: 16,

    paddingVertical: 24,
  },

  listContainer: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingBottom: 0,
    paddingTop: 16,
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
