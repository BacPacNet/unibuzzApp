import React, { useEffect, useMemo } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { Lock } from "iconoir-react-native";
import Globe from "@/assets/community/globe.svg";
import Balcony from "@/assets/community/uni.svg";
import EyeClosed from "@/assets/community/hidden.svg";
import {
  CommunityGroupAccess,
  CommunityGroupVisibility,
  GROUP_ACCESS_TOOLTIP_CONFIG,
} from "@/types/CommunityGroup";

const ICON_SIZE = 32;

export const renderGroupAccessIcon = (
  communityGroupAccess?: string,
  size = ICON_SIZE
) => {
  const isGroupPrivate =
    communityGroupAccess === CommunityGroupVisibility.PRIVATE;

  if (isGroupPrivate) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#F3F2FF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lock width={size * 0.5} height={size * 0.5} color="#6744FF" />
      </View>
    );
  }

  switch (communityGroupAccess) {
    case CommunityGroupAccess.UniversityWide:
      return <Balcony width={size} height={size} />;
    case CommunityGroupAccess.Hidden:
      return <EyeClosed width={size} height={size} />;
    default:
      return <Globe width={size} height={size} />;
  }
};

type GroupAccessTooltip = {
  title: string;
  description: string;
};

type Props = {
  communityGroupAccess?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  onTooltipChange?: (tooltip: GroupAccessTooltip) => void;
};

const PRIVATE_TOOLTIP: GroupAccessTooltip = {
  title: "Private",
  description:
    "Must request access to join the group. Only verified users can request access.",
};

const GroupAccessInfoTrigger: React.FC<Props> = ({
  communityGroupAccess,
  onPress,
  style,
  onTooltipChange,
}) => {
  const isGroupPrivate =
    communityGroupAccess === CommunityGroupVisibility.PRIVATE;

  const groupAccessTooltip = useMemo(() => {
    if (isGroupPrivate) return PRIVATE_TOOLTIP;
    return (
      GROUP_ACCESS_TOOLTIP_CONFIG[communityGroupAccess ?? ""] ??
      GROUP_ACCESS_TOOLTIP_CONFIG[CommunityGroupAccess.OpenCampus]
    );
  }, [communityGroupAccess, isGroupPrivate]);

  useEffect(() => {
    onTooltipChange?.(groupAccessTooltip);
  }, [groupAccessTooltip, onTooltipChange]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={isGroupPrivate ? style : undefined}
    >
      {renderGroupAccessIcon(communityGroupAccess)}
    </TouchableOpacity>
  );
};

export default React.memo(GroupAccessInfoTrigger);
