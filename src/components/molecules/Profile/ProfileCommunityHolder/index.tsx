import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import UniversityLogoPlaceholder from "@/assets/LogoCircle.svg";
import { CheckCircleSolid } from "iconoir-react-native";
import OfficailLogoPlaceHolder from "@/assets/community/official-logo.svg";
import DropdownWrapper from "../../SelectDropDownWrapper";
type Props = {
  logo: string;
  name: string;
  isVerified: boolean;
  isActive: boolean;
  isCommunityAdmin: boolean;
};

const ProfileCommunityHolder = ({
  logo,
  name,
  isVerified,
  isActive,
  isCommunityAdmin,
}: Props) => {
  const [logoSrc, setLogoSrc] = useState<{ uri: string } | number>({
    uri: logo,
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLogoSrc({ uri: logo });
    setHasError(false);
  }, [logo]);

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.logoContainer}>
          {!hasError ? (
            <Image
              source={logoSrc}
              onError={handleImageError}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <UniversityLogoPlaceholder
              width={36}
              height={36}
              style={styles.logo}
            />
          )}
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>

          {isVerified && !isCommunityAdmin && (
            <CheckCircleSolid color={"#6744FF"} height={16} width={16} />
          )}

          {isCommunityAdmin && (
            <OfficailLogoPlaceHolder
              height={16}
              width={16}
              style={styles.badgeImage}
            />
          )}
        </View>

        {isActive && (
          <View style={styles.activeWrapper}>
            <DropdownWrapper
              position="top"
              viewTopPosition={60}
              viewLeftPosition={-60}
              renderDropdown={(closeDropdown) => (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>
                    Your profile is currently associated with this university.
                  </Text>
                </View>
              )}
            >
              <TouchableOpacity style={styles.activeButton}>
                <Text style={styles.activeButtonText}>Active</Text>
              </TouchableOpacity>
            </DropdownWrapper>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileCommunityHolder;

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoContainer: {
    width: 37,
    height: 37,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    gap: 4,
  },
  name: {
    color: "#737373",
    fontWeight: "500",
    fontSize: 12,
  },
  badge: {
    width: 16,
    height: 16,
    position: "absolute",
    top: 20,
    left: 21,
  },
  adminBadge: {
    backgroundColor: "white",
    borderRadius: 8,
  },
  activeWrapper: {
    position: "relative",
    marginLeft: 8,
  },
  tooltip: {
    width: 215,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipText: {
    color: "#404040",
    fontSize: 12,
    fontWeight: "500",
  },

  badgeImage: {
    width: 12,
    height: 12,
    borderRadius: 6,
    objectFit: "contain",
  },
  activeButton: {
    backgroundColor: "#F0EFFF",
    borderWidth: 1,
    borderColor: "#E9E8FF",
    borderRadius: 6,
    width: 89,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  activeButtonText: {
    color: "#6744FF",
    fontSize: 11,
    fontWeight: "500",
  },
});
