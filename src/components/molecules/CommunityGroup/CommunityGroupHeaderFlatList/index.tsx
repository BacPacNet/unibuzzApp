import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import ReusableButton from "../../../atoms/ReusableButton";
import JoinGroupButton from "../../../atoms/JoinGroupButton";
import UniversityLogoPlaceHolder from "@/assets/unibuzz_rounded.svg";

type CommunityGroup = {
  title: string;
  description: string;
  users: { id: string }[];
};

type Props = {
  imageSrc: any;
  logoSrc: any;
  isGroupOfficial: boolean;
  isGroupPrivate: boolean;
  isUserJoinedCommunityGroup: any;
  isGroupAdmin: boolean;
  isUserVerifiedForCommunity: boolean;
  isJoinCommunityPending: boolean;
  logoSrcErr: boolean;
  setLogoSrcErr: (err: boolean) => void;
  ImageSrcErr: boolean;
  setImageSrcErr: (err: boolean) => void;
  communityGroups: CommunityGroup | any;
  userStatus: any;
  handleToggleJoinCommunityGroup: () => void;
  setModalVisible: (visible: boolean) => void;
  membersBottomSheet: React.RefObject<any>;
  communityLogoUrl: string;
};

const FlatListCommunityHeader: React.FC<Props> = ({
  imageSrc,
  logoSrc,
  isGroupOfficial,
  isGroupPrivate,
  isUserJoinedCommunityGroup,
  isGroupAdmin,
  isUserVerifiedForCommunity,
  isJoinCommunityPending,
  logoSrcErr,
  setLogoSrcErr,
  ImageSrcErr,
  setImageSrcErr,
  communityGroups,
  userStatus,
  handleToggleJoinCommunityGroup,
  setModalVisible,
  membersBottomSheet,
  communityLogoUrl,
}) => {
  const onSettingsPress = useCallback(
    () => setModalVisible(true),
    [setModalVisible]
  );

  const onJoinPress = useCallback(
    () => handleToggleJoinCommunityGroup(),
    [handleToggleJoinCommunityGroup]
  );

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            imageSrc && !ImageSrcErr
              ? imageSrc
              : "https://cdn.pixabay.com/photo/2017/08/20/12/13/architecture-2661547_1280.jpg",
        }}
        style={styles.image}
        onError={() => setImageSrcErr(true)}
      />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.imageContainer}>
              <View
                style={[
                  styles.imageWrapper,
                  isGroupOfficial && styles.officialBorder,
                ]}
              >
                {logoSrc && !logoSrcErr ? (
                  <Image
                    source={{ uri: logoSrc }}
                    style={styles.communityImage}
                    onError={() => setLogoSrcErr(true)}
                  />
                ) : (
                  <View style={styles.universityPlaceHolder}>
                    <UniversityLogoPlaceHolder
                      width={20}
                      height={20}
                      style={styles.communityImage}
                    />
                  </View>
                )}
              </View>
              {isGroupOfficial && (
                <View style={styles.badgeWrapper}>
                  {communityLogoUrl?.length ? (
                    <Image
                      source={{ uri: communityLogoUrl }}
                      style={styles.badgeImage}
                      onError={() => setLogoSrcErr(true)}
                    />
                  ) : (
                    <UniversityLogoPlaceHolder
                      width={12}
                      height={12}
                      style={styles.badgeImage}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
          <Text style={styles.title}>{communityGroups?.title}</Text>
        </View>

        <Text style={styles.description}>{communityGroups?.description}</Text>

        <TouchableOpacity onPress={() => membersBottomSheet.current?.show()}>
          <Text style={styles.members}>
            {communityGroups?.users.length} members
          </Text>
        </TouchableOpacity>

        {isUserJoinedCommunityGroup || isGroupAdmin ? (
          <ReusableButton
            buttonText="Settings"
            variant="shade"
            size="w-1/2"
            containerStyle="mt-2"
            onPress={onSettingsPress}
          />
        ) : (
          <JoinGroupButton
            isPrivate={isGroupPrivate}
            isVerified={isUserVerifiedForCommunity}
            isPending={isJoinCommunityPending}
            userStatus={userStatus}
            onClick={onJoinPress}
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(FlatListCommunityHeader);
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",

    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },

  content: {
    padding: 15,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3A3B3C",
    width: "60%",
    minWidth: 200,
    maxWidth: 250,
  },

  description: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 8,
  },
  members: {
    fontWeight: "bold",
    color: "#6744FF",
    fontSize: 12,
  },
  button: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
    height: 40,
    width: 163,
  },
  deActive: {
    backgroundColor: "white",
  },

  active: {
    backgroundColor: "#6744FF",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonTextActive: {
    color: "white",
  },

  communityImagePlaceHolder: {
    width: 46,
    height: 46,
    borderRadius: 200,

    overflow: "hidden",
  },

  officialBorder: {
    borderWidth: 2,
    borderColor: "#6647ff",
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
    resizeMode: "cover",
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

  universityPlaceHolder: {
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
