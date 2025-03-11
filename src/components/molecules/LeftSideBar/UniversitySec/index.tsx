import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import NavbarSubscribedUniversity from "../SubscribedUniversity";
import { getUserStore } from "@/storage/user";
import { useGetSubscribedCommunities } from "@/services/university-community";
import { Community } from "@/types/Community";
import CommunityGroupAll from "../CommunityGroups";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCommunityContext } from "@/context/CommunityProvider/CommunityProvider";
import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FilterList } from "iconoir-react-native";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;
const UniversitySec = () => {
  const { currentCommunityId, currentCommunityGroupId } = useCommunityContext();

  const userData = getUserStore();
  const {
    data: subscribedCommunities,
    isFetching,
    isLoading,
  } = useGetSubscribedCommunities();
  const navigation = useNavigation<NavigationProp>();
  const [currSelectedGroup, setCurrSelectedGroup] = useState<Community>();
  const [community, setCommunity] = useState<Community>();
  const [logoSrc, setLogoSrc] = useState(community?.communityLogoUrl.imageUrl);

  const handleCommunityClick = (id: string) => {
    navigation.navigate("Community", { communityId: id });
    setCurrSelectedGroup(community);
  };

  const handleManageGroupNavigate = () => {
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
            selectCommunityGroup?.userId?.toString() ===
            userData?.id?.toString()
        )
      )
      ?.filter((group) => group.title.toLowerCase());
  }, [subscribedCommunities, currentCommunityId, userData]);

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

  useEffect(() => {
    setLogoSrc(community?.communityLogoUrl.imageUrl);
  }, [community]);

  return (
    <View>
      <Text style={styles.headerText}>Universities</Text>
      <NavbarSubscribedUniversity
        userData={userData || {}}
        communityId={currentCommunityId || ""}
        subscribedCommunities={subscribedCommunities as Community[]}
        handleCommunityClick={handleCommunityClick}
        isGroup={!!currentCommunityGroupId}
      />

      <View className="mt-4">
        <Text style={styles.headerText}>University Groups</Text>
        <View style={styles.communityImageContainer}>
          {logoSrc ? (
            <Image
              source={{ uri: community?.communityLogoUrl?.imageUrl }}
              style={styles.communityImage}
              onError={() => setLogoSrc("")}
            />
          ) : (
            <UniversityLogoPlaceHolder
              width={40}
              height={40}
              style={styles.communityImage}
            />
          )}

          <TouchableOpacity
            onPress={() => handleManageGroupNavigate()}
            style={styles.communityMangeButton}
          >
            <FilterList width={22} height={22} color="#6744FF" />
            <Text className="text-neutral-800">Manage Groups</Text>
          </TouchableOpacity>
        </View>
        <CommunityGroupAll
          key={joinedSubscribedCommunitiesGroup}
          communityGroups={joinedSubscribedCommunitiesGroup}
          currSelectedGroup={currSelectedGroup as Community}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData}
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
    fontSize: 12,
    color: "#6B7280",
    padding: 16,
  },

  UpgradeText: {
    fontSize: 14,
    color: "#6744FF",
  },
  communityImage: {
    width: 40,
    height: 40,
    borderRadius: 200,
  },
  communityImageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    padding: 16,
  },
  communityMangeButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 16,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    gap: 4,
  },
});
