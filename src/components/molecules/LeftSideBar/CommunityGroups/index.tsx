import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import GroupSelectors from "../CommunityGroup";
import { Community, CommunityGroup } from "@/types/Community";
import { User } from "@/models/auth";

type Props = {
  communityGroups: CommunityGroup[];
  currSelectedGroup: Community | null;
  setCurrSelectedGroup: (group: Community | null) => void;
  userData: Partial<User>;
  isCommunityGroupsLoading?: boolean;
  communityLogo: string;
};

function CommunityGroupAll({
  communityGroups,

  currSelectedGroup,
  userData,

  setCurrSelectedGroup,

  isCommunityGroupsLoading,
  communityLogo,
}: Props) {
  const [showGroupTill, setShowGroupTill] = useState(5);

  if (isCommunityGroupsLoading || communityGroups == undefined)
    return <ActivityIndicator />;
  if (communityGroups?.length === 0)
    return (
      <Text className="text-center text-neutral-500 mt-4">
        No Groups Available
      </Text>
    );

  return (
    <>
      {communityGroups?.slice(0, showGroupTill).map((item: any) => (
        <GroupSelectors
          key={item._id}
          currSelectedGroup={currSelectedGroup}
          setCurrSelectedGroup={setCurrSelectedGroup}
          data={item}
          // userId={userData?.id}
          communityLogo={communityLogo}
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
