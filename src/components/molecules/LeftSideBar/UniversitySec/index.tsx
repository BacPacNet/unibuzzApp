import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import NavbarSubscribedUniversity from "../SubscribedUniversity";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import {
  useGetFilteredSubscribedCommunities,
  useGetSubscribedCommunities,
} from "@/services/university-community";
import { Community } from "@/types/Community";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";
import CommunityGroupTabs from "@/components/organism/CommunityGroupTabs";
import { useNewCommunityGroupStatesContext } from "@/context/NewCommunityGroupStatesProvider/NewCommunityGroupStatesProvider";
import { FONTS } from "@/constants/fonts";
import CommunityDropdown from "../CommunityDropDown";
import { status } from "@/types/CommunityGroup";
import {
  getSelectedCommunityGroup,
  storeSelectedCommunityGroup,
} from "@/storage/selected-community-group";
import { TRACK_EVENT } from "@/content/constant";
import { trackMixpanel } from "@/mixpanel/track";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;
const UniversitySec = () => {
  const {
    currentCommunityId,
    currentCommunityGroupId,
    setSelectedCommunityGroupLogo,
    setSelectedCommunityId,
  } = useCommunityContext();

  const userData = getUserStore();
  const selectedCommunityGroup = getSelectedCommunityGroup();

  const {
    data: subscribedCommunities,
    isFetching,
    isLoading,
  } = useGetSubscribedCommunities();
  const navigation = useNavigation<NavigationProp>();
  const [currSelectedGroup, setCurrSelectedGroup] =
    useState<Community | null>();
  const [community, setCommunity] = useState<Community>();
  const [currTab, setCurrTab] = useState("Joined");
  const hasMutatedRef = useRef(false);
  const {
    mutate: mutateFilterCommunityGroups,
    data: filteredCommunityGroups,
    isPending,
  } = useGetFilteredSubscribedCommunities(community?._id || "");

  const handleCommunityClick = (id: string) => {
    trackMixpanel(TRACK_EVENT.UNIVERSITY_COMMUNITY_PAGE_VIEW, {
      communityId: id,
      communityName: subscribedCommunities?.find(
        (community) => community?._id === id
      )?.name,
    });
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

  const handleCommunityGroupClick = (communityId: string, logo: string) => {
    setCommunity(
      subscribedCommunities?.find((community) => community._id === communityId)
    );

    setSelectedCommunityGroupLogo(logo);
    setSelectedCommunityId(communityId);
    storeSelectedCommunityGroup(communityId, logo);

    hasMutatedRef.current = false;
  };

  const joinedSubscribedCommunitiesGroup = useMemo(() => {
    const groups = filteredCommunityGroups?.communityGroups || [];

    return groups.filter(
      (group: { users: any[]; adminUserId: string }) =>
        group.adminUserId === userData?.id ||
        group.users?.some(
          (u: { _id: string; status: string }) =>
            u._id === userData?.id && u.status === status.accepted
        )
    );
  }, [userData, filteredCommunityGroups, community]);

  useEffect(() => {
    if (selectedCommunityGroup) {
      setCommunity(
        subscribedCommunities?.find(
          (community) =>
            community._id === selectedCommunityGroup?.selectedCommunityGroupId
        )
      );

      setSelectedCommunityGroupLogo(
        selectedCommunityGroup?.selectedCommunityGroupLogo
      );
      setSelectedCommunityId(selectedCommunityGroup?.selectedCommunityGroupId);
    } else {
      setCommunity(subscribedCommunities?.[0] as Community);
    }
  }, [subscribedCommunities, selectedCommunityGroup]);

  useEffect(() => {
    if (!community?._id) return;

    const data = {
      selectedType: [],
      selectedFilters: [],
      sort: "userCountDesc",
    };

    mutateFilterCommunityGroups(data);
  }, [community?._id]);

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
        <View style={{ marginTop: 32 }}>
          <CommunityDropdown
            selectedCommunityImage={
              community?.communityLogoUrl?.imageUrl as string
            }
            subscribedCommunities={subscribedCommunities as Community[]}
            handleCommunityGroupClick={handleCommunityGroupClick}
            placeholder="Select Community"
            iconSize={16}
          />
        </View>

        <CommunityGroupTabs
          currTab={currTab}
          setCurrTab={setCurrTab}
          allGroups={[]}
          joinedGroups={joinedSubscribedCommunitiesGroup || []}
          myGroups={[]}
          currSelectedGroup={currSelectedGroup || null}
          communityId={community?._id || ""}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData || {}}
          communityLogo={
            currSelectedGroup?.communityLogoUrl?.imageUrl ||
            subscribedCommunities?.[0]?.communityLogoUrl?.imageUrl ||
            ""
          }
          isCommunityGroup={stackInfo?.currentScreen === "CommunityGroup"}
          isloading={isPending}
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

    marginBottom: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  groupHeaderText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: FONTS.inter.bold,
    marginVertical: 8,
  },
  universityContainer: {
    // marginBottom: 32,
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
