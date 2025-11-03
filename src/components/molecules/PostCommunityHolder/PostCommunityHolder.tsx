import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import UniversityLogoPlaceholder from "@/assets/LogoCircle.svg";
import { CheckCircleSolid } from "iconoir-react-native";
import CommunityAdminBadge from "@/assets/community/official-logo.svg";
import DropdownWrapper from "../SelectDropDownWrapper";

type Props = {
  logo: string;
  name: string;
  isVerified: boolean;
  isCommunityAdmin?: boolean;
};

const PostCommunityHolder = ({
  logo,
  name,
  isVerified,
  isCommunityAdmin = false,
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

  const getPopoverText = () => {
    if (isCommunityAdmin) return `Admin of ${name}`;
    if (isVerified) return `Verified for ${name}`;
    return `Joined ${name}`;
  };

  return (
    <View style={styles.container}>
      <DropdownWrapper
        position="top"
        viewTopPosition={70}
        viewLeftPosition={-100}
        renderDropdown={() => (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{getPopoverText()}</Text>
          </View>
        )}
      >
        <TouchableOpacity style={styles.logoContainer}>
          {!hasError ? (
            <Image
              source={logoSrc}
              onError={handleImageError}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <UniversityLogoPlaceholder width={32} height={32} />
          )}

          {/* Verified Badge */}
          {isVerified && !isCommunityAdmin && (
            <View style={styles.badgeContainer}>
              <CheckCircleSolid color={"#6744FF"} height={14} width={14} />
            </View>
          )}

          {/* Community Admin Badge */}
          {isCommunityAdmin && (
            <View style={[styles.badgeContainer, styles.adminBadge]}>
              <CommunityAdminBadge height={14} width={14} />
            </View>
          )}
        </TouchableOpacity>
      </DropdownWrapper>
    </View>
  );
};

export default PostCommunityHolder;

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  logoContainer: {
    width: 32,
    height: 32,
    position: "relative",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  badgeContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
  },
  adminBadge: {
    backgroundColor: "white",
  },
  tooltip: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 200,
  },
  tooltipText: {
    color: "#404040",
    fontSize: 12,
    fontWeight: "500",
  },
});
