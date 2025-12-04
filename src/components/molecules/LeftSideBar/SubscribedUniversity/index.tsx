import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Badge from "@/assets/badge.svg";

import { Community } from "@/types/Community";
import { User } from "@/models/auth";
import ReusableButton from "@/components/atoms/ReusableButton";
import CommunityLogo from "@/components/atoms/LogoHolder";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { FONTS } from "@/constants/fonts";

interface Props {
  subscribedCommunities: Community[];
  communityId: string;
  userData: Partial<User>;
  handleCommunityClick: (index: string) => void;
  isGroup: boolean;
}

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;

const NavbarSubscribedUniversity = ({
  subscribedCommunities,
  communityId,
  handleCommunityClick,
  isGroup,
}: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const handleAddUniversity = () => {
    navigation.navigate("DiscoverStack", {
      screen: "Discover",
    });
  };
  if (!subscribedCommunities || subscribedCommunities.length === 0) {
    return (
      <View style={styles.buttonContainer}>
        <ReusableButton
          buttonText="Add Your University"
          variant="primary"
          onPress={handleAddUniversity}
        />
      </View>
    );
  }

  return (
    <View>
      {subscribedCommunities?.map((item: any) => (
        <CommunityHolder
          community={item}
          key={item?._id}
          handleCommunityClick={handleCommunityClick}
          communityId={communityId}
          isGroup={isGroup}
        />
      ))}
      <View style={[styles.buttonContainer, styles.lastButtonContainer]}>
        <ReusableButton
          buttonText="Add Your University"
          variant="shade"
          isRounded={false}
          onPress={handleAddUniversity}
          height="medium"
        />
      </View>
    </View>
  );
};

interface CommunityHolderProps {
  community: {
    _id: string;
    name: string;
    communityLogoUrl: { imageUrl: string };
    isVerified: boolean;
  };

  handleCommunityClick: (index: string) => void;
  communityId: string;
  isGroup: boolean;
  isLast?: boolean;
  isBorder?: boolean;
}

const CommunityHolder = ({
  community,
  handleCommunityClick,
  communityId,
  isGroup,
}: CommunityHolderProps) => {
  return (
    <TouchableOpacity
      onPress={() => handleCommunityClick(community._id)}
      style={[
        styles.communityContainer,
        communityId === community._id && !isGroup && styles.activeCommunity,
      ]}
    >
      <View style={[styles.innerContainer]}>
        <CommunityLogo
          logoUrl={community?.communityLogoUrl?.imageUrl}
          variant="large"
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.communityName,
              communityId === community._id && !isGroup && styles.activeText,
            ]}
            numberOfLines={2}
          >
            {community.name}
          </Text>

          {community?.isVerified && (
            <Badge width={16} height={16} style={styles.badge} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  communityContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  activeCommunity: {
    backgroundColor: "#E5E7FF",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "80%",
  },
  communityName: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: FONTS.inter.medium,
    maxWidth: "80%",
  },
  activeText: {
    fontWeight: "bold",
    color: "#111827",
  },
  badge: {
    width: 16,
    height: 16,
  },

  buttonContainer: {
    marginHorizontal: 24,
  },
  lastButtonContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 32,
    marginTop: 20,
  },
});

export default NavbarSubscribedUniversity;
