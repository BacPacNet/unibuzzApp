import React, { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import NavbarSubscribedUniversity from "../SubscribedUniversity";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import { useGetSubscribedCommunities } from "@/services/university-community";
import { Community } from "@/types/Community";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";

import { TouchableOpacity } from "react-native-gesture-handler";
import { FilterList } from "iconoir-react-native";
import CommunityGroupTabs from "@/components/organism/CommunityGroupTabs";
import CommunityLogo from "@/components/atoms/LogoHolder";
import { useNewCommunityGroupStatesContext } from "@/context/NewCommunityGroupStatesProvider/NewCommunityGroupStatesProvider";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;
const UniversitySec = () => {
  const { currentCommunityId, currentCommunityGroupId } = useCommunityContext();

  const userData = getUserStore();
  const userProfileData = getUserProfileStore();
  const {
    data: subscribedCommunities,
    isFetching,
    isLoading,
  } = useGetSubscribedCommunities();
  const navigation = useNavigation<NavigationProp>();
  const [currSelectedGroup, setCurrSelectedGroup] =
    useState<Community | null>();
  const [community, setCommunity] = useState<Community>();
  const [currTab, setCurrTab] = useState("All");
  const { resetFilters } = useNewCommunityGroupStatesContext();

  const handleCommunityClick = (id: string) => {
    navigation.navigate("Community", { communityId: id });
    setCurrSelectedGroup(community);
  };

  const handleManageGroupNavigate = () => {
    resetFilters();
    navigation.navigate("manageGroupStack", {
      screen: "SearchCommunityGroupScreen",

      params: { communityId: community?._id },
    });
  };

  const joinedSubscribedCommunitiesGroup = useMemo(() => {
    const selectedCommunityGroup = subscribedCommunities?.find(
      (community) =>
        community?._id ===
        (currentCommunityId || subscribedCommunities?.[0]._id),
    )?.communityGroups;
    return selectedCommunityGroup
      ?.filter((userCommunityGroup) =>
        userCommunityGroup?.users?.some(
          (selectCommunityGroup) =>
            selectCommunityGroup?._id?.toString() === userData?.id?.toString(),
        ),
      )
      ?.filter((group) => group.title.toLowerCase());
  }, [subscribedCommunities, currentCommunityId, userData, userProfileData]);

  const subscribedCommunitiesAllGroups = useMemo(() => {
    const groups = subscribedCommunities?.find(
      (community) =>
        community._id ===
        (currentCommunityId || subscribedCommunities?.[0]?._id),
    )?.communityGroups;

    return groups || [];
  }, [subscribedCommunities, currentCommunityId]);

  const subscribedCommunitiesMyGroup = useMemo(() => {
    const groups = subscribedCommunities?.find(
      (community) =>
        community._id ===
        (currentCommunityId || subscribedCommunities?.[0]?._id),
    )?.communityGroups;

    return groups?.filter((group) => group?.adminUserId === userData?.id) || [];
  }, [subscribedCommunities, currentCommunityId, userData, userProfileData]);

  useEffect(() => {
    if (currentCommunityId && subscribedCommunities) {
      setCommunity(
        subscribedCommunities.find(
          (community) => community._id === currentCommunityId,
        ),
      );
    } else if (subscribedCommunities) {
      setCommunity(subscribedCommunities?.[0] as Community);
    }
  }, [subscribedCommunities, currentCommunityId]);

  return (
    <View>
      <Text style={styles.headerText}>UNIVERSITIES</Text>
      <NavbarSubscribedUniversity
        userData={userData || {}}
        communityId={currentCommunityId || ""}
        subscribedCommunities={subscribedCommunities as Community[]}
        handleCommunityClick={handleCommunityClick}
        isGroup={!!currentCommunityGroupId}
      />

      <View className="mt-4">
        <View style={styles.communityImageContainer}>
          <Text style={styles.groupHeaderText}>Groups</Text>

          <CommunityLogo
            logoUrl={community?.communityLogoUrl?.imageUrl as string}
            variant="extraSmall"
          />
        </View>
        <TouchableOpacity
          onPress={() => handleManageGroupNavigate()}
          style={styles.communityMangeButton}
        >
          <FilterList width={22} height={22} color="#6744FF" />
          <Text className="text-neutral-800">Manage Groups</Text>
        </TouchableOpacity>

        {/* <CommunityGroupAll
          key={joinedSubscribedCommunitiesGroup}
          communityGroups={joinedSubscribedCommunitiesGroup}
          currSelectedGroup={currSelectedGroup as Community}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData}
        />  */}

        <CommunityGroupTabs
          currTab={currTab}
          setCurrTab={setCurrTab}
          allGroups={subscribedCommunitiesAllGroups}
          joinedGroups={joinedSubscribedCommunitiesGroup || []}
          myGroups={subscribedCommunitiesMyGroup}
          currSelectedGroup={currSelectedGroup || null}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData || {}}
          communityLogo={
            currSelectedGroup?.communityLogoUrl?.imageUrl ||
            subscribedCommunities?.[0]?.communityLogoUrl?.imageUrl ||
            ""
          }
        />
      </View>
    </View>
  );
};

export default UniversitySec;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 2,
    margin: 20,
    marginBottom: 0,
    paddingBottom: 20,
  },

  headerText: {
    fontSize: 14,
    color: "#6B7280",
    padding: 16,
    paddingTop: 9,
    fontWeight: 700,
  },
  groupHeaderText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: 700,
  },
  UpgradeText: {
    fontSize: 14,
    color: "#6744FF",
  },
  imageWrapper: {
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  communityImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  universityPlaceHolder: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  communityImageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    borderTopColor: "#E5E7EB",
    borderTopWidth: 1,
    marginHorizontal: 16,
    paddingTop: 16,
  },
  communityMangeButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-start",
    // padding: 16,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    gap: 4,
    width: 236,
    marginBottom: 32,
    marginStart: 16,
  },
  borderBottom: {},
});
