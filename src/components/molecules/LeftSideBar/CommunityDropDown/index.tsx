import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import UniversityLogoPlaceholder from "@/assets/LogoCircle.svg";
import { NavArrowDown } from "iconoir-react-native";
import DropdownWrapper from "../../SelectDropDownWrapper";
import { FONTS } from "@/constants/fonts";

type Community = {
  _id: string;
  name: string;
  communityLogoUrl: { imageUrl: string };
};

type Props = {
  selectedCommunityImage: string;
  subscribedCommunities: Community[];
  handleCommunityGroupClick: (communityId: string, logo: string) => void;
  placeholder: any;
  iconSize?: number;
  isLableShown?: boolean;
  isApplicantUser?: boolean;
  logoSize?: number;
  subLogoSize?: number;
};

const CommunityDropdown = ({
  selectedCommunityImage,
  subscribedCommunities,
  handleCommunityGroupClick,
  placeholder,
  iconSize = 16,
  isLableShown = true,
  isApplicantUser = false,
  logoSize = 24,
  subLogoSize = 24,
}: Props) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    selectedCommunityImage || null
  );

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setSelectedImage(selectedCommunityImage);
    setHasError(false);
  }, [selectedCommunityImage]);

  const handleError = () => {
    setHasError(true);
  };

  const triggerContent = (
    <>
      {isLableShown && <Text style={styles.groupText}>GROUPS</Text>}
      {isApplicantUser ? (
        <View style={styles.logoContainer}>
          {!hasError && selectedImage && selectedImage?.length > 0 ? (
            <Image
              source={{ uri: selectedImage }}
              style={[styles.logo, { width: logoSize, height: logoSize }]}
              resizeMode="contain"
              onError={handleError}
            />
          ) : (
            <UniversityLogoPlaceholder width={24} height={24} />
          )}
          <NavArrowDown width={iconSize} height={iconSize} strokeWidth={2} />
        </View>
      ) : null}
    </>
  );

  if (!isApplicantUser) {
    return (
      <View style={styles.container}>
        <View
          style={[styles.trigger, { paddingStart: isLableShown ? 24 : 0 }]}
        >
          {triggerContent}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DropdownWrapper
        position="bottom"
        viewLeftPosition={0}
        viewTopPosition={-50}
        renderDropdown={(closeDropdown) => (
          <View style={styles.dropdown}>
            <FlatList
              data={subscribedCommunities}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    closeDropdown();
                    handleCommunityGroupClick(
                      item._id,
                      item.communityLogoUrl.imageUrl
                    );
                    setSelectedImage(item.communityLogoUrl.imageUrl);
                  }}
                >
                  {item.communityLogoUrl.imageUrl &&
                  item.communityLogoUrl.imageUrl?.length > 0 ? (
                    <Image
                      source={{ uri: item.communityLogoUrl.imageUrl }}
                      style={[
                        styles.itemLogo,
                        { width: subLogoSize, height: subLogoSize },
                      ]}
                      resizeMode="contain"
                      onError={handleError}
                    />
                  ) : (
                    <UniversityLogoPlaceholder width={24} height={24} />
                  )}
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      >
        <TouchableOpacity
          style={[styles.trigger, { paddingStart: isLableShown ? 24 : 0 }]}
          activeOpacity={0.7}
        >
          {triggerContent}
        </TouchableOpacity>
      </DropdownWrapper>
    </View>
  );
};

export default CommunityDropdown;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingEnd: 24,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 999,
    gap: 8,
    paddingVertical: 8,

    // marginTop: 32,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  dropdown: {
    width: 236,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  itemLogo: {
    borderRadius: 12,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#404040",
    flex: 1,
  },
  groupText: {
    fontSize: 14,
    fontFamily: FONTS.inter.bold,
    color: "#6B7280",
  },
});
