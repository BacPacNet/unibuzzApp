import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import CommunityGroupAll from "../../molecules/LeftSideBar/CommunityGroups";
import { Community, CommunityGroup } from "@/types/Community";
import { User } from "@/models/auth";

type Props = {
  communityLogo: string;
  currTab: string;
  setCurrTab: (value: string) => void;
  allGroups: CommunityGroup[];
  joinedGroups: CommunityGroup[];
  myGroups: CommunityGroup[];
  currSelectedGroup: Community | null;
  setCurrSelectedGroup: (group: Community | null) => void;
  userData: Partial<User>;
  isCommunityGroup: boolean;
  isloading?: boolean;
  communityId: string;
};

const CommunityGroupTabs = ({
  currTab,
  setCurrTab,
  allGroups,
  joinedGroups,
  myGroups,
  currSelectedGroup,
  setCurrSelectedGroup,
  userData,
  communityLogo,
  isCommunityGroup,
  isloading,
  communityId,
}: Props) => {
  const renderCurrentTabContent = () => {
    switch (currTab) {
      case "All":
        return (
          <CommunityGroupAll
            key={JSON.stringify(allGroups)}
            communityGroups={allGroups}
            currSelectedGroup={currSelectedGroup}
            setCurrSelectedGroup={setCurrSelectedGroup}
            userData={userData}
            communityLogo={communityLogo}
            isCommunityGroup={isCommunityGroup}
            selectCommunityId={communityId}
          />
        );
      case "Joined":
        return (
          <CommunityGroupAll
            key={JSON.stringify(joinedGroups)}
            communityGroups={joinedGroups}
            currSelectedGroup={currSelectedGroup}
            setCurrSelectedGroup={setCurrSelectedGroup}
            userData={userData}
            communityLogo={communityLogo}
            isCommunityGroup={isCommunityGroup}
            selectCommunityId={communityId}
            errMessage="You haven't joined any groups yet. Groups you join will appear here."
          />
        );
      case "My":
        return (
          <CommunityGroupAll
            key={JSON.stringify(myGroups)}
            communityGroups={myGroups}
            currSelectedGroup={currSelectedGroup}
            setCurrSelectedGroup={setCurrSelectedGroup}
            userData={userData}
            communityLogo={communityLogo}
            isCommunityGroup={isCommunityGroup}
            selectCommunityId={communityId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View>
      {/* <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setCurrTab("Joined")}>
          <Text style={currTab === "Joined" ? styles.activeTab : styles.tab}>
            Joined
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrTab("All")}>
          <Text style={currTab === "All" ? styles.activeTab : styles.tab}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrTab("My")}>
          <Text style={currTab === "My" ? styles.activeTab : styles.tab}>
            My Groups
          </Text>
        </TouchableOpacity>
      </View> */}

      {isloading ? (
        <ActivityIndicator color={"#6744FF"} />
      ) : (
        renderCurrentTabContent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 12,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  tab: {
    fontSize: 14,
    color: "gray",
    marginRight: 12,
  },
  activeTab: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    marginRight: 12,
  },
});

export default CommunityGroupTabs;
