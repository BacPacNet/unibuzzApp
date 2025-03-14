import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import GroupSelectors from "../CommunityGroup";

function CommunityGroupAll({
  communityGroups,

  currSelectedGroup,
  userData,

  setCurrSelectedGroup,

  isCommunityGroupsLoading,
}: any) {
  const [showGroupTill, setShowGroupTill] = useState(5);

  if (isCommunityGroupsLoading || communityGroups === "undefined")
    return <ActivityIndicator />;
  if (communityGroups?.length === 0)
    return (
      <Text className="text-center text-neutral-500 mt-4">
        No Groups Available
      </Text>
    );

  return (
    <>
      {communityGroups?.map((item: any) => (
        <GroupSelectors
          key={item._id}
          currSelectedGroup={currSelectedGroup}
          setCurrSelectedGroup={setCurrSelectedGroup}
          data={item}
          userId={userData?.id}
        />
      ))}
      {communityGroups?.length > showGroupTill && (
        <TouchableOpacity
          onPress={() => setShowGroupTill(showGroupTill + 5)}
          className="flex items-center justify-center p-4"
        >
          <Text>Load More</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

export default CommunityGroupAll;
