import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import Badge from "@/assets/badge.svg";

import { Community } from "@/types/Community";
import { User } from "@/models/auth";
import ReusableButton from "@/components/atoms/ReusableButton";
import CommunityLogo from "@/components/atoms/LogoHolder";

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
      <View style={styles.buttonContainer}>
        <ReusableButton buttonText="Add Your University" variant="primary" />
      </View>
    );
  }

  return subscribedCommunities?.map((item: any) => (
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
    isVerified: boolean;
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
        communityId === community._id && !isGroup && styles.activeCommunity,
      ]}
    >
      <View style={styles.innerContainer}>
        {/* {!logoSrc ? (
          <View style={styles.imageWrapper}>
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
          </View>
        ) : (
          <UniversityLogoPlaceHolder
            width={40}
            height={40}
            style={styles.communityImage}
          />
        )} */}
        <CommunityLogo logoUrl={community?.communityLogoUrl?.imageUrl} />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.communityName,
              communityId === community._id && !isGroup && styles.activeText,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    // borderRadius: 10,
    marginVertical: 4,
  },
  activeCommunity: {
    backgroundColor: "#E5E7FF",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  imageWrapper: {
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  communityImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "80%",
  },
  communityName: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
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
    marginHorizontal: 10,
  },
});

export default NavbarSubscribedUniversity;
