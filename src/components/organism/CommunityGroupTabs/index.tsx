import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CommunityGroupAll from "../../molecules/LeftSideBar/CommunityGroups";

const CommunityGroupTabs = ({
  currTab,
  setCurrTab,
  allGroups,
  joinedGroups,
  myGroups,
  currSelectedGroup,
  setCurrSelectedGroup,
  userData,
}: any) => {
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <View>
      <View style={styles.tabContainer}>
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
      </View>

      {renderCurrentTabContent()}
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
