import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Community } from "@/types/Community";
import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";
import OfficailLogoPlaceHolder from "@/assets/community/official-logo.svg";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { CommunityGroupTypeEnum } from "@/types/CommunityGroup";

type NavigationProp = StackNavigationProp<RootStackParamList, "Timeline">;

type Props = {
  communityLogo: string;
  data: any;
  currSelectedGroup: Community | null;
  setCurrSelectedGroup: (value: Community) => void;
  isCommunityGroup: boolean;
};
const GroupSelectors = ({
  currSelectedGroup,
  setCurrSelectedGroup,
  communityLogo,
  data,
  isCommunityGroup,
}: Props) => {
  const navigation = useNavigation<NavigationProp>();

  const handleGroupNavigate = () => {
    setCurrSelectedGroup(data);
    navigation.navigate("CommunityGroup", {
      communityId: data?.communityId,
      communityGroupId: data?._id,
      from: isCommunityGroup ? "CommunityGroup" : "Community",
    });
  };

  const isSelected = currSelectedGroup?._id === data?._id;
  const isGroupOfficial =
    data?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL;

  return (
    <TouchableOpacity
      onPress={handleGroupNavigate}
      style={[
        styles.container,
        isSelected && isCommunityGroup && styles.selected,
      ]}
    >
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          {data?.communityGroupLogoUrl?.imageUrl ? (
            <View
              style={[
                styles.imageWrapper,
                isGroupOfficial && styles.officialBorder,
              ]}
            >
              <Image
                source={{ uri: data.communityGroupLogoUrl.imageUrl }}
                style={styles.image}
              />
            </View>
          ) : (
            <View
              style={[
                styles.imageWrapper,
                isGroupOfficial && styles.officialBorder,
              ]}
            >
              <View style={styles.universityPlaceHolder}>
                <UniversityLogoPlaceHolder
                  width={20}
                  height={20}
                  style={styles.communityImage}
                />
              </View>
            </View>
          )}
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

        <Text
          style={[
            styles.label,
            isSelected ? styles.selectedText : styles.unselectedText,
          ]}
        >
          {data?.title || data?.communityGroupName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  selected: {
    backgroundColor: "#f0f0f0",
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 200,
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
  officialBorder: {
    borderWidth: 2,
    borderColor: "#6647ff",
  },
  communityImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  universityPlaceHolder: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
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

  icon: {
    fontSize: 40,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 20,
    color: "#6647FF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeHolderLogo: {
    width: 40,
    height: 40,
    borderRadius: 200,
  },
  label: {
    fontSize: 12,
  },
  selectedText: {
    fontWeight: "bold",
    color: "#333",
  },
  unselectedText: {
    fontWeight: "500",
    color: "#666",
  },
});

export default GroupSelectors;
