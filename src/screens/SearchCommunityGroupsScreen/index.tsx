import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Filter, Search, SortUp } from "iconoir-react-native";
import {
  useGetFilteredSubscribedCommunities,
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

  const hideBottomBar = () => {
    filterBottomSheet.current?.hide();
  };

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
    <ScrollView className="flex-1 bg-white pb-20">
      <View className="p-4 flex-row items-center gap-2">
        <View className="flex-1 relative">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Messages"
            className="border border-neutral-200 p-2  rounded-lg"
            style={styles.searchInput}
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
          className="w-10 h-10 bg-secondary rounded-lg flex justify-center items-center border border-[#E9E8FF]"
        >
          <Filter width={24} height={24} color={"#6744FF"} fill={"#6744FF"} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sortBottomSheet.current?.show()}
          className="w-10 h-10 bg-secondary rounded-lg flex justify-center items-center border border-[#E9E8FF]"
        >
          <SortUp
            width={24}
            height={24}
            color={"#6744FF"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleNavigateToNewCommunityGroupScreen()} style={styles.plusCircleContainer}>
      <PlusCircleButton onPress={() => handleNavigateToNewCommunityGroupScreen()} />
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
            <SortCommunityBottomSheet onSelect={(value:string)=>setSort(value)} initialValue={sort} />
        </ActionSheet>

<ActionSheet
          useBottomSafeAreaPadding
          ref={filterBottomSheet}
          gestureEnabled={true}
          safeAreaInsets={insets}
          // snapPoints={[70, 100]}
          containerStyle={styles.actionSheetContainer}
        >

          <SearchCommunityFilterBottomSheet/>
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
   marginHorizontal:16,
   paddingVertical:16,
   borderBottomWidth:1,
   borderBottomColor:"#E5E7EB",
  },
  createGroupPlusText:{
    fontSize:14,
    color:"#6B7280",
    fontWeight:"500",
    lineHeight:16
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  searchInput: {
    paddingEnd: 40,
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: [{ translateY: -10 }],
  },
  actionSheetContainer: {
    paddingTop: 10,
  },
});
