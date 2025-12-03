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
  isCommunityGroup: boolean;
  selectCommunityId: string;
};

function CommunityGroupAll({
  communityGroups,

  currSelectedGroup,
  userData,

  setCurrSelectedGroup,

  isCommunityGroupsLoading,
  communityLogo,
  isCommunityGroup,
  selectCommunityId,
}: Props) {
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
      {communityGroups?.map((item: any) => (
        <GroupSelectors
          key={item._id}
          currSelectedGroup={currSelectedGroup}
          setCurrSelectedGroup={setCurrSelectedGroup}
          data={item}
          // userId={userData?.id}
          communityLogo={communityLogo}
          isCommunityGroup={isCommunityGroup}
          selectCommunityId={selectCommunityId}
        />
      ))}
    </>
  );
}

export default CommunityGroupAll;
