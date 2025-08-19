// import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import UniversityLogoPlaceHolder from "@/assets/avatarPlaceholder.png";
import { CommunityGroupTypeEnum } from "@/types/CommunityGroup";
import React, { useCallback, useState } from "react";
import OfficailLogoPlaceHolder from "@/assets/community/official-logo.svg";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const SearchCommunityGroupList: React.FC<{
  data: any;

  isFetching: boolean;
  handleNavigateToGroup: any;
}> = ({
  data,

  isFetching,
  handleNavigateToGroup,
}) => {
  const CommunityHolder = ({ item }: any) => {
    const [imageError, setImageError] = useState(false);

    const imageUrl = item?.communityGroupLogoUrl?.imageUrl;
    const isGroupOfficial =
      item?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL;

    return (
      <TouchableOpacity
        onPress={() => handleNavigateToGroup(item)}
        style={styles.communityContainer}
      >
        <View style={[styles.innerContainer]}>
          <View
            style={[
              styles.imageContainer,
              isGroupOfficial && styles.officialBorder,
            ]}
          >
            <Image
              source={
                !imageUrl || imageError
                  ? UniversityLogoPlaceHolder
                  : { uri: imageUrl }
              }
              style={styles.communityImage}
              onError={() => setImageError(true)}
            />
            {isGroupOfficial && (
              <View style={styles.badgeWrapper}>
                <OfficailLogoPlaceHolder
                  width={12}
                  height={12}
                  style={styles.badgeImage}
                />
              </View>
            )}
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.communityName}>{item?.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isFetching)
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );

  if (data?.length === 0) {
    return (
      <View className="py-4 ">
        <Text className="text-center">No Result Found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item?._id + index}
      initialNumToRender={10}
      renderItem={({ item }) => <CommunityHolder item={item} />}
      getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}
      removeClippedSubviews
    />
  );
};

export default SearchCommunityGroupList;

const styles = StyleSheet.create({
  communityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 86,
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
    width: 46,
    height: 46,
    borderRadius: 200,
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
    fontWeight: "500",
    lineHeight: 16,
  },
  officialBorder: {
    borderWidth: 2,
    borderColor: "#6647ff",
  },
  imageContainer: {
    position: "relative",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 360,
  },
  badgeWrapper: {
    position: "absolute",
    bottom: -10,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#6647ff",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeImage: {
    width: 12,
    height: 12,
    borderRadius: 6,
    objectFit: "contain",
  },
});
