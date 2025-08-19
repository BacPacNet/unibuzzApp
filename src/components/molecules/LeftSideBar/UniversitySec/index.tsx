import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
import { FONTS } from "@/constants/fonts";
import ManageGroupIcon from "@/assets/icons/manageGroupIcon.svg";

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

  const getCurrentStackInfo = () => {
    const currentRoute =
      navigation?.getState()?.routes[navigation?.getState()?.index];
    const currentStackName = currentRoute?.name;

    return {
      currentStack: currentStackName,
      currentScreen:
        currentRoute?.state?.routes?.[currentRoute?.state?.index || 0]?.name ||
        currentStackName,
    };
  };

  const stackInfo = getCurrentStackInfo();

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
        (currentCommunityId || subscribedCommunities?.[0]._id)
    )?.communityGroups;
    return selectedCommunityGroup
      ?.filter((userCommunityGroup) =>
        userCommunityGroup?.users?.some(
          (selectCommunityGroup) =>
            selectCommunityGroup?._id?.toString() === userData?.id?.toString()
        )
      )
      ?.filter((group) => group.title.toLowerCase());
  }, [subscribedCommunities, currentCommunityId, userData, userProfileData]);

  const subscribedCommunitiesAllGroups = useMemo(() => {
    const groups = subscribedCommunities?.find(
      (community) =>
        community._id ===
        (currentCommunityId || subscribedCommunities?.[0]?._id)
    )?.communityGroups;

    return groups || [];
  }, [subscribedCommunities, currentCommunityId]);

  const subscribedCommunitiesMyGroup = useMemo(() => {
    const groups = subscribedCommunities?.find(
      (community) =>
        community._id ===
        (currentCommunityId || subscribedCommunities?.[0]?._id)
    )?.communityGroups;

    return groups?.filter((group) => group?.adminUserId === userData?.id) || [];
  }, [subscribedCommunities, currentCommunityId, userData, userProfileData]);

  useEffect(() => {
    if (currentCommunityId && subscribedCommunities) {
      setCommunity(
        subscribedCommunities.find(
          (community) => community._id === currentCommunityId
        )
      );
    } else if (subscribedCommunities) {
      setCommunity(subscribedCommunities?.[0] as Community);
    }
  }, [subscribedCommunities, currentCommunityId]);

  return (
    <View>
      <Text style={styles.headerText}>UNIVERSITIES</Text>
      <View style={styles.universityContainer}>
        <NavbarSubscribedUniversity
          userData={userData || {}}
          communityId={currentCommunityId || ""}
          subscribedCommunities={subscribedCommunities as Community[]}
          handleCommunityClick={handleCommunityClick}
          isGroup={!!currentCommunityGroupId}
        />
      </View>
      <View>
        <View style={styles.communityImageContainer}>
          <Text style={styles.groupHeaderText}>GROUPS</Text>

          <CommunityLogo
            logoUrl={community?.communityLogoUrl?.imageUrl as string}
            variant="extraSmall"
          />
        </View>
        <TouchableOpacity
          onPress={() => handleManageGroupNavigate()}
          style={styles.communityMangeButton}
        >
          <ManageGroupIcon width={20} height={20} color="#6744FF" />

          <Text style={styles.manageGroupText}>Manage Groups</Text>
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
          isCommunityGroup={stackInfo?.currentScreen === "CommunityGroup"}
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
    fontFamily: FONTS.inter.bold,

    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  groupHeaderText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: FONTS.inter.bold,
    marginVertical: 8,
  },
  universityContainer: {
    marginBottom: 16,
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
    alignItems: "center",
    alignSelf: "center",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    gap: 4,
    width: 236,
    height: 48,
    marginBottom: 32,
  },
  borderBottom: {},
  manageGroupText: {
    fontSize: 14,
    color: "#3A3B3C",
    fontFamily: FONTS.inter.medium,
  },
});
