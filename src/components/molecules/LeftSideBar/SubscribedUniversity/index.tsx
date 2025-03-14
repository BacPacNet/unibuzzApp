import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import { Community } from "@/types/Community";
import { User } from "@/models/auth";
import ReusableButton from "@/components/atoms/ReusableButton";

interface Props {
  subscribedCommunities: Community[];
  communityId: string;
  userData: Partial<User>;
  handleCommunityClick: (index: string) => void;
  isGroup: boolean;
}

const NavbarSubscribedUniversity = ({
  subscribedCommunities,
  communityId,
  handleCommunityClick,
  isGroup,
}: Props) => {
  if (!subscribedCommunities || subscribedCommunities.length === 0) {
    return (
      <View>
        <ReusableButton buttonText="Add Your University" variant="primary" />
      </View>
    );
  }

  return subscribedCommunities?.map((item) => (
    <CommunityHolder
      community={item}
      key={item?._id}
      handleCommunityClick={handleCommunityClick}
      communityId={communityId}
      isGroup={isGroup}
    />
  ));
};

interface CommunityHolderProps {
  community: {
    _id: string;
    name: string;
    communityLogoUrl: { imageUrl: string };
  };

  handleCommunityClick: (index: string) => void;
  communityId: string;
  isGroup: boolean;
}

const CommunityHolder = ({
  community,

  handleCommunityClick,
  communityId,
  isGroup,
}: CommunityHolderProps) => {
  const [logoSrc, setLogoSrc] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => handleCommunityClick(community._id)}
      style={[
        styles.communityContainer,
        communityId === community._id && !isGroup ? styles.activeCommunity : {},
      ]}
    >
      <View style={styles.innerContainer}>
        {!logoSrc ? (
          <Image
            source={{ uri: community?.communityLogoUrl?.imageUrl }}
            style={styles.communityImage}
            onError={() => setLogoSrc(true)}
          />
        ) : (
          <UniversityLogoPlaceHolder
            width={40}
            height={40}
            style={styles.communityImage}
          />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.communityName}>{community.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  communityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    height: 80,
  },
  activeCommunity: {
    backgroundColor: "#f0f0f0",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  communityImage: {
    width: 40,
    height: 40,
    borderRadius: 200,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "80%",
  },
  communityName: {
    fontSize: 12,
  },
});

export default NavbarSubscribedUniversity;
